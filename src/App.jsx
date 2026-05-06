import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'

function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()
  
  if (cargando) return null
  if (!usuario) return <Navigate to="/" />
  
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App