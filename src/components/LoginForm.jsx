import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './LoginForm.module.css'

function LoginForm({ onSwitch }) {
  const [verPassword, setVerPassword] = useState(false)

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Iniciar sesión</h2>
      
      <input 
        className={styles.input} 
        type="email" 
        placeholder="Correo electrónico" 
      />
      
      <div className={styles.inputWrapper}>
        <input 
          className={styles.input} 
          type={verPassword ? 'text' : 'password'} 
          placeholder="Contraseña" 
        />
        <button 
          type="button"
          className={styles.ojito}
          onClick={() => setVerPassword(!verPassword)}
        >
          {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <p className={styles.olvidaste}>¿Olvidaste tu contraseña?</p>

      <button className={styles.boton}>Entrar</button>
      <p className={styles.enlace} onClick={onSwitch}>
        ¿No tienes cuenta? <span>Regístrate</span>
      </p>
    </div>
  )
}

export default LoginForm