import { YMaps, Map, Placemark, TrafficControl } from '@pbe/react-yandex-maps';
import React from 'react';
import styles from './Map.module.css'; // Стили для Яндекс.Карты
import Blocking from '../../assets/Blocking.svg?react';

export default function MyMap({ values = [] }) {
    console.log(values);

    return (
      <section className={styles.container}>
          <div className={styles.mapContainer}>
          <YMaps
              query={{
                apikey: '8ba4d5ce-bb40-4aa8-ae53-737419b2c35a',
                  ns: "use-load-option",
                  load: "Map,Placemark,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon",
              }}
          >
              <Map
                  defaultState={{
                      center: [45.035470, 38.975313], // Координаты центра карты
                      zoom: 12.4,
                      controls: ["fullscreenControl"],
                  }}
                  modules={["geoObject.addon.balloon", "geoObject.addon.hint"]}
                  style={{ height: '900px', width: '100%', borderRadius: '30px' }}
              >
                  {/* Включаем отображение пробок */}
                  <TrafficControl options={{ float: "right", display: "flex" }} defaultState={{ trafficShown: true }} />

                  {/* Рендерим Placemark для каждой точки из массива */}
                  {values.map((item, index) => (
                    <Placemark
                        key={index}
                        geometry={[item.latitude, item.longitude]} // Убедитесь, что ключи совпадают с вашим JSON
                        properties={{
                            balloonContent: `
                              <div>
                                <h3>${item.road_name}</h3>
                                <p>Уровень затора: ${item.congestion_level}</p>
                              </div>
                            `,
                        }}
                        options={{
                            hasBalloon: true,
                            openBalloonOnClick: true,
                            openHintOnHover: true,
                            preset: "islands#redIcon", // Настройка стиля метки
                        }}
                    />
                  ))}
              </Map>
          </YMaps>
          </div>
      </section>
    );
}
