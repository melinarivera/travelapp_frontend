import { useState } from 'react'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import api from '../api'
import styles from './RegisterForm.module.css'

function RegisterForm({ onSwitch }) {
  const [verPassword, setVerPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const validaciones = [
    { texto: 'Mínimo 6 caracteres', cumple: password.length >= 6 },
    { texto: 'Una letra mayúscula', cumple: /[A-Z]/.test(password) },
    { texto: 'Un símbolo especial', cumple: /[!@#$%^&*+\-_=?]/.test(password) },
  ]

  const todasCumplen = validaciones.every(v => v.cumple)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!todasCumplen) return
    
    setCargando(true)
    setError('')

    try {
      await api.post('/api/auth/registro', { email, password })
      alert('Cuenta creada correctamente, ya puedes iniciar sesión')
      onSwitch()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear la cuenta')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Crear cuenta</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          className={styles.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className={styles.inputWrapper}>
          <input
            className={styles.input}
            type={verPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

        {error && <p className={styles.error}>{error}</p>}

        <button 
          className={styles.boton} 
          disabled={!todasCumplen || cargando}
        >
          {cargando ? 'Creando cuenta...' : 'Registrarse'}
        </button>
      </form>

      <p className={styles.enlace} onClick={onSwitch}>
        ¿Ya tienes cuenta? <span>Inicia sesión</span>
      </p>
    </div>
  )
}

export default RegisterForm