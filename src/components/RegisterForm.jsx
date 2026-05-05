import styles from './RegisterForm.module.css'

function RegisterForm({ onSwitch }) {
  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Crear cuenta</h2>
      <input className={styles.input} type="email" placeholder="Correo electrónico" />
      <input className={styles.input} type="password" placeholder="Contraseña" />
      <button className={styles.boton}>Registrarse</button>
      <p className={styles.enlace} onClick={onSwitch}>
        ¿Ya tienes cuenta? <span>Inicia sesión</span>
      </p>
    </div>
  )
}

export default RegisterForm