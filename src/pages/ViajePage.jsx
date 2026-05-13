import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Integrantes from '../components/Integrantes'
import api from '../api'
import styles from './ViajePage.module.css'
import TicketsYDocs from '../components/TicketsYDocs'

function ViajePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [seccionActiva, setSeccionActiva] = useState('integrantes')
  const [viaje, setViaje] = useState(null)

  useEffect(() => {
    const cargarViaje = async () => {
      try {
        const res = await api.get(`/api/viajes/${id}`)
        setViaje(res.data.viaje)
      } catch (err) {
        console.error('Error al cargar viaje:', err)
      }
    }
    cargarViaje()
  }, [id])

  const esTitular = viaje?.titular_id === usuario?.id

  const secciones = [
    { id: 'integrantes', label: 'Integrantes' },
    { id: 'documentos', label: 'Tickets & Docs' },
    { id: 'itinerario', label: 'Itinerario' },
    { id: 'mapa', label: 'Mapa & POI' },
  ]

  return (
    <div className={styles.pagina}>
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate('/dashboard')}>
          ← Volver
        </button>
        <h1 className={styles.titulo}>{viaje?.titulo || 'Mi viaje'}</h1>
      </header>

      <nav className={styles.menu}>
        {secciones.map(s => (
          <button
            key={s.id}
            className={`${styles.menuBtn} ${seccionActiva === s.id ? styles.activo : ''}`}
            onClick={() => setSeccionActiva(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <main className={styles.contenido}>
        {seccionActiva === 'integrantes' && (
          <Integrantes viajeId={id} esTitular={esTitular} />
        )}
        {seccionActiva === 'documentos' && <TicketsYDocs viajeId={id} esTitular={esTitular} />}
        {seccionActiva === 'itinerario' && <p>Sección itinerario</p>}
        {seccionActiva === 'mapa' && <p>Sección mapa y POI</p>}
      </main>
    </div>
  )
}

export default ViajePage