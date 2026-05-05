import styles from './LoginForm.module.css'

function LoginForm({ onSwitch }) {
  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Iniciar sesión</h2>
      <input className={styles.input} type="email" placeholder="Correo electrónico" />
      <input className={styles.input} type="password" placeholder="Contraseña" />
      <button className={styles.boton}>Entrar</button>
      <p className={styles.enlace} onClick={onSwitch}>
        ¿No tienes cuenta? <span>Regístrate</span>
      </p>
    </div>
  )
}

export default LoginForm