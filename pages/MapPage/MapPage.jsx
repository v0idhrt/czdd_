import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import RoadRight from "../../assets/RoadRight.svg?react"
import RoadLeft from "../../assets/RoadLeft.svg?react"
import Header from "../../components/Header/Header";
import Map from "../../components/Map/Map";
import Tools from "../../components/Tools/Tools";
import styles from "./MapPage.module.css"
import Footer2 from "../../components/Footer2/Footer2";
import MiddleSpeedValues from "../../components/MiddleSpeedValue/MiddleSpeed";
import Weather from "../../components/Weather/Weather";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

const MapPage = () => {

    const [data, setData] = useState({}); // Стейт для хранения данных
    const [error, setError] = useState(null); // Стейт для хранения ошибок
    const [speedColor, setSpeedColor] = useState("#00FF00"); // Цвет для `MiddleSpeed`
    const [congession, setCongession] = useState([]);
    const [weather, setWeather] = useState([]);
  
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

    const fetchWeather = async () => {
        try{
            console.log("Fetching congession...")
            const token = localStorage.getItem("token");
            if(!token){
                throw new Error("JWT token not found");
            }
            const response = await api.get("api/weather", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "ngrok-skip-browser-warning": "true",
                    "Content-Type": "application/json",
                },
            });
            console.log("ResponseWeather:", response.data);
            setWeather(response.data);
        } catch(error){
            console.error("Error fetching congession:", error);
            setError("Ошибка загрузки данных");
            }
      };


  
    useEffect(() => {
      // Загружаем данные при монтировании компонента
      fetchData();
      fetchCongession();
      fetchWeather();
  
      // Устанавливаем интервал для обновления данных
      const interval = setInterval(() => {
        fetchData();
        fetchCongession();
      }, 5000); // Обновляем данные каждые 5 секунд

      const intervalslo = setInterval(() => {
        fetchWeather();

      }, 360000)
  
      // Очищаем интервал при размонтировании компонента
      return () => clearInterval(interval);
    }, []);

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
                    <Tools value={data.average_congestion} setSpeedColor={setSpeedColor}/>
                </div>
                <MiddleSpeedValues value={data.average_speed} trafficColor={setSpeedColor}/>
                <Weather condition={weather.condition} temperature={weather.temperature} />
            </div>
            <Map values={congession}/>
            <Footer2 />
        </>
    )
}

export default MapPage