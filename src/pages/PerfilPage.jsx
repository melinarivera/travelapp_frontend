import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Perfil from '../components/Perfil'
import styles from './PerfilPage.module.css'

function PerfilPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  return (
    <div className={styles.pagina}>
      <header className={styles.header}>
        <button className={styles.btnVolver} onClick={() => navigate('/dashboard')}>
          ← Volver
        </button>
        <h1 className={styles.titulo}>TravelApp</h1>
      </header>
      <main className={styles.contenido}>
        <Perfil usuario={usuario} />
      </main>
    </div>
  )
}

export default PerfilPage