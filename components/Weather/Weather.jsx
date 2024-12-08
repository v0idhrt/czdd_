import React from 'react';
import PropTypes from 'prop-types';
import styles from './Weather.module.css';
import Sunny from '../../assets/Sunny.svg?react';
import Cloudy from '../../assets/Cloudy.svg?react';
import Rainy from '../../assets/Rainy.svg?react';
import Thunder from '../../assets/Thunder.svg?react';
import Windy from '../../assets/Windy.svg?react';
import Snowy from '../../assets/Snowy.svg?react';
import Unknown from '../../assets/Arrow.svg?react'; // Иконка по умолчанию

const Weather = ({condition, temperature}) => {
    console.log(`Condition: ${condition}, Temperature: ${temperature}`);

    // Объект иконок
    const icons = {
        Sunny: <Sunny />,
        Cloudy: <Cloudy />,
        Rainy: <Rainy />,
        Thunder: <Thunder />,
        Windy: <Windy />,
        Snowy: <Snowy />, // Иконка по умолчанию
    };

    // Перевод погодных условий на русский
    
    const conditionRU = {
        Sunny: 'Солнечно',
        Cloudy: 'Облачно',
        Rainy: 'Дождь',
        Thunder: 'Гроза',
        Windy: 'Ветрено',
        Snowy: 'Снег', // Иконка по умолчанию
        };
    
        

    return (
        <div className={styles.WeatherWrapper}>
            {icons[condition] ? icons[condition] : icons.Unknown} {/* Иконка по умолчанию */}
            <h1 className={styles.Weather}>
                {conditionRU[condition] || conditionRU.Unknown} {temperature}°C
            </h1>
        </div>
    );
};

// Определение PropTypes
Weather.propTypes = {
    condition: PropTypes.string,
    temperature: PropTypes.number,
};

export default Weather;
