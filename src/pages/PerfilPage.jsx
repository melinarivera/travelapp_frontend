import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Perfil from '../components/Perfil'
import styles from './PerfilPage.module.css'

function PerfilPage() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigate('/')
  }

  return (
    <div className={styles.pagina}>

      <header className={styles.header}>
        <span className={styles.logo}>✈ TravelApp</span>
        <div className={styles.headerDerecha}>
          <button className={styles.btnVolver} onClick={() => navigate('/dashboard')}>
            ← Volver
          </button>
          <button className={styles.btnCerrarSesion} onClick={handleCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className={styles.contenido}>
        <Perfil usuario={usuario} />
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

export default PerfilPage