import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import styles from './LoginForm.module.css'
import api from '../api'

function LoginForm({ onSwitch }) {
  const [verPassword, setVerPassword] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

try {
      const response = await api.post('/auth/login', { email, password })
      
      if (response.status === 200) {
        console.log('Login exitoso:', response.data)
        alert('¡Bienvenido!')
       
      }
    } catch (err) {
        if (err.response?.status === 401) {
        setError('Correo o contraseña incorrectos.')
      } else {
        setError('Hubo un problema al conectar con el servidor.')
      }
    }
  }

  return (
<div className={styles.contenedor}>
      <h2 className={styles.titulo}>Iniciar sesión</h2>

      {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
      
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
          {/* El icono debe ir DENTRO del botón */}
          {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <p className={styles.olvidaste}>¿Olvidaste tu contraseña?</p>

      <button className={styles.boton} onClick={handleSubmit}>
        Entrar
      </button>

      <p className={styles.enlace} onClick={onSwitch}>
        ¿No tienes cuenta? <span>Regístrate</span>
      </p>
    </div>
  )
}

export default LoginForm