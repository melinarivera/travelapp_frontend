import styles from './ViajeCard.module.css'

function ViajeCard({ viaje }) {
  const estados = {
    planificacion: 'Planificación',
    en_curso: 'En curso',
    finalizado: 'Finalizado'
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className={styles.card}>
      <div className={styles.imagen}>
        {viaje.imagen_url
          ? <img src={viaje.imagen_url} alt={viaje.titulo} />
          : <div className={styles.sinImagen}>📍</div>
        }
        <span className={`${styles.estado} ${styles[viaje.estado]}`}>
          {estados[viaje.estado]}
        </span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.titulo}>{viaje.titulo}</h3>
        <p className={styles.destino}>{viaje.destino}</p>
        <p className={styles.fechas}>
          {formatearFecha(viaje.fecha_inicio)} → {formatearFecha(viaje.fecha_fin)}
        </p>
        <button className={styles.btnEntrar}>Entrar al viaje</button>
      </div>
    </div>
  )
}

export default ViajeCard