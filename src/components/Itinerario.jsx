import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import styles from './Itinerario.module.css';

const Itinerario = ({ esAdmin }) => {
  const { id } = useParams();
  const [itinerario, setItinerario] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    nombre_local: '',
    direccion: '',
    fecha: '',
    hora: ''
  });

  const fetchItinerario = async () => {
    try {
      const res = await api.get(`/api/itinerarios/viaje/${id}`);
      setItinerario(res.data.itinerario);
    } catch (error) {
      console.error("Erro ao buscar itinerário", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItinerario(); }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/itinerarios/viaje/${id}`, form);
      setForm({ nombre_local: '', direccion: '', fecha: '', hora: '' });
      fetchItinerario();
    } catch (error) {
      alert("Error al añadir item al itinerario");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este evento?")) return;
    try {
      await api.delete(`/api/itinerarios/${itemId}`);
      fetchItinerario();
    } catch (error) {
      alert("Error al eliminar el item");
    }
  };

  // Agrupa itinerario por fecha
  const agrupadoPorFecha = itinerario.reduce((acc, item) => {
    const fecha = item.fecha;
    if (!acc[fecha]) acc[fecha] = [];
    acc[fecha].push(item);
    return acc;
  }, {});

  const fechasOrdenadas = Object.keys(agrupadoPorFecha).sort();

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
  };

  if (loading) return <p className={styles.loading}>Cargando itinerario...</p>;

  return (
    <div className={styles.container}>

      {/* FORMULARIO ADMIN */}
      {esAdmin && (
        <form className={styles.inputContainer} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre del local (ej: Restaurante La Paz)"
            value={form.nombre_local}
            onChange={(e) => setForm({ ...form, nombre_local: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Dirección (opcional)"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
          />
          <div className={styles.rowInputs}>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              required
            />
            <input
              type="time"
              value={form.hora}
              onChange={(e) => setForm({ ...form, hora: e.target.value })}
              required
            />
            <button type="submit" className={styles.addBtn}>+ Añadir</button>
          </div>
        </form>
      )}

      {/* TIMELINE */}
      {itinerario.length === 0 ? (
        <p className={styles.emptyMsg}>No hay eventos programados aún.</p>
      ) : (
        <div className={styles.timeline}>
          {fechasOrdenadas.map((fecha, diaIdx) => (
            <div key={fecha} className={styles.diaBloque}>

              {/* HEADER DEL DÍA */}
              <div className={styles.diaHeader}>
                <div className={styles.diaBadge}>Día {diaIdx + 1}</div>
                <span className={styles.diaFecha}>{formatearFecha(fecha)}</span>
              </div>

              {/* EVENTOS DEL DÍA */}
              <div className={styles.eventos}>
                {agrupadoPorFecha[fecha].map((item, idx) => (
                  <div key={item.id} className={styles.eventoRow}>

                    {/* HORA + LÍNEA */}
                    <div className={styles.horaCol}>
                      <span className={styles.hora}>{item.hora.slice(0, 5)}</span>
                      <div className={styles.lineaVertical}>
                        <div className={styles.punto} />
                        <div className={styles.lineaVertical}>
                         <div className={styles.punto} />
                        <div className={styles.linea} />
                        </div>
                      </div>
                    </div>

                    {/* CARD DEL EVENTO */}
                    <div className={styles.card}>
                      <div className={styles.cardInfo}>
                        <p className={styles.nombreLocal}>{item.nombre_local}</p>
                        {item.direccion && (
                          <p className={styles.direccion}>📍 {item.direccion}</p>
                        )}
                      </div>
                      {esAdmin && (
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(item.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Itinerario;