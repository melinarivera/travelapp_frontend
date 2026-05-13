import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import CrearViajeModal from '../components/CrearViajeModal'
import ViajeCard from '../components/ViajeCard'
import api from '../api'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [mostrarModal, setMostrarModal] = useState(false)
  const [viajes, setViajes] = useState([])
  const [cargando, setCargando] = useState(true)

  const cargarViajes = async () => {
    try {
      const res = await api.get('/api/viajes')
      setViajes(res.data.viajes)
    } catch (err) {
      console.error('Error al cargar viajes:', err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarViajes()
  }, [])

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
  }

  const handleViajeCreado = () => {
    setMostrarModal(false)
    cargarViajes()
  }

  return (
    <div className={styles.pagina}>
      <header className={styles.header}>
        <h1 className={styles.logo}>TravelApp</h1>
        <div className={styles.headerDerecha}>
          <span className={styles.email}>{usuario?.email}</span>
          <button className={styles.btnCerrarSesion} onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.contenido}>
        <div className={styles.tituloSeccion}>
          <h2>Mis viajes</h2>
          <button className={styles.btnNuevoViaje} onClick={() => setMostrarModal(true)}>
            + Nuevo viaje
          </button>
        </div>

        <div className={styles.listaViajes}>
          {cargando ? (
            <p className={styles.sinViajes}>Cargando viajes...</p>
          ) : viajes.length === 0 ? (
            <p className={styles.sinViajes}>Todavía no tienes viajes. ¡Crea el primero!</p>
          ) : (
            viajes.map(viaje => (
              <ViajeCard key={viaje.id} viaje={viaje} usuarioId={usuario?.id} />
            ))
          )}
        </div>
      </main>

      {mostrarModal && (
        <CrearViajeModal
          onCerrar={() => setMostrarModal(false)}
          onViajeCreado={handleViajeCreado}
        />
      )}
    </div>
  )
}

export default Dashboard