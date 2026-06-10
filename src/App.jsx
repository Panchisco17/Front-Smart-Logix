import { useState } from 'react'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import { getSaveToken } from './service/authService'

function App() {
  // Estado para manejar si el usuario ya inició sesión
  const [isLogin, setIsLogin] = useState(Boolean(getSaveToken()))
  
  // Estado para manejar la vista (Login o Registro)
  const [isRegistering, setIsRegistering] = useState(false)

  // Función para manejar el éxito del login
  const handleLoginSucces = () => {
    setIsLogin(true)
  }

  // Si el usuario ya está autenticado, mostramos el Dashboard
  if (isLogin) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Bienvenido a Smart Logix</h1>
        {/* Aquí iría el contenido de tu aplicación privada */}
      </div>
    )
  }

  // Si el estado isRegistering es true, mostramos el formulario de registro
  if (isRegistering) {
    return (
      <RegisterPage 
        onNavigateToLogin={() => setIsRegistering(false)} 
      />
    )
  }

  // Por defecto, mostramos la pantalla de Login
  return (
    <LoginPage 
      handleLoginSucces={handleLoginSucces} 
      onNavigateToRegister={() => setIsRegistering(true)} 
    />
  )
}

export default App