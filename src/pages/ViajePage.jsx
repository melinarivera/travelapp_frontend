import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Integrantes from '../components/Integrantes'
import Itinerario from '../components/Itinerario'
import MapaPOI from '../components/MapaPOI'
import TicketsYDocs from '../components/TicketsYDocs'
import api from '../api'
import styles from './ViajePage.module.css'

const SECCIONES = [
  { id: 'integrantes', label: 'Integrantes', color: '#e8624a' },
  { id: 'documentos',  label: 'Tickets & Docs', color: '#2EBD8A' },
  { id: 'itinerario',  label: 'Itinerario', color: '#F0A020' },
  { id: 'mapa',        label: 'Mapa & POI', color: '#7c5cbf' },
]

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
  const colorActivo = SECCIONES.find(s => s.id === seccionActiva)?.color || '#e8624a'

  return (
    <div className={styles.pagina}>

      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate('/dashboard')}>
          ← Volver
        </button>
        <h1 className={styles.titulo}>{viaje?.titulo || 'Mi viaje'}</h1>
      </header>

      <nav className={styles.menu}>
        {SECCIONES.map(s => (
          <button
            key={s.id}
            className={`${styles.menuBtn} ${seccionActiva === s.id ? styles.activo : ''}`}
            style={seccionActiva === s.id ? {
              color: 'white',
              background: s.color,
              borderBottomColor: 'transparent',
              borderRadius: '8px 8px 0 0',
            } : {}}
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
        {seccionActiva === 'documentos' && (
          <TicketsYDocs viajeId={id} esTitular={esTitular} />
        )}
        {seccionActiva === 'itinerario' && (
          <Itinerario viaje={viaje} esAdmin={esTitular} />
        )}
        {seccionActiva === 'mapa' && (
          <MapaPOI viajeId={id} esAdmin={esTitular} />
        )}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContenido}>
          <div className={styles.footerLogo}>✈ TravelApp</div>
          <div className={styles.footerLinks}>
            <span className={styles.footerLink}>Sobre nosotros</span>
            <span className={styles.footerLink}>Contacto</span>
            <span className={styles.footerLink}>Condiciones de uso</span>
            <span className={styles.footerLink}>Privacidad</span>
          </div>
          <p className={styles.footerCopy}>© 2026 Priscila & Melina. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}

export default ViajePage