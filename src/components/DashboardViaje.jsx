import React from 'react';
import styles from './DashboardViaje.module.css';

const DashboardViaje = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard de la Viaje</h1>
      
      <div className={styles.grid}>
        <div className={styles.card}>
          <p>Itinerário</p>
        </div>
        
        <div className={styles.card}>
          <p>Mapa</p>
        </div>
        
        <div className={styles.card}>
          <p>Recomendaciones</p>
        </div>
        
        <div className={styles.card}>
          <p>Integrantes</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardViaje;
