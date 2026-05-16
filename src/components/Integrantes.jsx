import { useState, useEffect } from 'react'
import api from '../api'
import styles from './Integrantes.module.css'

function Integrantes({ viajeId, esTitular }) {
  const [integrantes, setIntegrantes] = useState([])
  const [email, setEmail] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const cargarIntegrantes = async () => {
    try {
      const res = await api.get(`/api/viajes/${viajeId}/integrantes`)
      setIntegrantes(res.data.integrantes)
    } catch (err) {
      console.error('Error al cargar integrantes:', err)
    }
  }

  useEffect(() => { cargarIntegrantes() }, [viajeId])

  const handleAgregar = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await api.post(`/api/viajes/${viajeId}/integrantes`, { email })
      setEmail('')
      cargarIntegrantes()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al añadir integrante')
    } finally {
      setCargando(false)
    }
  }

  const handleEliminar = async (integranteId) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/integrantes/${integranteId}`)
      cargarIntegrantes()
    } catch (err) {
      console.error('Error al eliminar integrante:', err)
    }
  }

  // Iniciales para el avatar
  const getIniciales = (nombre, email) => {
    if (nombre) return nombre.charAt(0).toUpperCase()
    if (email) return email.charAt(0).toUpperCase()
    return '?'
  }

  // Color del avatar basado en el nombre
  const colores = ['#e8624a', '#7c5cbf', '#2EBD8A', '#F0A020', '#A8CECA']
  const getColor = (str) => colores[(str?.charCodeAt(0) || 0) % colores.length]

  return (
    <div className={styles.contenedor}>
      <h3 className={styles.titulo}>Integrantes del viaje</h3>

      {esTitular && (
        <form onSubmit={handleAgregar} className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email del integrante"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button className={styles.btnAgregar} disabled={cargando}>
            {cargando ? 'Añadiendo...' : '+ Añadir'}
          </button>
        </form>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.grid}>
        {integrantes.map(i => (
          <div key={i.id} className={styles.card}>
            {/* Avatar */}
            <div
              className={styles.avatar}
              style={{ background: getColor(i.nombre || i.email) }}
            >
              {getIniciales(i.nombre, i.email)}
            </div>

            {/* Nombre */}
            <p className={styles.nombre}>{i.nombre || i.email}</p>

            {/* Email (si hay nombre) */}
            {i.nombre && (
              <p className={styles.emailText}>{i.email}</p>
            )}

            {/* Rol */}
            <span className={`${styles.rol} ${styles[i.rol]}`}>{i.rol}</span>

            {/* Botón eliminar */}
            {esTitular && i.rol !== 'titular' && (
              <button
                className={styles.btnEliminar}
                onClick={() => handleEliminar(i.id)}
              >
                Eliminar
              </button>
            )}
          </div>
        ))}
      </div>

      {integrantes.length === 0 && (
        <p className={styles.sinIntegrantes}>No hay integrantes todavía</p>
      )}
    </div>
  )
}

export default Integrantes