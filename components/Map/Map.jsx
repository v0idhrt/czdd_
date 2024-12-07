import { YMaps, Map, Placemark, TrafficControl } from '@pbe/react-yandex-maps';
import React from 'react';
import styles from './Map.module.css'; // Стили для Яндекс.Карты

export default function MyMap() {
    return (
      <section className={styles.container}>
          <div className={styles.mapContainer}>
          <YMaps
              query={{
                  ns: "use-load-option",
                  load: "Map,Placemark,control.ZoomControl,control.FullscreenControl,geoObject.addon.balloon,",
              }}
              >
              <Map
                  defaultState={{
                  center: [45.035470, 38.975313],
                  zoom: 12.4,
                  controls: ["fullscreenControl"],
                  }}
                  style={{ height: '900px', width: '100%', borderradius: '30px' }}
              >
                  <TrafficControl options={{ float: "right", display: "flex" }} defaultState={{trafficShown: true}}/>
              </Map>
          </YMaps>
          </div>
      </section>
    );
}