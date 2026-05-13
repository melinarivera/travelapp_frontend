import React, { useState, useEffect } from 'react';
import api from '../api';
import styles from './MapaPOI.module.css';

const MapaPOI = ({ viajeId }) => {
  const [lugares, setLugares] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const carregarLugares = async () => {
    try {
      const res = await api.get(`/api/poi/viaje/${viajeId}`);
      // A lógica de "mais votados em cima" vem do seu backend (puntuacion_total desc)
      setLugares(res.data);
    } catch (err) {
      console.error("Erro ao carregar ranking:", err);
    }
  };

  useEffect(() => {
    if (viajeId) carregarLugares();
  }, [viajeId]);

const adicionarLugar = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;
    
    // DEBUG: Veja se o ID aparece no console do navegador ao clicar em adicionar
    console.log("Enviando para o ID da viagem:", viajeId);

    try {
      await api.post('/api/poi/nuevo', { 
        nombre: nuevoNombre, 
        viaje_id: Number(viajeId) // Garante que o banco receba um número, não texto
      });
      setNuevoNombre('');
      carregarLugares();
    } catch (err) {
      console.error("Erro ao sugerir local:", err);
    }
  };

  const votar = async (poiId, tipo) => {
    try {
      await api.post('/api/poi/votar', { poiId, tipo });
      carregarLugares(); // Recarrega para o ranking atualizar a posição
    } catch (err) {
      console.error("Erro ao votar:", err);
    }
  };

  return (
    <div className={styles.container}>
      <h3>Sugerir Ponto Turístico</h3>
      <form onSubmit={adicionarLugar} className={styles.form}>
        <input 
          className={styles.input}
          placeholder="Nome do lugar..." 
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <button type="submit" className={styles.btn}>Adicionar</button>
      </form>

      <div className={styles.ranking}>
        {lugares.map((lugar) => (
          <div key={lugar.id} className={styles.item}>
            <span>{lugar.nombre} <strong>({lugar.puntuacion_total || 0} pts)</strong></span>
            <div className={styles.votos}>
              <button onClick={() => votar(lugar.id, 'up')}>👍 {lugar.votos_positivos}</button>
              <button onClick={() => votar(lugar.id, 'down')}>👎 {lugar.votos_negativos}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapaPOI;