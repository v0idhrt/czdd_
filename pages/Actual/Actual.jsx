import React from "react";
import Header from "../../components/Header/Header";
import styles from "./Actual.module.css";
import RoadRight from "../../assets/RoadRight.svg?react"
import RoadLeft from "../../assets/RoadLeft.svg?react"
import AppealsInfo from "../../components/AppealInfo/AppealsInfo";
import image from "../../assets/Analytic.png"
import Footer4 from "../../components/Footer4/Footer4";

const Actual = () => {
    return (
        <>
            <Header />
            <div className={styles.RoadsWrapper}>
                <RoadLeft className={styles.Left}/>
                <RoadRight className={styles.Right}/>
            </div>
            <section className={styles.Actual}>
                <div className={styles.ActualTextWrapper}>
                    <h1 className={styles.ActualHeader}>Актуальное</h1>
                    <p className={styles.ActualText}>Последние обращения</p>
                </div>
                <AppealsInfo />
                <img src={image} alt="" className={styles.Analytic} />
            </section>
            <Footer4/>
        </>
    )
}

export default Actual;