import { useState } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import styles from './RegisterForm.module.css'

function RegisterForm({ onSwitch }) {
  const [verPassword, setVerPassword] = useState(false)
  const [password, setPassword] = useState('')

  const validaciones = [
    { texto: 'Mínimo 6 caracteres', cumple: password.length >= 6 },
    { texto: 'Una letra mayúscula', cumple: /[A-Z]/.test(password) },
    { texto: 'Un símbolo especial', cumple: /[¿¡+-_=?!@#$%^&*]/.test(password) },
  ]

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Crear cuenta</h2>

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className={styles.ojito}
          onClick={() => setVerPassword(!verPassword)}
        >
          {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {password.length > 0 && (
        <ul className={styles.validaciones}>
          {validaciones.map((v, i) => (
            <li key={i} className={v.cumple ? styles.cumple : styles.noCumple}>
              {v.cumple ? <Check size={13} /> : <X size={13} />}
              {v.texto}
            </li>
          ))}
        </ul>
      )}

      <button className={styles.boton}>Registrarse</button>
      <p className={styles.enlace} onClick={onSwitch}>
        ¿Ya tienes cuenta? <span>Inicia sesión</span>
      </p>
    </div>
  )
}

export default RegisterForm