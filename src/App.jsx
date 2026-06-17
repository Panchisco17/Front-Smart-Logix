import { useEffect, useState } from 'react'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
// 1. Importamos getSaveUser para leer los datos del usuario logueado
import { clearLogin, getSaveToken, getSaveUser } from './service/authService'
import ShipmentsPage from './pages/Shipments'
import OrderPage from './pages/Order'
import InventoryPage from './pages/Inventory'

const PRIVATE_ROUTER = [
  { key: "shipment", label: "Envíos", hash: "#/shipment" },
  { key: "order", label: "Órdenes", hash: "#/order" },
  { key: "inventory", label: "Inventario", hash: "#/inventory" }
]

function getRouterFromHash() {
  return window.location.hash.replace("#/", "")
}

// 2. Creamos un diccionario para traducir los roles técnicos a nombres amigables
const ROLE_NAMES = {
  "ROLE_ADMIN": "Administrador",
  "ROLE_WAREHOUSE_MANAGER": "Jefe de Bodega",
  "ROLE_USER": "Usuario"
};

// 3. Asignamos colores distintos según el rol para que destaque visualmente
const ROLE_COLORS = {
  "ROLE_ADMIN": "bg-purple-600",
  "ROLE_WAREHOUSE_MANAGER": "bg-yellow-600",
  "ROLE_USER": "bg-blue-600"
};

function App() {
  const [isLogin, setIsLogin] = useState(Boolean(getSaveToken()))
  const [isRegistering, setIsRegistering] = useState(false)
  const [current, setCurrent] = useState(getRouterFromHash() || "inventory")

  // Obtenemos los datos del usuario actual para pintarlos en la vista
  const currentUser = getSaveUser();
  const displayRole = currentUser ? (ROLE_NAMES[currentUser.role] || currentUser.role) : "";
  const roleColor = currentUser ? (ROLE_COLORS[currentUser.role] || "bg-gray-500") : "bg-gray-500";

  useEffect(() => {
    function handleHashChange() {
      const hash = getRouterFromHash();
      if (hash) setCurrent(hash);
    }
    window.addEventListener("hashchange", handleHashChange)
    handleHashChange()
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  function renderPrivate() {
    if (current === "shipment") return <ShipmentsPage />
    if (current === "order") return <OrderPage />
    if (current === "inventory") return <InventoryPage />
    return <h1 className="text-xl text-gray-500">Ruta no encontrada</h1>
  }

  if (!isLogin) {
    if (isRegistering) {
      return <RegisterPage onNavigateToLogin={() => setIsRegistering(false)} />
    }
    return (
      <LoginPage
        handleLoginSucces={() => setIsLogin(true)}
        onNavigateToRegister={() => setIsRegistering(true)}
      />
    )
  }

  const currentLabel = PRIVATE_ROUTER.find(r => r.key === current)?.label || current;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold text-blue-400">Smart Logix</div>
        
        <nav className="flex-1 mt-4">
          {PRIVATE_ROUTER.map((route) => (
            <a
              key={route.key}
              href={route.hash}
              className={`block px-6 py-3 transition-colors ${
                current === route.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {route.label}
            </a>
          ))}
        </nav>

        {/* --- NUEVA SECCIÓN DE PERFIL DE USUARIO --- */}
        <div className="p-6 border-t border-gray-700 bg-gray-900">
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Logueado como</p>
            <p className="font-bold text-white truncate text-lg" title={currentUser?.username}>
              {currentUser?.username || "Usuario"}
            </p>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full ${roleColor}`}>
                {displayRole}
              </span>
            </div>
          </div>

          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-all font-semibold flex items-center justify-center gap-2"
            onClick={() => { clearLogin(); setIsLogin(false); }}
          >
            Cerrar Sesión
          </button>
        </div>
        {/* ------------------------------------------ */}

      </aside>

      <section className="flex-1 p-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{currentLabel}</h1>
        </header>
        <main className="bg-white p-6 rounded-lg shadow-sm">
          {renderPrivate()}
        </main>
      </section>
    </div>
  )
}

export default App