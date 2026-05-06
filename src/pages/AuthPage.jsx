import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import styles from './AuthPage.module.css'

function AuthPage() {
  const [mostrarLogin, setMostrarLogin] = useState(true)

  return (
    <div className={styles.pagina}>
      <div className={styles.contenedor}>
        <div className={styles.logo}>
          <h1 className={styles.logoTexto}>TravelApp</h1>
          <p className={styles.logoSubtitulo}>Viaja en grupo de forma sencilla y organizada</p>
        </div>
        <div className={styles.tarjeta}>
          {mostrarLogin
            ? <LoginForm onSwitch={() => setMostrarLogin(false)} />
            : <RegisterForm onSwitch={() => setMostrarLogin(true)} />
          }
        </div>
      </div>
    </div>
  )
}

export default AuthPage