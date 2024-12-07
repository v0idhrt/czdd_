import React from "react";
import styles from "./Blocking.module.css";
import Ellipse from "../../assets/Ellipse.svg?react";

const Blocking = () => {
    const getInfo = [['ул. Тургенева'], ['ул. Северная'], ['ул. Красная']];

    return (
        <div className={styles.Blocking}>
            <div className={styles.Name}>
                <Ellipse />
                <h1 className={styles.BlockingHeader}>Наибольшие заторы</h1>
            </div>
            <div className={styles.Content}>
                {getInfo.map((info, index) => (
                    <p key={index} className={styles.Streets}>{info}</p>
                ))}
            </div>
        </div>
    );
}

export default Blocking;