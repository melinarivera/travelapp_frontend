import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import styles from './ViajePage.module.css'

function ViajePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [seccionActiva, setSeccionActiva] = useState('integrantes')

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
        <h1 className={styles.titulo}>Mi viaje</h1>
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
        {seccionActiva === 'integrantes' && <p>Sección integrantes</p>}
        {seccionActiva === 'documentos' && <p>Sección tickets y documentos</p>}
        {seccionActiva === 'itinerario' && <p>Sección itinerario</p>}
        {seccionActiva === 'mapa' && <p>Sección mapa y POI</p>}
      </main>
    </div>
  )
}

export default ViajePage