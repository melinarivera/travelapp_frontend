function RegisterForm({ onSwitch }) {
  return (
    <div>
      <h2>Crear cuenta</h2>
      <input type="email" placeholder="Correo electrónico" />
      <input type="password" placeholder="Contraseña" />
      <button>Registrarse</button>
      <p onClick={onSwitch}>¿Ya tienes cuenta? Inicia sesión</p>
    </div>
  )
}

export default RegisterForm