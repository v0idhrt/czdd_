import React, { useState, useEffect } from "react";
import axios from "axios";
import RoadRight from "../../assets/RoadRight.svg?react";
import RoadLeft from "../../assets/RoadLeft.svg?react";
import AppealsComp from "../../components/Appeals/Appeals";
import Header from "../../components/Header/Header";
import styles from "./Home.module.css";
import trafficlight from "../../assets/TrafficLight.png";
import TrafficControl from "../../components/TrafficControl/TrafficControl";
import MiddleSpeed from "../../components/MiddleSpeed/MiddleSpeed";
import Blocking from "../../components/Blocking/Blocking";
import About from "../../components/About/About";
import Footer from "../../components/Footer/Footer";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const Home = () => {
  const [data, setData] = useState(null); // Стейт для хранения данных
  const [error, setError] = useState(null); // Стейт для хранения ошибок
  const [speedColor, setSpeedColor] = useState("#00FF00"); // Цвет для `MiddleSpeed`
  const [congession, setCongession] = useState([])

  const fetchData = async () => {
    try {
      console.log("Fetching data...");
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("JWT token not found");
      }
      const response = await api.get("api/traffic/averages", {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response.data);
      setData(response.data); // Устанавливаем данные
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Ошибка загрузки данных");
    }
  };

  const fetchCongession = async () => {
    try{
        console.log("Fetching congession...")
        const token = localStorage.getItem("token");
        if(!token){
            throw new Error("JWT token not found");
        }
        const response = await api.get("api/traffic/high_congestion", {
            headers: {
                Authorization: `Bearer ${token}`,
                "ngrok-skip-browser-warning": "true",
                "Content-Type": "application/json",
            },
        });
        console.log("Response:", response.data);
        setCongession(response.data);
    } catch(error){
        console.error("Error fetching congession:", error);
        setError("Ошибка загрузки данных");
        }
  };

  useEffect(() => {
    // Загружаем данные при монтировании компонента
    fetchData();
    fetchCongession();

    // Устанавливаем интервал для обновления данных
    const interval = setInterval(() => {
      fetchData();
      fetchCongession();
    }, 5000); // Обновляем данные каждые 5 секунд

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, []);



  return (
    <>
      <Header />
      <div className={styles.RoadsWrapper}>
        <RoadLeft className={styles.Left} />
        <RoadRight className={styles.Right} />
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
          {data ? (
            <>
              <TrafficControl
                value={data.average_congestion}
                setSpeedColor={setSpeedColor}
              />
              <MiddleSpeed
                value={data.average_speed}
                trafficColor={speedColor}
              />
            </>
          ) : (
            <p>Загрузка...</p>
          )}
          </div>
          <AppealsComp />
        </div>
        <Blocking values={congession}/>
        <About />
      </section>
      <Footer className={styles.Footer} />
    </>
  );
};

export default Home;
