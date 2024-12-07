import React from "react";
import styles from "./About.module.css"
import Star from "../../assets/star.svg?react"
import Car from "../../assets/car.svg?react"
import User from "../../assets/users.svg?react"


const About = () => {

    const contentArray = [
        [<Star />, 'О ЦОДД', 'Помогаем улучшать дорожную ситуацию на улицах нашего города'],
        [<Car />, 'Транcпорт', 'Безопасные дороги и комфортное движение для каждого жителя города'],
        [<User />, 'Вакансии', 'Присоединяйтесь к команде, создающей безопасное и комфортное движение города']
    ]

    return(
        <div className={styles.AboutWrapper}>
            <h1 className={styles.AboutHeader}>О нас</h1>
            <div className={styles.AboutContent}>
                <div className={styles.AboutDefaultWrapper}>
                    <div className={styles.IconWrapper}>
                        {contentArray[0][0]}
                    </div>
                    <h1 className={styles.AboutDefaultHeader}>{contentArray[0][1]}</h1>
                    <p className={styles.AboutDefaultWriting}>{contentArray[0][2]}</p>
                </div>
                <div className={styles.AboutDefaultWrapper}>
                <div className={styles.IconWrapper}>
                        {contentArray[1][0]}
                    </div>
                    <h1 className={styles.AboutDefaultHeader}>{contentArray[1][1]}</h1>
                    <p className={styles.AboutDefaultWriting}>{contentArray[1][2]}</p>
                </div>
                <div className={styles.AboutDefaultWrapper}>
                <div className={styles.IconWrapper}>
                        {contentArray[2][0]}
                    </div>
                    <h1 className={styles.AboutDefaultHeader}>{contentArray[2][1]}</h1>
                    <p className={styles.AboutDefaultWriting}>{contentArray[2][2]}</p>
                </div>
            </div>
        </div>
    )
}

export default About