# app.py
import cv2
import threading
import time
import numpy as np
from flask import Flask, jsonify
from video_processing import process_frame_yolo, model_lock
from config import VIDEO_PATHS, METERS_PER_PIXEL  # Подключение конфигурации
import concurrent.futures
import logging

app = Flask(__name__)

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(threadName)s - %(message)s'
)

# Классы транспортных средств: автомобиль, автобус, грузовик
CAR_CLASSES = [2, 5, 7]  # Эти номера соответствуют классам в модели YOLO

# Порог уверенности для детектирования объектов
CONFIDENCE_THRESHOLD = 0.5
METERS_PER_PIXEL = 1.2
# Переменные для хранения состояния дороги для каждого видео
traffic_states = {
    video_path: {"traffic_density": 1, "average_speed": 0}  # Начальная загруженность 1
    for video_path in VIDEO_PATHS
}

# Мьютекс для безопасного доступа к traffic_states
traffic_state_lock = threading.Lock()

def convert_np_to_builtin(obj):
    """
    Рекурсивно преобразует объект, содержащий numpy объекты (например, float32), в стандартные типы Python (например, float).
    """
    if isinstance(obj, np.ndarray):
        return obj.astype(float).tolist()
    elif isinstance(obj, dict):
        return {key: convert_np_to_builtin(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_np_to_builtin(item) for item in obj]
    elif isinstance(obj, np.generic):
        return float(obj)  
    else:
        return obj 

def scale_traffic_density(traffic_density, max_density=10):
    """
    Масштабирует плотность трафика от 1 до 11.
    """
    scaled_density = 1 + (traffic_density / max_density) * 7
    return min(max(scaled_density, 1), 11)  # Ограничиваем значение между 1 и 11

def convert_speed_to_kmh(avg_speed, meters_per_pixel, fps):
    """
    Конвертирует среднюю скорость из пикселей/кадр в километры/час.
    """
    # Скорость в метрах/секунду: пикселей/кадр * метры/пиксель * кадры/секунда
    speed_m_per_s = avg_speed * meters_per_pixel * fps
    speed_kmh = speed_m_per_s * 3.6
    return speed_kmh

def update_traffic_state(video_path):
    """Фоновая функция для обновления состояния дороги для конкретного видео"""
    try:
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            logging.error(f"Не удалось открыть видео: {video_path}")
            return

        fps = cap.get(cv2.CAP_PROP_FPS)  # Получаем FPS видео
        if fps == 0:
            fps = 2  # Устанавливаем значение по умолчанию, если не удалось получить FPS
            logging.warning(f"Не удалось получить FPS для {video_path}. Используем значение по умолчанию: {fps} FPS")
        logging.info(f"Processing video: {video_path} at {fps} FPS")

        prev_gray = None  
        frame_count = 0
        total_density = 0
        total_speed = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                logging.info(f"End of video {video_path}, restarting...")
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                prev_gray = None
                continue  # Переходим к следующему кадру

            traffic_density, avg_speed, prev_gray = process_frame_yolo(
                frame, prev_gray, CAR_CLASSES, CONFIDENCE_THRESHOLD
            )

            scaled_density = scale_traffic_density(traffic_density)

            speed_kmh = convert_speed_to_kmh(avg_speed, METERS_PER_PIXEL, fps)

            rounded_speed_kmh = round(speed_kmh)

            total_density += scaled_density
            total_speed += rounded_speed_kmh
            frame_count += 1

            with traffic_state_lock:  # Синхронизация доступа к traffic_states
                traffic_states[video_path] = {
                    "traffic_density": scaled_density,
                    "average_speed": rounded_speed_kmh  # Сохраняем округленное значение
                }

            logging.info(
                f"Видео {video_path} - Кадр {frame_count}: Плотность = {scaled_density:.2f}, Средняя скорость = {rounded_speed_kmh} км/ч"
            )

            time.sleep(1 / fps)  # Интервал, равный одному кадру видео

    except Exception as e:
        logging.error(f"Ошибка при обработке видео {video_path}: {e}")
    finally:
        cap.release()
        logging.info(f"Обработка видео {video_path} завершена. Обработано {frame_count} кадров.")

@app.route('/current_traffic_state', methods=['GET'])
def get_traffic_state():
    """API для получения текущего состояния дороги для всех видео"""
    with traffic_state_lock:  # Синхронизация доступа к traffic_states
        traffic_states_serializable = convert_np_to_builtin(traffic_states)
        return jsonify(traffic_states_serializable)

def main():
    """
    Главная функция для одновременной обработки нескольких видео.
    """
    max_workers = min(5, len(VIDEO_PATHS))  # Ограничиваем количество потоков до количества видео

    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Запуск обработки каждого видео в отдельном потоке
        futures = {executor.submit(update_traffic_state, path): path for path in VIDEO_PATHS}

        for future in concurrent.futures.as_completed(futures):
            path = futures[future]
            try:
                future.result()
            except Exception as e:
                logging.error(f"Ошибка при обработке видео {path}: {e}")

    logging.info("Обработка всех видео завершена.")

if __name__ == '__main__':
    flask_thread = threading.Thread(target=lambda: app.run(host='0.0.0.0', port=5000, threaded=True), daemon=True)
    flask_thread.start()
    logging.info("Flask-сервер запущен.")

    main()
