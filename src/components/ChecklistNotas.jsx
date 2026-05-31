import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import styles from './ChecklistNotas.module.css'

function ChecklistNotas({ viajeId }) {
  const { usuario } = useAuth()
  const [tab, setTab] = useState('checklists')
  const [checklists, setChecklists] = useState([])
  const [notas, setNotas] = useState([])
  const [cargando, setCargando] = useState(true)

  const [nuevoChecklist, setNuevoChecklist] = useState('')
  const [visibilidad, setVisibilidad] = useState('personal')

  const [nuevaNota, setNuevaNota] = useState({ titulo: '', contenido: '', prioridad: 'media', fecha: '' })

  const [nuevoItem, setNuevoItem] = useState({})

  const cargarChecklists = async () => {
    try {
      const res = await api.get(`/api/viajes/${viajeId}/checklists`)
      setChecklists(res.data.checklists)
    } catch (err) {
      console.error('Error al cargar checklists:', err)
    }
  }

  const cargarNotas = async () => {
    try {
      const res = await api.get(`/api/viajes/${viajeId}/notas`)
      setNotas(res.data.notas)
    } catch (err) {
      console.error('Error al cargar notas:', err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarChecklists()
    cargarNotas()
  }, [viajeId])

  const handleCrearChecklist = async (e) => {
    e.preventDefault()
    if (!nuevoChecklist.trim()) return
    try {
      await api.post(`/api/viajes/${viajeId}/checklists`, { titulo: nuevoChecklist, visibilidad })
      setNuevoChecklist('')
      setVisibilidad('personal')
      cargarChecklists()
    } catch (err) {
      console.error('Error al crear checklist:', err)
    }
  }

  const handleEliminarChecklist = async (id) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/checklists/${id}`)
      setChecklists(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error('Error al eliminar checklist:', err)
    }
  }

  const handleAgregarItem = async (checklistId) => {
    const texto = nuevoItem[checklistId]
    if (!texto?.trim()) return
    try {
      await api.post(`/api/viajes/${viajeId}/checklists/${checklistId}/items`, { texto })
      setNuevoItem(prev => ({ ...prev, [checklistId]: '' }))
      cargarChecklists()
    } catch (err) {
      console.error('Error al agregar item:', err)
    }
  }

  const handleToggleItem = async (itemId, completado) => {
    try {
      await api.patch(`/api/viajes/${viajeId}/checklists/items/${itemId}`, { completado: !completado })
      cargarChecklists()
    } catch (err) {
      console.error('Error al actualizar item:', err)
    }
  }

  const handleEliminarItem = async (itemId) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/checklists/items/${itemId}`)
      cargarChecklists()
    } catch (err) {
      console.error('Error al eliminar item:', err)
    }
  }

  const handleCrearNota = async (e) => {
    e.preventDefault()
    if (!nuevaNota.titulo.trim()) return
    try {
      await api.post(`/api/viajes/${viajeId}/notas`, nuevaNota)
      setNuevaNota({ titulo: '', contenido: '', prioridad: 'media' })
      cargarNotas()
    } catch (err) {
      console.error('Error al crear nota:', err)
    }
  }

  const handleEliminarNota = async (id) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/notas/${id}`)
      setNotas(prev => prev.filter(n => n.id !== id))
    } catch (err) {
      console.error('Error al eliminar nota:', err)
    }
  }

  const prioridadColor = { alta: styles.alta, media: styles.media, baja: styles.baja }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Checklist & Notas</h2>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'checklists' ? styles.tabActivo : ''}`}
          onClick={() => setTab('checklists')}
        >
          Checklists
        </button>
        <button
          className={`${styles.tab} ${tab === 'notas' ? styles.tabActivo : ''}`}
          onClick={() => setTab('notas')}
        >
          Notas
        </button>
      </div>

      {tab === 'checklists' && (
        <div>
          <form className={styles.formulario} onSubmit={handleCrearChecklist}>
            <input
              className={styles.input}
              type="text"
              placeholder="Nombre del checklist *"
              value={nuevoChecklist}
              onChange={e => setNuevoChecklist(e.target.value)}
            />
            <select
              className={styles.select}
              value={visibilidad}
              onChange={e => setVisibilidad(e.target.value)}
            >
              <option value="personal">Solo yo</option>
              <option value="grupo">Todo el grupo</option>
            </select>
            <button className={styles.btnSubir} type="submit">+ Crear checklist</button>
          </form>

          {checklists.length === 0 ? (
            <p className={styles.sinDocs}>No hay checklists todavía.</p>
          ) : (
            checklists.map(checklist => (
              <div key={checklist.id} className={styles.checklistCard}>
                <div className={styles.checklistHeader}>
                  <span className={styles.checklistTitulo}>{checklist.titulo}</span>
                  <div className={styles.checklistMeta}>
                    <span className={styles.badge}>
                      {checklist.visibilidad === 'grupo' ? 'Grupo' : 'Personal'}
                    </span>
                    {checklist.creador_id === usuario?.id && (
                      <button
                        className={styles.btnEliminar}
                        onClick={() => handleEliminarChecklist(checklist.id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>

                <ul className={styles.itemLista}>
                  {checklist.checklist_items?.map(item => (
                    <li key={item.id} className={styles.itemRow}>
                      <input
                        type="checkbox"
                        checked={item.completado}
                        onChange={() => handleToggleItem(item.id, item.completado)}
                      />
                      <span className={item.completado ? styles.itemCompletado : ''}>
                        {item.texto}
                      </span>
                      <button
                        className={styles.btnEliminarItem}
                        onClick={() => handleEliminarItem(item.id)}
                      >
                        x
                      </button>
                    </li>
                  ))}
                </ul>

                <div className={styles.addItem}>
                  <input
                    className={styles.inputItem}
                    type="text"
                    placeholder="Añadir item..."
                    value={nuevoItem[checklist.id] || ''}
                    onChange={e => setNuevoItem(prev => ({ ...prev, [checklist.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && handleAgregarItem(checklist.id)}
                  />
                  <button
                    className={styles.btnAddItem}
                    onClick={() => handleAgregarItem(checklist.id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'notas' && (
        <div>
          <form className={styles.formulario} onSubmit={handleCrearNota}>
            <input
              className={styles.input}
              type="text"
              placeholder="Título de la nota *"
              value={nuevaNota.titulo}
              onChange={e => setNuevaNota(prev => ({ ...prev, titulo: e.target.value }))}
            />
            <textarea
              className={styles.textarea}
              placeholder="Contenido (opcional)"
              rows={3}
              value={nuevaNota.contenido}
              onChange={e => setNuevaNota(prev => ({ ...prev, contenido: e.target.value }))}
            />
            <input
              className={styles.input}
              type="date"
              value={nuevaNota.fecha || ''}
              onChange={e => setNuevaNota(prev => ({ ...prev, fecha: e.target.value }))}
            />
            <select
              className={styles.select}
              value={nuevaNota.prioridad}
              onChange={e => setNuevaNota(prev => ({ ...prev, prioridad: e.target.value }))}
            >
              <option value="alta">Alta prioridad</option>
              <option value="media">Media prioridad</option>
              <option value="baja">Baja prioridad</option>
            </select>
            <button className={styles.btnSubir} type="submit">+ Añadir nota</button>
          </form>

          {notas.length === 0 ? (
            <p className={styles.sinDocs}>No hay notas todavía.</p>
          ) : (
            <ul className={styles.lista}>
              {notas.map(nota => (
                <li key={nota.id} className={`${styles.item} ${prioridadColor[nota.prioridad]}`}>
                  <div className={styles.infoNota}>
                    <span className={styles.notaTitulo}>{nota.titulo}</span>
                    {nota.contenido && <p className={styles.notaContenido}>{nota.contenido}</p>}
                    {nota.fecha && <span className={styles.prioridadLabel}>{new Date(nota.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                    <span className={styles.prioridadLabel}>
                      {nota.prioridad === 'alta' ? 'Alta' : nota.prioridad === 'media' ? 'Media' : 'Baja'}
                    </span>
                  </div>
                  <button
                    className={styles.btnEliminar}
                    onClick={() => handleEliminarNota(nota.id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default ChecklistNotas
