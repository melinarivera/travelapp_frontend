import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import styles from './LoginForm.module.css'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

function LoginForm({ onSwitch }) {
  const [verPassword, setVerPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [recuperando, setRecuperando] = useState(false)
  const [mensajeRecuperar, setMensajeRecuperar] = useState('')

  const { setUsuario } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      const res = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', res.data.session.access_token)
      localStorage.setItem('usuario', JSON.stringify(res.data.user))
      setUsuario(res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Email o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

const handleRecuperar = async () => {
  if (!email.trim()) return setError('Introduce tu email primero')
  setRecuperando(true)
  setError('')
  try {
    await api.post('/api/auth/recuperar-password', { email })
    setMensajeRecuperar('✅ Te hemos enviado un email para recuperar tu contraseña.')
  } catch (err) {
    setError('Error al enviar el email. Comprueba la dirección.')
  } finally {
    setRecuperando(false)
  }
}

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Iniciar sesión</h2>

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

        {mensajeRecuperar ? (
          <p className={styles.mensajeRecuperar}>{mensajeRecuperar}</p>
        ) : (
          <p
            className={styles.olvidaste}
            onClick={handleRecuperar}
            style={{ cursor: recuperando ? 'wait' : 'pointer' }}
          >
            {recuperando ? 'Enviando...' : '¿Olvidaste tu contraseña?'}
          </p>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.boton} disabled={cargando}>
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className={styles.enlace} onClick={onSwitch}>
        ¿No tienes cuenta? <span>Regístrate</span>
      </p>
    </div>
  )
}

export default LoginForm