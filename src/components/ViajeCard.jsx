import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import styles from './ViajeCard.module.css'

function ViajeCard({ viaje, onActualizado, usuarioId }) {
  const [estado, setEstado] = useState(viaje.estado)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const esTitular = viaje.titular_id === usuarioId

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

  const handleEstado = async (nuevoEstado) => {
    setCargando(true)
    try {
      await api.patch(`/api/viajes/${viaje.id}`, { estado: nuevoEstado })
      setEstado(nuevoEstado)
      if (onActualizado) onActualizado()
    } catch (err) {
      console.error('Error al actualizar estado:', err)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.imagen}>
        {viaje.imagen_url
          ? <img src={viaje.imagen_url} alt={viaje.titulo} />
          : <div className={styles.sinImagen}>📍</div>
        }
        <span className={`${styles.estado} ${styles[estado]}`}>
          {estados[estado]}
        </span>
      </div>

      <div className={styles.info}>
        <h3 className={styles.titulo}>{viaje.titulo}</h3>
        <p className={styles.destino}>{viaje.destino}</p>
        <span className={`${styles.badge} ${esTitular ? styles.titular : styles.integrante}`}>
          {esTitular ? 'Titular' : 'Integrante'}
        </span>
        <p className={styles.fechas}>
          {formatearFecha(viaje.fecha_inicio)} → {formatearFecha(viaje.fecha_fin)}
        </p>
        {esTitular && (
          <select
            className={styles.selectEstado}
            value={estado}
            onChange={e => handleEstado(e.target.value)}
            disabled={cargando}
          >
            <option value="planificacion">Planificación</option>
            <option value="en_curso">En curso</option>
            <option value="finalizado">Finalizado</option>
          </select>
        )}
        <button
          className={styles.btnEntrar}
          onClick={() => navigate(`/viaje/${viaje.id}`)}
        >
          Entrar al viaje
        </button>
      </div>
    </div>
  )
}

export default ViajeCard