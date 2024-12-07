# video_processing.py
import cv2
import numpy as np
from ultralytics import YOLO
import threading
import logging

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(threadName)s - %(message)s'
)

# Загрузка модели YOLO
try:
    model = YOLO("yolo11m.pt")  # Убедитесь, что модель находится в указанном пути
    model.to("cpu")  # Если у вас есть GPU, замените "cpu" на "cuda"
    logging.info("Модель YOLO успешно загружена и перемещена на CPU.")
except Exception as e:
    # logging.error(f"Ошибка при загрузке модели YOLO: {e}")
    raise e

# Блокировка для потокобезопасного доступа к модели
model_lock = threading.Lock()

def process_frame_yolo(frame, prev_gray, car_classes, confidence_threshold):
    """
    Обработка одного кадра с использованием YOLO для детекции объектов и оптического потока для трекинга.
    Возвращает плотность и среднюю скорость.
    """
    try:
        with model_lock:
            results = model(frame)  # Модель выполняет предсказание на кадре

        # Обработка детекций
        boxes = results[0].boxes.xywh.cpu().numpy()          # Координаты обнаруженных объектов
        confidences = results[0].boxes.conf.cpu().numpy()    # Уверенность в детектировании объектов
        classes = results[0].boxes.cls.cpu().numpy().astype(int)  # Классы обнаруженных объектов

        # Фильтрация по порогу уверенности и классам транспортных средств
        mask = (confidences > confidence_threshold) & np.isin(classes, car_classes)
        filtered_boxes = boxes[mask]
        traffic_density = len(filtered_boxes)  # Плотность трафика

        if traffic_density == 0:
            return traffic_density, 0, prev_gray

        # Используем оптический поток для вычисления скорости
        if prev_gray is None:
            prev_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            return traffic_density, 0, prev_gray

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        flow = cv2.calcOpticalFlowFarneback(
            prev_gray, gray, None,
            pyr_scale=0.5, levels=3, winsize=15,
            iterations=3, poly_n=5, poly_sigma=1.2, flags=0
        )
        dx, dy = flow[..., 0], flow[..., 1]

        # Средняя скорость (модуль скорости)
        speed = np.sqrt(dx**2 + dy**2)
        avg_speed = np.mean(speed)

        prev_gray = gray

        return traffic_density, avg_speed, prev_gray
    except Exception as e:
        logging.error(f"Ошибка при обработке кадра: {e}")
        return 0, 0, prev_gray
