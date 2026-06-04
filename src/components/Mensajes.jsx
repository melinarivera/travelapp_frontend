import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import styles from './Mensajes.module.css'

function Mensajes({ viajeId }) {
  const { usuario, perfil } = useAuth()
  const [mensajes, setMensajes] = useState([])
  const [contenido, setContenido] = useState('')
  const [respondiendo, setRespondiendo] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const bottomRef = useRef(null)

  const cargarMensajes = async () => {
    try {
      const res = await api.get(`/api/viajes/${viajeId}/mensajes`)
      setMensajes(res.data.mensajes)
    } catch (err) {
      console.error('Error al cargar mensajes:', err)
    }
  }

  useEffect(() => {
    cargarMensajes()
    const intervalo = setInterval(cargarMensajes, 5000)
    return () => clearInterval(intervalo)
  }, [viajeId])

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [mensajes])

  const handleEnviar = async (e) => {
    e.preventDefault()
    if (!contenido.trim()) return
    setEnviando(true)
    try {
      await api.post(`/api/viajes/${viajeId}/mensajes`, {
        contenido,
        respuesta_a: respondiendo?.id || null
      })
      setContenido('')
      setRespondiendo(null)
      cargarMensajes()
    } catch (err) {
      console.error('Error al enviar mensaje:', err)
    } finally {
      setEnviando(false)
    }
  }

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/mensajes/${id}`)
      setMensajes(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error('Error al eliminar mensaje:', err)
    }
  }

  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  const esMio = (msg) => msg.usuario_id === usuario?.id
  const nombreUsuario = (msg) => msg.perfil?.nombre || 'Usuario'

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Mensajes</h2>

      <div className={styles.chat}>
        {mensajes.length === 0 ? (
          <p className={styles.vacio}>No hay mensajes todavía. ¡Sé el primero en escribir!</p>
        ) : (
          mensajes.map(msg => (
            <div
              key={msg.id}
              className={`${styles.burbuja} ${esMio(msg) ? styles.mio : styles.otro}`}
            >
              {!esMio(msg) && (
                <span className={styles.nombre}>{nombreUsuario(msg)}</span>
              )}

              {msg.respuesta && (
                <div className={styles.respuestaPreview}>
                  <span className={styles.respuestaNombre}>
                    {msg.respuesta.perfil?.nombre || 'Usuario'}
                  </span>
                  <span className={styles.respuestaTexto}>{msg.respuesta.contenido}</span>
                </div>
              )}

              <p className={styles.texto}>{msg.contenido}</p>

              <div className={styles.meta}>
                <span className={styles.hora}>{formatearHora(msg.created_at)}</span>
                <button
                  className={styles.btnResponder}
                  onClick={() => setRespondiendo({ id: msg.id, contenido: msg.contenido, nombre: nombreUsuario(msg) })}
                >
                  Responder
                </button>
                {esMio(msg) && (
                  <button
                    className={styles.btnEliminar}
                    onClick={() => handleEliminar(msg.id)}
                  >
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {respondiendo && (
        <div className={styles.respondiendo}>
          <span>Respondiendo a {respondiendo.nombre}: "{respondiendo.contenido.slice(0, 40)}{respondiendo.contenido.length > 40 ? '...' : ''}"</span>
          <button onClick={() => setRespondiendo(null)} className={styles.btnCancelar}>×</button>
        </div>
      )}

      <form className={styles.formulario} onSubmit={handleEnviar}>
        <input
          className={styles.input}
          type="text"
          placeholder="Escribe un mensaje..."
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          disabled={enviando}
        />
        <button className={styles.btnEnviar} type="submit" disabled={enviando || !contenido.trim()}>
          Enviar
        </button>
      </form>
    </div>
  )
}

export default Mensajes