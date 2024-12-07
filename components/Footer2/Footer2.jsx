import React from "react";
import styles from "./Footer2.module.css";

const Footer2 = () => {
    return(
        <footer className={styles.Footer}>
            <h1 className={styles.FooterHeader}>ЦОДД Краснодара</h1>
            <div className={styles.footerInfo}>
                <div className={styles.Gray}>
                    <ul>
                        <li>ГКУ КК «ЦОДД»</li>
                        <br></br>
                        <a className={styles.Gray} href="https://yandex.ru/maps/35/krasnodar/house/rashpilevskaya_ulitsa_157/Z0EYfwBjTE0PQFpvfXx1cHhgZg==/?indoorLevel=1&ll=38.973589%2C45.041432&source=serp_navig&z=17.14"
                        target="_blank">350007 Российская Федерация Краснодарский край г. Краснодар ул. Рашпилевская, 157</a>
                        
                    </ul>
                    <ul className={styles.Black}>
                        <p>Телефон:<a className={styles.Black} href="tel:+78619912850"> +7 (861) 991-28-50</a></p>
                        <p></p>
                        <p>Email:<a className={styles.Black} href="mailto:codd@codd.krasnodar.ru"> codd@codd.krasnodar.ru</a></p>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer2