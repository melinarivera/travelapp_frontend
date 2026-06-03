import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import styles from './Gastos.module.css'

function Gastos({ viajeId }) {
  const { usuario } = useAuth()
  const [gastos, setGastos] = useState([])
  const [integrantes, setIntegrantes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    descripcion: '',
    valor: '',
    pagador_id: '',
    dividido_entre: []
  })

  const cargarDatos = async () => {
    try {
      const [gastosRes, integrantesRes] = await Promise.all([
        api.get(`/api/viajes/${viajeId}/gastos`),
        api.get(`/api/viajes/${viajeId}/gastos/integrantes`)
      ])
      setGastos(gastosRes.data.gastos)
      setIntegrantes(integrantesRes.data.integrantes)

      // Por defecto, el pagador es el usuario actual
      if (!form.pagador_id) {
        setForm(prev => ({ ...prev, pagador_id: usuario?.id || '' }))
      }
    } catch (err) {
      console.error('Error al cargar datos:', err)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [viajeId])

  const getNombre = (userId) => {
    const integrante = integrantes.find(i => i.usuario_id === userId)
    return integrante?.perfiles?.nombre || 'Sin nombre'
  }

  const handleToggleDividido = (userId) => {
    setForm(prev => {
      const ya = prev.dividido_entre.includes(userId)
      return {
        ...prev,
        dividido_entre: ya
          ? prev.dividido_entre.filter(id => id !== userId)
          : [...prev.dividido_entre, userId]
      }
    })
  }

  const handleSeleccionarTodos = () => {
    const todos = integrantes.map(i => i.usuario_id)
    setForm(prev => ({ ...prev, dividido_entre: todos }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.descripcion.trim()) return setError('La descripción es obligatoria')
    if (!form.valor || Number(form.valor) <= 0) return setError('El valor debe ser mayor que 0')
    if (!form.pagador_id) return setError('Selecciona quién pagó')
    if (form.dividido_entre.length === 0) return setError('Selecciona al menos una persona')

    try {
      await api.post(`/api/viajes/${viajeId}/gastos`, {
        descripcion: form.descripcion,
        valor: Number(form.valor),
        pagador_id: form.pagador_id,
        dividido_entre: form.dividido_entre
      })
      setForm({ descripcion: '', valor: '', pagador_id: usuario?.id || '', dividido_entre: [] })
      cargarDatos()
    } catch (err) {
      setError(err.response?.data?.error || 'Error al añadir el gasto')
    }
  }

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/api/viajes/${viajeId}/gastos/${id}`)
      setGastos(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  // Calcula el resumen de balances
  const calcularBalance = () => {
    const balance = {}
    integrantes.forEach(i => { balance[i.usuario_id] = 0 })

    gastos.forEach(gasto => {
      const partePorPersona = gasto.valor / gasto.dividido_entre.length
      // El pagador recibe crédito por todo lo que pagó
      balance[gasto.pagador_id] = (balance[gasto.pagador_id] || 0) + gasto.valor
      // Cada persona en dividido_entre debe su parte
      gasto.dividido_entre.forEach(userId => {
        balance[userId] = (balance[userId] || 0) - partePorPersona
      })
    })

    return balance
  }

  const totalViaje = gastos.reduce((acc, g) => acc + Number(g.valor), 0)
  const totalPorPersona = integrantes.length > 0 ? totalViaje / integrantes.length : 0
  const balance = calcularBalance()

  if (cargando) return <p className={styles.cargando}>Cargando gastos...</p>

  return (
    <div className={styles.contenedor}>

      {/* RESUMEN */}
      <div className={styles.resumen}>
        <div className={styles.resumenItem}>
          <span className={styles.resumenLabel}>Total del viaje</span>
          <span className={styles.resumenValor}>€{totalViaje.toFixed(2)}</span>
        </div>
        <div className={styles.resumenItem}>
          <span className={styles.resumenLabel}>Por persona</span>
          <span className={styles.resumenValor}>€{totalPorPersona.toFixed(2)}</span>
        </div>
      </div>

      {/* BALANCE POR PERSONA */}
      {integrantes.length > 0 && (
        <div className={styles.balanceBox}>
          <h3 className={styles.balanceTitulo}>Balance</h3>
          <div className={styles.balanceLista}>
            {integrantes.map(i => {
              const b = balance[i.usuario_id] || 0
              return (
                <div key={i.usuario_id} className={styles.balanceRow}>
                  <span className={styles.balanceNombre}>{i.perfiles?.nombre || 'Sin nombre'}</span>
                  <span className={`${styles.balanceValor} ${b >= 0 ? styles.positivo : styles.negativo}`}>
                    {b >= 0 ? '+' : ''}€{b.toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* FORMULARIO */}
      <form className={styles.formulario} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="Descripción del gasto *"
          value={form.descripcion}
          onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))}
        />
        <input
          className={styles.input}
          type="number"
          placeholder="Valor (€) *"
          min="0"
          step="0.01"
          value={form.valor}
          onChange={e => setForm(prev => ({ ...prev, valor: e.target.value }))}
        />

        <div className={styles.campo}>
          <label className={styles.label}>¿Quién pagó?</label>
          <select
            className={styles.select}
            value={form.pagador_id}
            onChange={e => setForm(prev => ({ ...prev, pagador_id: e.target.value }))}
          >
            <option value="">Seleccionar...</option>
            {integrantes.map(i => (
              <option key={i.usuario_id} value={i.usuario_id}>
                {i.perfiles?.nombre || 'Sin nombre'}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.campo}>
          <div className={styles.labelRow}>
            <label className={styles.label}>Dividir entre</label>
            <button type="button" className={styles.btnTodos} onClick={handleSeleccionarTodos}>
              Todos
            </button>
          </div>
          <div className={styles.checkboxGrid}>
            {integrantes.map(i => (
              <label key={i.usuario_id} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={form.dividido_entre.includes(i.usuario_id)}
                  onChange={() => handleToggleDividido(i.usuario_id)}
                />
                {i.perfiles?.nombre || 'Sin nombre'}
              </label>
            ))}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.btnAgregar} type="submit">
          + Añadir gasto
        </button>
      </form>

      {/* LISTA DE GASTOS */}
      {gastos.length === 0 ? (
        <p className={styles.sinGastos}>No hay gastos todavía.</p>
      ) : (
        <ul className={styles.lista}>
          {gastos.map(gasto => (
            <li key={gasto.id} className={styles.item}>
              <div className={styles.infoGasto}>
                <span className={styles.gastoValor}>€{Number(gasto.valor).toFixed(2)}</span>
                <span className={styles.gastoDesc}>{gasto.descripcion}</span>
                <span className={styles.gastoPagador}>
                  Pagó: <strong>{getNombre(gasto.pagador_id)}</strong>
                </span>
                <span className={styles.gastoDividido}>
                  Dividido entre: {gasto.dividido_entre.map(id => getNombre(id)).join(', ')}
                </span>
              </div>
              <button
                className={styles.btnEliminar}
                onClick={() => handleEliminar(gasto.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Gastos