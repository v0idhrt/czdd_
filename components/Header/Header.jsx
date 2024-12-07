import React from "react";
import styles from "./Header.module.css"


const Header = () => {
    return(
        <header className={styles.Header}>
            <a href="/">
                <h1 className={styles.HeaderHead}>ЦОДД Краснодара</h1>
            </a>
            <div className={styles.links}>
                <a href="/actual">Актуальное</a>
                <a href="/map">Карта</a>
            </div>
        </header>
    )
}

export default Header