import { useEffect, useState } from 'react'
import LoginPage from './pages/Login'
import { clearLogin, getSaveToken } from './service/authService'
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

function App() {
  const [isLogin, setIsLogin] = useState(Boolean(getSaveToken()))
  const [current, setCurrent] = useState(getRouterFromHash() || "inventory")

  useEffect(() => {
    function handleHashChange() {
      const hash = getRouterFromHash();
      if(hash) setCurrent(hash);
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

  if (isLogin) {
    const currentLabel = PRIVATE_ROUTER.find(r => r.key === current)?.label || current;

    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-xl">
          <div className="p-6 text-2xl font-bold text-blue-400">
            Smart Logix
          </div>

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

          <div className="p-6 border-t border-gray-700">
            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-all font-semibold" 
              onClick={() => { clearLogin(); setIsLogin(false); }}
            >
              Cerrar Sesión
            </button>
          </div>
        </aside>

        {/* Contenido Principal */}
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

  return <LoginPage handleLoginSucces={() => setIsLogin(true)} />
}

export default App