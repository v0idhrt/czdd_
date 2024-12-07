import React from "react";
import styles from "./Switch.module.css"
import { useState } from "react";

const Switch = () => {
    const[role, setRole] = useState("user");

    const toggleRole = (role) => {
        console.log(role);
        setRole(role);
    }

    return(
        <label className={styles.switch}>
            <div className={styles.rolesWrapper}>
                <h1 className={role === "user" ? styles.activeText : styles.inactiveText}>Водитель</h1>
                <h1 className={role === "user" ? styles.inactiveText : styles.activeText}>Сотрудник ЦОДД</h1>
            </div>
            <input type="checkbox" onChange={() => toggleRole(role === "user" ? "admin" : "user")}  />
            <span className={styles.slider}/>
        </label>
    )
}

export default Switch