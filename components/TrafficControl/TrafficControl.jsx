import React from "react";
import styles from "./TrafficControl.module.css";

const TrafficControl = ({ value, setSpeedColor }) => {
  const getTrafficColor = (value) => {
    switch (value) {
      case 1:
        return "#00FF00"; // Ярко-зеленый
      case 2:
        return "#66FF00"; // Светло-зеленый
      case 3:
        return "#99FF00"; // Зеленый с желтым оттенком
      case 4:
        return "#CCFF00"; // Желто-зеленый
      case 5:
        return "#FFFF00"; // Ярко-желтый
      case 6:
        return "#FFCC00"; // Золотистый
      case 7:
        return "#FF9900"; // Оранжевый
      case 8:
        return "#FF6600"; // Темно-оранжевый
      case 9:
        return "#FF3300"; // Красный
      case 10:
        return "#CC0000"; // Темно-красный
      default:
        return "#8B1313"; // Бурый для значений выше 10
    }
  };

  const getClimax = (value) => {
    if (value === 1) return "Балл";
    if (value >= 2 && value <= 4) return "Балла";
    return "Баллов"; // Для значений от 5 и выше
  };

  const getBorderColor = (value) => {
    const color = getTrafficColor(value);
    return `${color}77`; // Прозрачность 0.47 (77 в шестнадцатеричном формате)
  };

  // Передаем цвет в компонент `MiddleSpeed`
  const trafficColor = getTrafficColor(value);
  setSpeedColor(trafficColor);

  return (
    <div className={styles.TrafficWrapper}>
      <div className={styles.TrafficVisual}>
        <div
          className={styles.TrafficBorder}
          style={{ backgroundColor: getBorderColor(value) }}
        >
          <div
            className={styles.TrafficValue}
            style={{ backgroundColor: trafficColor }}
          >
            {value}
          </div>
        </div>
        <h1 className={styles.ClimaxText}>{getClimax(value)}</h1>
      </div>
      <h1 className={styles.TrafficHeader}>Ситуация на дороге</h1>
    </div>
  );
};

export default TrafficControl;
