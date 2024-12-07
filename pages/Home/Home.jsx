import React from "react";
import RoadRight from "../../assets/RoadRight.svg?react"
import RoadLeft from "../../assets/RoadLeft.svg?react"
import Appeals from "../../assets/Appeals.svg?react"
import Header from "../../components/Header/Header";
import styles from "./Home.module.css"
import trafficlight from "../../assets/TrafficLight.png"
import TrafficControl from "../../components/TrafficControl/TrafficControl"
import MiddleSpeed from "../../components/MiddleSpeed/MiddleSpeed";
import Blocking from "../../components/Blocking/Blocking";
import About from "../../components/About/About";
import Footer from "../../components/Footer/Footer";


const Home = () =>{
    return(
        <>
            <Header />
            <div className={styles.RoadsWrapper}>
                <RoadLeft className={styles.Left}/>
                <RoadRight className={styles.Right}/>
            </div>
            <section className={styles.Welcome}>
                <div className={styles.WelcomeWritings}>
                    <h1 className={styles.WelcomeHeader}>Умная система помощи на дороге</h1>
                    <p className={styles.WelcomeText}>Центр организации дорожного движения города Краснодар</p>
                </div>
                <img className={styles.WelcomeImage} src={trafficlight} alt="trafficlight" />
            </section>
            <section className={styles.Tools}>
                <div className={styles.Main}>
                    <div className={styles.Situation}>
                        <TrafficControl />
                        <MiddleSpeed />
                    </div>
                    <div className={styles.AppealsWrapper}>
                        <div className={styles.AppealsVisual}>
                            <div className={styles.iconWrapper}><Appeals /></div>
                            <h1 className={styles.AppealsHeader}>Обращения</h1>
                            <p className={styles.AppealsText}>Имеются какие то вопросы или предложения?
                            Напишите нам!</p>
                        </div>
                        <button className={styles.AppealsButton}>Написать обращение</button>
                    </div>
                </div>
                <Blocking />
                <About />
            </section>
            <Footer className={styles.Footer}/>
        </>
    );
}

export default Home;