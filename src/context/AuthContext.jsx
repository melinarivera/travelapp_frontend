import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const usuarioGuardado = localStorage.getItem('usuario')
    
    if (token && usuarioGuardado) {
      setUsuario(JSON.parse(usuarioGuardado))
      cargarPerfil()
    }
    
    setCargando(false)
  }, [])

  const cargarPerfil = async () => {
    try {
      const res = await api.get('/api/perfil')
      if (res.data.perfil) setPerfil(res.data.perfil)
    } catch (err) {
      console.error('Error al cargar perfil:', err)
    }
  }

  const cerrarSesion = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
    setPerfil(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, perfil, setPerfil, cargarPerfil, cerrarSesion, cargando }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}