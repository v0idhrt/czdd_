import React from "react";
import styles from "./MiddleSpeed.module.css";

const MiddleSpeedValues = ({ value, trafficColor }) => {
  return (
    <div className={styles.MiddleSpeedWrapper}>
      <div className={styles.ValuesWrapper}>
        <h1 className={styles.WritingSpeed}>Средняя скорость потока</h1>
        <h1
          className={styles.MiddleSpeed}
          style={{ color: trafficColor }}
        >
          {value} км/ч
        </h1>
      </div>
    </div>
  );
};

export default MiddleSpeedValues;
