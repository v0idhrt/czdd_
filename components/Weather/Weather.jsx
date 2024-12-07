import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_KEY = import.meta.env.VITE_WEATHER_API;// Replace with your actual API key

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await axios.get(`https://api.weather.yandex.ru/v2/forecast??lat=45.0355&lon=38.9753`, {
                    headers: {
                        'X-Yandex-Weather-Key': API_KEY
                    }
                });
                setWeatherData(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [API_KEY]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h2>Погода в Краснодаре</h2>
            <p>Температура: {weatherData.fact.temp}°C</p>
            <p>Осадки: {weatherData.fact.precipitation || 'Нет'}</p>
        </div>
    );
};

export default Weather;