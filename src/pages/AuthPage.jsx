import { useState } from 'react'
import LoginForm from '../components/LoginForm'
import RegisterForm from '../components/RegisterForm'

function AuthPage() {
  const [mostrarLogin, setMostrarLogin] = useState(true)

  return (
    <div>
      {mostrarLogin
        ? <LoginForm onSwitch={() => setMostrarLogin(false)} />
        : <RegisterForm onSwitch={() => setMostrarLogin(true)} />
      }
    </div>
  )
}

export default AuthPage