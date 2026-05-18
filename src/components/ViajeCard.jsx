import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import styles from './ViajeCard.module.css'

const PALETA = [
  { borda: '#e8624a', bg: '#fff0ee', texto: '#e8624a' },   // coral
  { borda: '#7c5cbf', bg: '#f0eeff', texto: '#7c5cbf' },   // roxo
  { borda: '#2EBD8A', bg: '#edfaf4', texto: '#2EBD8A' },   // verde
  { borda: '#F0A020', bg: '#fff8ee', texto: '#F0A020' },   // laranja
]

function ViajeCard({ viaje, onActualizado, usuarioId, index = 0 }) {
  const [estado, setEstado] = useState(viaje.estado)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const esTitular = viaje.titular_id === usuarioId
  const cor = PALETA[index % PALETA.length]

  const estados = {
    planificacion: 'Planificación',
    en_curso: 'En curso',
    finalizado: 'Finalizado'
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: 'numeric', month: 'short', year: 'numeric'
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
    <div
      className={styles.card}
      style={{ borderColor: cor.borda }}
    >
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

        <span
          className={styles.badge}
          style={{ background: cor.bg, color: cor.texto }}
        >
          {esTitular ? 'Titular' : 'Integrante'}
        </span>

        <p className={styles.fechas}>
          {formatearFecha(viaje.fecha_inicio)} → {formatearFecha(viaje.fecha_fin)}
        </p>

        {esTitular && (
          <select
            className={styles.selectEstado}
            style={{ borderColor: cor.borda }}
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
          style={{
            background: `linear-gradient(135deg, ${cor.borda} 0%, ${cor.borda}cc 100%)`,
            boxShadow: `0 4px 12px ${cor.borda}44`
          }}
          onClick={() => navigate(`/viaje/${viaje.id}`)}
        >
          Entrar al viaje
        </button>
      </div>
    </div>
  )
}

export default ViajeCard