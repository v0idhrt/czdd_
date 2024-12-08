import React from "react";
import RoadRight from "../../assets/RoadRight.svg?react"
import RoadLeft from "../../assets/RoadLeft.svg?react"
import Header from "../../components/Header/Header";
import LoginForm from "../../components/LoginForm/LoginForm";
import styles from "./Login.module.css";

const Login = () => {
    return(
        <>
            <Header />
            <div className={styles.RoadsWrapper}>
                <RoadLeft className={styles.Left}/>
                <RoadRight className={styles.Right}/>
            </div>
            <LoginForm />
        </>
    )
}

export default Login