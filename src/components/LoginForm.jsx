function LoginForm({ onSwitch }) {
  return (
    <div>
      <h2>Iniciar sesión</h2>
      <input type="email" placeholder="Correo electrónico" />
      <input type="password" placeholder="Contraseña" />
      <button>Entrar</button>
      <p onClick={onSwitch}>¿No tienes cuenta? Regístrate</p>
    </div>
  )
}

export default LoginForm