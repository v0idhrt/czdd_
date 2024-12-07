import React, { useState } from "react";
import styles from "./MiddleSpeed.module.css";

const MiddleSpeedValues = () => {
    const [middleSpeed, setMiddleSpeed] = useState(1);

    const getMiddleSpeedClass = (value) => {
        if (value <= 10) return styles.brown; // Бурый
        if (value <= 20) return styles.red; // Красный
        if (value <= 30) return styles.yellowGreen; // Оранжевый
        if (value <= 40) return styles.green; // Светло-оранжевый
        if (value <= 50) return styles.green; // Желто-зеленый
        if (value <= 60) return styles.green; // Зеленый
        return styles.green; // Пустая строка для значений выше 60
    }

    return (
            <div className={styles.ValuesWrapper}>
                <h1 className={styles.WritingSpeed}>Средняя скорость
                потока</h1>
                <h1 className={`${styles.MiddleSpeed} ${getMiddleSpeedClass(middleSpeed)}`}>
                    {middleSpeed} км/ч
                </h1>
            </div>
    );
}

export default MiddleSpeedValues;