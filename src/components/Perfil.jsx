import { useState, useEffect, useRef } from 'react'
import api from '../api'
import styles from './Perfil.module.css'
import { useAuth } from '../context/AuthContext'

function Perfil({ usuario }) {
    const { cargarPerfil } = useAuth()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [foto, setFoto] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState(null)
  const fotoRef = useRef(null)

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await api.get('/api/perfil')
        if (res.data.perfil) {
          setNombre(res.data.perfil.nombre || '')
          setTelefono(res.data.perfil.telefono || '')
          setFotoPreview(res.data.perfil.foto_url || null)
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err)
      }
    }
    cargarPerfil()
  }, [])

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFoto(file)
      setFotoPreview(URL.createObjectURL(file))
    }
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje(null)
    try {
      const formData = new FormData()
      formData.append('nombre', nombre)
      formData.append('telefono', telefono)
      if (foto) formData.append('foto', foto)

      await api.post('/api/perfil', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMensaje('Perfil guardado correctamente')
cargarPerfil()
setTimeout(() => setMensaje(null), 3000)
    } catch (err) {
      setMensaje('Error al guardar el perfil')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Mi perfil</h2>

      <div className={styles.avatar} onClick={() => fotoRef.current.click()}>
        {fotoPreview
          ? <img src={fotoPreview} alt="avatar" className={styles.avatarImg} />
          : <div className={styles.avatarPlaceholder}>📷</div>
        }
        <span className={styles.avatarLabel}>Cambiar foto</span>
      </div>
      <input
        ref={fotoRef}
        type="file"
        accept="image/*"
        onChange={handleFoto}
        style={{ display: 'none' }}
      />

      <form className={styles.formulario} onSubmit={handleGuardar}>
        <div className={styles.campo}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="text"
            value={usuario?.email || ''}
            disabled
          />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Nombre</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Teléfono</label>
          <input
            className={styles.input}
            type="tel"
            placeholder="Tu teléfono"
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
          />
        </div>

        {mensaje && (
          <p className={`${styles.mensaje} ${mensaje.includes('Error') ? styles.error : styles.exito}`}>
            {mensaje}
          </p>
        )}

        <button className={styles.btnGuardar} type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar perfil'}
        </button>
      </form>
    </div>
  )
}

export default Perfil