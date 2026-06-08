import { useState, useEffect } from 'react'
import api from '../api'
import styles from './Links.module.css'

const DOMINIOS_FOTOS = ['drive.google.com', 'photos.google.com', 'icloud.com', 'dropbox.com', 'onedrive.live.com']

function Links({ viajeId }) {
  const [links, setLinks] = useState([])
  const [url, setUrl] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const cargarLinks = async () => {
    try {
      const res = await api.get(`/api/viajes/${viajeId}/links`)
      setLinks(res.data.links)
    } catch (err) {
      console.error('Error al cargar links:', err)
    }
  }

  useEffect(() => {
    cargarLinks()
  }, [viajeId])

  const esFotos = (url) => {
    try {
      const hostname = new URL(url).hostname.replace('www.', '')
      return DOMINIOS_FOTOS.some(d => hostname.includes(d))
    } catch {
      return false
    }
  }

  const handleAgregar = async (e) => {
    e.preventDefault()
    if (!url.trim()) return
    setError('')
    setCargando(true)
    try {
      let urlFinal = url.trim()
      if (!/^https?:\/\//i.test(urlFinal)) {
        urlFinal = 'https://' + urlFinal
      }
      await api.post(`/api/viajes/${viajeId}/links`, { url: urlFinal, descripcion })
      setUrl('')
      setDescripcion('')
      cargarLinks()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al añadir el link')
    } finally {
      setCargando(false)
    }
  }

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/links/${id}`)
      setLinks(prev => prev.filter(l => l.id !== id))
    } catch (err) {
      console.error('Error al eliminar link:', err)
    }
  }

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
    }) + ' · ' + fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit', minute: '2-digit',
    })
  }

  const formatearUrl = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const linksNormales = links.filter(l => !esFotos(l.url))
  const linksFotos = links.filter(l => esFotos(l.url))

  const renderLink = (link) => (
    <li key={link.id} className={styles.item}>
      <div className={styles.infoLink}>
        <a
          className={styles.linkUrl}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          🔗 {formatearUrl(link.url)}
        </a>
        {link.descripcion && (
          <p className={styles.descripcion}>{link.descripcion}</p>
        )}
        <span className={styles.fecha}>{formatearFecha(link.created_at)}</span>
        <span className={styles.criador}>Añadido por {link.criador_nombre}</span>
      </div>
      <button className={styles.btnEliminar} onClick={() => handleEliminar(link.id)}>
        Eliminar
      </button>
    </li>
  )

  return (
    <div className={styles.contenedor}>

      {/* FORMULARIO */}
      <form className={styles.formulario} onSubmit={handleAgregar}>
        <input
          className={styles.input}
          type="text"
          placeholder="URL del link *"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Descripción (opcional)"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.btnAgregar} type="submit" disabled={cargando}>
          {cargando ? 'Añadiendo...' : '+ Añadir link'}
        </button>
      </form>

      {/* BOX FOTOS */}
      <div className={styles.fotosBox}>
        <div className={styles.fotosHeader}>
          <span className={styles.fotosIcono}>📸</span>
          <div>
            <p className={styles.fotosTitulo}>Fotos del grupo</p>
            <p className={styles.fotosSubtitulo}>
              Añade links de Google Drive, Google Photos, iCloud o Dropbox
            </p>
          </div>
        </div>
        {linksFotos.length === 0 ? (
          <p className={styles.sinFotos}>Aún no hay álbumes compartidos.</p>
        ) : (
          <ul className={styles.lista}>{linksFotos.map(renderLink)}</ul>
        )}
      </div>

      {/* LISTA LINKS NORMALES */}
      {linksNormales.length === 0 ? (
        <p className={styles.sinLinks}>No hay links todavía.</p>
      ) : (
        <ul className={styles.lista}>{linksNormales.map(renderLink)}</ul>
      )}

    </div>
  )
}

export default Links