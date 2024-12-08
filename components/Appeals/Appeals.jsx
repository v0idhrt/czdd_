import React from "react";
import Appeals from "../../assets/Appeals.svg?react";
import styles from "./Appeals.module.css";

const AppealsComp = () => {
    return(
        <div className={styles.AppealsWrapper}>
            <div className={styles.AppealsVisual}>
                <div className={styles.iconWrapper}><Appeals /></div>
                <h1 className={styles.AppealsHeader}>Обращения</h1>
                <p className={styles.AppealsText}>Имеются какие-то вопросы или предложения?
                Напишите нам!</p>
            </div>
            <button className={styles.AppealsButton}>Написать обращение</button>
        </div>
    )
}

export default AppealsComp;