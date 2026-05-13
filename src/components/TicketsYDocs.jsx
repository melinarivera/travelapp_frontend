import { useState, useEffect, useRef } from 'react'
import api from '../api'
import styles from './TicketsYDocs.module.css'

function TicketsYDocs({ viajeId, esTitular }) {
  const [documentos, setDocumentos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [titulo, setTitulo] = useState('')
  const [lugar, setLugar] = useState('')
  const [fecha, setFecha] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)
  const archivoRef = useRef(null)

  const cargarDocumentos = async () => {
    try {
      const res = await api.get(`/api/viajes/${viajeId}/documentos`)
      setDocumentos(res.data.documentos)
    } catch (err) {
      console.error('Error al cargar documentos:', err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDocumentos()
  }, [viajeId])

  const handleSubir = async (e) => {
    e.preventDefault()
    if (!archivo || !titulo) return setError('Título y archivo son obligatorios')
    setSubiendo(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('titulo', titulo)
      formData.append('lugar', lugar)
      formData.append('fecha', fecha)
      formData.append('archivo', archivo)
      await api.post(`/api/viajes/${viajeId}/documentos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setTitulo('')
      setLugar('')
      setFecha('')
      setArchivo(null)
      if (archivoRef.current) archivoRef.current.value = ''
      cargarDocumentos()
    } catch (err) {
      setError('Error al subir el documento')
    } finally {
      setSubiendo(false)
    }
  }

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/documentos/${id}`)
      setDocumentos(prev => prev.filter(doc => doc.id !== id))
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Tickets & Documentos</h2>

      <form className={styles.formulario} onSubmit={handleSubir}>
        <input
          className={styles.input}
          type="text"
          placeholder="Título *"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        <input
          className={styles.input}
          type="text"
          placeholder="Lugar"
          value={lugar}
          onChange={e => setLugar(e.target.value)}
        />
        <input
          className={styles.input}
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
        />
        <input
          ref={archivoRef}
          className={styles.inputArchivo}
          type="file"
          accept="image/*,.pdf"
          onChange={e => setArchivo(e.target.files[0])}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.btnSubir} type="submit" disabled={subiendo}>
          {subiendo ? 'Subiendo...' : '+ Subir documento'}
        </button>
      </form>

      {cargando ? (
        <p className={styles.sinDocs}>Cargando documentos...</p>
      ) : documentos.length === 0 ? (
        <p className={styles.sinDocs}>No hay documentos todavía.</p>
      ) : (
        <ul className={styles.lista}>
          {documentos.map(doc => (
            <li key={doc.id} className={styles.item}>
              <div className={styles.infoDoc}>
                <a className={styles.nombreDoc} href={doc.archivo_url} target="_blank" rel="noreferrer">
                  {doc.titulo}
                </a>
                <span className={styles.metaDoc}>
                  {doc.lugar && `${doc.lugar}`}
                  {doc.lugar && doc.fecha && ' · '}
                  {doc.fecha && `${doc.fecha}`}
                </span>
              </div>
              {esTitular && (
                <button className={styles.btnEliminar} onClick={() => handleEliminar(doc.id)}>
                  Eliminar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TicketsYDocs