import React from "react";
import styles from "./Blocking.module.css";
import Ellipse from "../../assets/Ellipse.svg?react";
import { useState } from "react";

const Blocking = ({ values = [{
    "road_name": "./videos/camera5.mp4",
    "latitude": 55.7522,
    "longitude": 37.6173,
    "congestion_level": 11
},] }) => { // Установите значение по умолчанию для values
console.log(values)
    return (
        <div className={styles.Blocking}>
            <div className={styles.Name}>
                <Ellipse />
                <h1 className={styles.BlockingHeader}>Наибольшие заторы</h1>
            </div>
            <div className={styles.Content}>
                {values.length > 0 ? ( // Проверка на наличие элементов в массиве
                    values.map((item, index) => ( // Измените value на item
                        <p key={index} className={styles.Streets}>{item.road_name}</p>
                         // Извлечение road_name
                    ))
                ) : (
                    <p className={styles.NoData}>Нет данных о заторах</p> // Сообщение, если массив пуст
                )}
            </div>
        </div>
    );
}

export default Blocking;