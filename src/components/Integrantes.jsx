import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
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

  useEffect(() => {
    cargarIntegrantes()
  }, [viajeId])

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

      <ul className={styles.lista}>
        {integrantes.map(i => (
          <li key={i.id} className={styles.item}>
            <div className={styles.itemInfo}>
<span className={styles.itemEmail}>{i.email}</span>
              <span className={`${styles.rol} ${styles[i.rol]}`}>{i.rol}</span>
            </div>
            {esTitular && i.rol !== 'titular' && (
              <button
                className={styles.btnEliminar}
                onClick={() => handleEliminar(i.id)}
              >
                Eliminar
              </button>
            )}
          </li>
        ))}
      </ul>

      {integrantes.length === 0 && (
        <p className={styles.sinIntegrantes}>No hay integrantes todavía</p>
      )}
    </div>
  )
}

export default Integrantes