import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import styles from './ContactForm.module.css'

function ContactForm() {
  const formRef = useRef(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError(null)
    try {
      await emailjs.sendForm(
  'service_xh7k7yy',
  'template_hasnv2p',
  formRef.current,
  '_gDSIJLsB3IcrjGgw'
)
      setEnviado(true)
formRef.current.reset()
setTimeout(() => setEnviado(false), 3000)
    } catch (err) {
      setError('Hubo un error al enviar el mensaje. Inténtalo de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.titulo}>Contáctanos</h2>
      <p className={styles.subtitulo}>¿Tienes alguna pregunta? Escríbenos y te respondemos.</p>

      {enviado ? (
        <div className={styles.exito}>
          ✅ Mensaje enviado correctamente. ¡Gracias por escribirnos!
        </div>
      ) : (
        <form ref={formRef} className={styles.formulario} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            name="name"
            placeholder="Tu nombre *"
            required
          />
          <input
            className={styles.input}
            type="email"
            name="email"
            placeholder="Tu email *"
            required
          />
          <textarea
            className={styles.textarea}
            name="message"
            placeholder="Tu mensaje *"
            rows={5}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btnEnviar} type="submit" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      )}
    </div>
  )
}

export default ContactForm