import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import CrearViajeModal from '../components/CrearViajeModal'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()
  const [mostrarModal, setMostrarModal] = useState(false)

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
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
          <p className={styles.sinViajes}>Todavía no tienes viajes. ¡Crea el primero!</p>
        </div>
      </main>

      {mostrarModal && (
        <CrearViajeModal
          onCerrar={() => setMostrarModal(false)}
          onViajeCreado={() => setMostrarModal(false)}
        />
      )}
    </div>
  )
}

export default Dashboard