import React from "react";
import RoadRight from "../../assets/RoadRight.svg?react"
import RoadLeft from "../../assets/RoadLeft.svg?react"
import Header from "../../components/Header/Header";
import Map from "../../components/Map/Map";
import Tools from "../../components/Tools/Tools";
import styles from "./MapPage.module.css"
import Footer2 from "../../components/Footer2/Footer2";
import MiddleSpeedValues from "../../components/MiddleSpeedValue/MiddleSpeed";
import Weather from "../../components/Weather/Weather";

const MapPage = () => {
    return(
        <>
            <Header />
            <div className={styles.RoadsWrapper}>
                <RoadLeft className={styles.Left}/>
                <RoadRight className={styles.Right}/>
            </div>
            <h1 className={styles.MapHeader}>Умная карта</h1>
            <div className={styles.ToolsContainer}>
                <div className={styles.FlWrapper}>
                    <Tools/>
                </div>
                <MiddleSpeedValues />
                <Weather />
            </div>
            <Map />
            <Footer2 />
        </>
    )
}

export default MapPage