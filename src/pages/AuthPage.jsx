import { useState, useEffect } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'
import ContactForm from '../components/ContactForm'
import styles from './AuthPage.module.css'

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1600&q=80',
    caption: 'Explora el mundo juntos'
  },
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80',
    caption: 'Playas que te dejarán sin aliento'
  },
  {
    url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1600&q=80',
    caption: 'Aventuras que recordarás siempre'
  },
  {
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80',
    caption: 'Viaja en grupo, crea memorias'
  },
]

function AuthPage() {
  const [mostrarLogin, setMostrarLogin] = useState(true)
  const [slideActual, setSlideActual] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideActual(prev => (prev + 1) % SLIDES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.pagina}>

      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <span className={styles.navLogo}>✈ TravelApp</span>
        <div className={styles.navLinks}>
          <a href="#sobre-nosotros" className={styles.navLink}>Sobre nosotros</a>
          <a href="#contacto" className={styles.navLink}>Contacto</a>
        </div>
      </nav>

      {/* HERO fullscreen */}
      <section className={styles.hero}>
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className={`${styles.slide} ${i === slideActual ? styles.slideActivo : ''}`}
            style={{ backgroundImage: `url(${slide.url})` }}
          />
        ))}
        <div className={styles.overlay} />

        <p className={styles.slideCaption}>{SLIDES[slideActual].caption}</p>

        <div className={styles.slideDots}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === slideActual ? styles.dotActivo : ''}`}
              onClick={() => setSlideActual(i)}
            />
          ))}
        </div>

        {/* Login card flutuante */}
        <div className={styles.loginCard}>
          {mostrarLogin
            ? <LoginForm onSwitch={() => setMostrarLogin(false)} />
            : <RegisterForm onSwitch={() => setMostrarLogin(true)} />
          }
        </div>
      </section>

      {/* SOBRE NOSOTROS */}
      <section id="sobre-nosotros" className={styles.sobreNosotros}>
        <div className={styles.sobreContenido}>
          <span className={styles.badge}>¿Qué es TravelApp?</span>
          <h2 className={styles.sobreTitulo}>Organiza tu viaje en grupo,<br/>sin el caos</h2>
          <p className={styles.sobreTexto}>
            TravelApp es la plataforma para organizar viajes en grupo de forma sencilla y sin estrés.
            Coordina itinerarios, comparte documentos, sugiere puntos de interés y vota con tu grupo —
            todo en un mismo lugar.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIconWrap} style={{background:'#fff0ee'}}>
                <span className={styles.featureIcon}>🗓️</span>
              </div>
              <h3>Itinerario compartido</h3>
              <p>Planifica cada día del viaje con tu grupo en tiempo real.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrap} style={{background:'#f0eeff'}}>
                <span className={styles.featureIcon}>📎</span>
              </div>
              <h3>Tickets y documentos</h3>
              <p>Centraliza vuelos, hoteles y reservas en un solo lugar.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrap} style={{background:'#e8f8f2'}}>
                <span className={styles.featureIcon}>📍</span>
              </div>
              <h3>Puntos de interés</h3>
              <p>Sugiere lugares y vota con tu grupo los favoritos.</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIconWrap} style={{background:'#fff5e8'}}>
                <span className={styles.featureIcon}>👥</span>
              </div>
              <h3>Gestión de grupo</h3>
              <p>Invita a tus compañeros y organízate fácilmente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className={styles.contactoSeccion}>
        <ContactForm />
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerContenido}>
          <div className={styles.footerLogo}>✈ TravelApp</div>
          <div className={styles.footerLinks}>
            <a href="#sobre-nosotros" className={styles.footerLink}>Sobre nosotros</a>
            <a href="#contacto" className={styles.footerLink}>Contacto</a>
            <span className={styles.footerLink}>Condiciones de uso</span>
            <span className={styles.footerLink}>Privacidad</span>
          </div>
          <p className={styles.footerCopy}>© 2026 Priscila & Melina. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  )
}

export default AuthPage