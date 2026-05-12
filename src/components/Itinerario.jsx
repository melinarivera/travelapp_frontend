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

    useEffect(() => {
        fetchItinerario();
    }, [id]);


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

    if (loading) return <p>Cargando itinerario...</p>;

    return (
        <div className={styles.container}>
         
            {esAdmin && (
                <form className={styles.inputContainer} onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Nombre del local (ej: Restaurante La Paz)" 
                        value={form.nombre_local}
                        onChange={(e) => setForm({...form, nombre_local: e.target.value})}
                        required 
                    />
                    <input 
                        type="text" 
                        placeholder="Dirección (opcional)" 
                        value={form.direccion}
                        onChange={(e) => setForm({...form, direccion: e.target.value})}
                    />
                    <div className={styles.rowInputs}>
                        <input 
                            type="date" 
                            value={form.fecha}
                            onChange={(e) => setForm({...form, fecha: e.target.value})}
                            required 
                        />
                        <input 
                            type="time" 
                            value={form.hora}
                            onChange={(e) => setForm({...form, hora: e.target.value})}
                            required 
                        />
                        <button type="submit" className={styles.addBtn}>+ Añadir</button>
                    </div>
                </form>
            )}

           
            <div className={styles.list}>
                {itinerario.length === 0 ? (
                    <p className={styles.emptyMsg}>No hay eventos programados aún.</p>
                ) : (
                    itinerario.map((item) => (
                        <div key={item.id} className={styles.card}>
                            <div className={styles.info}>
                                <p className={styles.nombreLocal}><strong>{item.nombre_local}</strong></p>
                                <p className={styles.detalles}>
                                    {item.direccion && `${item.direccion} • `} 
                                    {new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' })} a las {item.hora.slice(0,5)}hs
                                </p>
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
                    ))
                )}
            </div>
        </div>
    );
};

export default Itinerario;