import { useState } from 'react'
import styles from './CrearViajeModal.module.css'

function CrearViajeModal({ onCerrar, onViajeCreado }) {
  const [titulo, setTitulo] = useState('')
  const [destino, setDestino] = useState('')
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const handleImagen = (e) => {
    const archivo = e.target.files[0]
    if (archivo) {
      setImagen(archivo)
      setPreview(URL.createObjectURL(archivo))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    try {
      // aqui va la logica de crear viaje
      console.log({ titulo, destino, fechaInicio, fechaFin, imagen })
    } catch (err) {
      setError('Error al crear el viaje')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.titulo}>Nuevo viaje</h2>
          <button className={styles.btnCerrar} onClick={onCerrar}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.imagenUpload} onClick={() => document.getElementById('inputImagen').click()}>
            {preview
              ? <img src={preview} alt="preview" className={styles.preview} />
              : <div className={styles.imagenPlaceholder}>
                  <span>+ Añadir imagen</span>
                  <span className={styles.imagenSub}>JPG o PNG</span>
                </div>
            }
            <input
              id="inputImagen"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImagen}
              style={{ display: 'none' }}
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Nombre del viaje</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Ej: Verano en Italia"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label}>Destino</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Ej: Roma, Italia"
              value={destino}
              onChange={e => setDestino(e.target.value)}
              required
            />
          </div>

          <div className={styles.fechas}>
            <div className={styles.campo}>
              <label className={styles.label}>Fecha inicio</label>
              <input
                className={styles.input}
                type="date"
                value={fechaInicio}
                onChange={e => setFechaInicio(e.target.value)}
                required
              />
            </div>
            <div className={styles.campo}>
              <label className={styles.label}>Fecha fin</label>
              <input
                className={styles.input}
                type="date"
                value={fechaFin}
                onChange={e => setFechaFin(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.btnCrear} disabled={cargando}>
            {cargando ? 'Creando...' : 'Crear viaje'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default CrearViajeModal