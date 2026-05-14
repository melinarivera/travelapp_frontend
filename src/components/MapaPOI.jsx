import React, { useState, useEffect } from 'react';
import api from '../api';
import styles from './MapaPOI.module.css';

const MapaPOI = ({ viajeId, esAdmin }) => {
  const [lugares, setLugares] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');


  const [modalAberto, setModalAberto] = useState(false);
  const [lugarSelecionado, setLugarSelecionado] = useState(null);
  const [dataItinerario, setDataItinerario] = useState('');
  const [horaItinerario, setHoraItinerario] = useState('');
  const [carregandoAdd, setCarregandoAdd] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const carregarLugares = async () => {
    try {
      const res = await api.get(`/api/poi/viaje/${viajeId}`);
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
    console.log("Enviando para o ID da viagem:", viajeId);
    try {
      await api.post('/api/poi/nuevo', {
        nombre: nuevoNombre,
        viaje_id: Number(viajeId),
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
      carregarLugares();
    } catch (err) {
      console.error("Erro ao votar:", err);
    }
  };


  const prepararAdicionAoItinerario = (lugar) => {
    setLugarSelecionado(lugar);
    setDataItinerario('');
    setHoraItinerario('');
    setMensagem('');
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setLugarSelecionado(null);
  };


const confirmarAdicionarAoItinerario = async () => {
  if (!dataItinerario || !horaItinerario) {
    setMensagem('Por favor, preencha a data e a hora.');
    return;
  }
  setCarregandoAdd(true);
  try {
    await api.post(`/api/itinerarios/viaje/${viajeId}`, {
      nombre_local: lugarSelecionado.nombre,
      direccion: lugarSelecionado.direccion || '',
      fecha: dataItinerario,
      hora: horaItinerario,
    });

    
    await api.delete(`/api/poi/${lugarSelecionado.id}`);

    setMensagem('✅ Adicionado ao itinerário com sucesso!');
    setTimeout(() => {
      fecharModal();
      carregarLugares(); 
    }, 1500);
  } catch (err) {
    console.error("Erro:", err);
    setMensagem('❌ Erro ao adicionar. Tente novamente.');
  } finally {
    setCarregandoAdd(false);
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
            <span>
              {lugar.nombre} <strong>({lugar.puntuacion_total || 0} pts)</strong>
            </span>
            <div className={styles.votos}>
              <button onClick={() => votar(lugar.id, 'up')}>👍 {lugar.votos_positivos}</button>
              <button onClick={() => votar(lugar.id, 'down')}>👎 {lugar.votos_negativos}</button>

           
              {esAdmin && (
                <button
                  onClick={() => prepararAdicionAoItinerario(lugar)}
                  className={styles.btnAdmin}
                  title="Adicionar ao Itinerário"
                >
                  🗓️
                </button>
              )}
            </div>
          </div>
        ))}
      </div>


      {modalAberto && (
        <div className={styles.modalOverlay} onClick={fecharModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h4>Adicionar ao Itinerário</h4>
            <p className={styles.modalLugarNome}>📍 {lugarSelecionado?.nombre}</p>

            <label className={styles.label}>Data</label>
            <input
              type="date"
              className={styles.modalInput}
              value={dataItinerario}
              onChange={(e) => setDataItinerario(e.target.value)}
            />

            <label className={styles.label}>Hora</label>
            <input
              type="time"
              className={styles.modalInput}
              value={horaItinerario}
              onChange={(e) => setHoraItinerario(e.target.value)}
            />

            {mensagem && (
              <p className={styles.mensagem}>{mensagem}</p>
            )}

            <div className={styles.modalBtns}>
              <button onClick={fecharModal} className={styles.btnCancelar}>
                Cancelar
              </button>
              <button
                onClick={confirmarAdicionarAoItinerario}
                className={styles.btnConfirmar}
                disabled={carregandoAdd}
              >
                {carregandoAdd ? 'Adicionando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapaPOI;