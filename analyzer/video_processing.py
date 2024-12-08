# video_processing.py
import cv2
import numpy as np
from ultralytics import YOLO
import threading
import logging
from config import METERS_PER_PIXEL

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(threadName)s - %(message)s'
)

try:
    model = YOLO("yolo11m.pt")  # Убедитесь, что модель находится в указанном пути
    model.to("cpu")  # Если у вас есть GPU, замените "cpu" на "cuda"
    logging.info("Модель YOLO успешно загружена и перемещена на CPU.")
except Exception as e:
    # logging.error(f"Ошибка при загрузке модели YOLO: {e}")
    raise e

model_lock = threading.Lock()

def process_frame_yolo(frame, prev_gray, car_classes, confidence_threshold, prev_avg_speed=0):
    """
    Обработка одного кадра для расчета плотности трафика и средней скорости.
    """
    try:
        with model_lock:
            results = model(frame)  # Предсказание с помощью YOLO

        # Обработка детекций
        boxes = results[0].boxes.xywh.cpu().numpy()          # Координаты объектов
        confidences = results[0].boxes.conf.cpu().numpy()    # Уверенность
        classes = results[0].boxes.cls.cpu().numpy().astype(int)  # Классы объектов

        # Фильтрация по порогу уверенности и классам
        mask = (confidences > confidence_threshold) & np.isin(classes, car_classes)
        filtered_boxes = boxes[mask]
        traffic_density = len(filtered_boxes)  # Количество автомобилей

        # Если объектов нет, возвращаем текущие результаты
        if traffic_density == 0:
            return traffic_density, 0, prev_gray

        # Оценка доли занятой площади
        total_area = frame.shape[0] * frame.shape[1]
        occupied_area = sum(w * h for _, _, w, h in filtered_boxes)
        traffic_density = min(11, 1 + (occupied_area / total_area) * 10) * 3.6  # Масштабируем от 1 до 11

        # Если предыдущий кадр отсутствует, инициализируем prev_gray
        if prev_gray is None:
            prev_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            return traffic_density, 0, prev_gray

        # Преобразуем кадры в оттенки серого
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Рассчитываем оптический поток для каждой ROI
        flows = []
        for x, y, w, h in filtered_boxes:
            x, y, w, h = map(int, [x, y, w, h])  # Преобразование координат в int
            roi_prev = prev_gray[y:y+h, x:x+w]
            roi_curr = gray[y:y+h, x:x+w]

            # Рассчитываем оптический поток
            flow = cv2.calcOpticalFlowFarneback(
                roi_prev, roi_curr, None,
                pyr_scale=0.5, levels=3, winsize=15,
                iterations=3, poly_n=5, poly_sigma=1.2, flags=0
            )
            dx, dy = flow[..., 0], flow[..., 1]
            speeds = np.sqrt(dx**2 + dy**2)
            flows.append(np.mean(speeds))  # Средняя скорость внутри ROI

        # Средняя скорость по всем ROI
        avg_speed_pixels = np.mean(flows) if flows else 0

        # Конвертируем скорость в метры в секунду
        avg_speed_m_per_s = avg_speed_pixels * 2.3 * 3.6

        # Экспоненциальное сглаживание
        alpha = 0.3
        smoothed_speed = alpha * avg_speed_m_per_s + (1 - alpha) * prev_avg_speed

        # Обновляем предыдущий кадр
        prev_gray = gray

        return traffic_density, smoothed_speed, prev_gray
    except Exception as e:
        logging.error(f"Ошибка при обработке кадра: {e}")
        return 0, 0, prev_gray