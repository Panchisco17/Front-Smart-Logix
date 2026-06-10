import { useEffect, useState } from 'react'
import './App.css'
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
    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [])

  function renderPrivate() {
    if (current === "shipment") {
      return <ShipmentsPage />
    }

    if (current === "order") {
      return <OrderPage />
    }

    if (current === "inventory") {
      return <InventoryPage />
    }

    return <h1>Ruta no encontrada</h1>
  }

  function handleLoginSucces() {
    setIsLogin(true)
  }

  // Tu función para cerrar sesión ya estaba lista
  function handleLogout() {
    clearLogin()
    setIsLogin(false)
  }

  if (isLogin) {
    return (
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="text-2xl font-bold text-blue-600">Smart Logix</h2>
            </div>
          <nav>
            {PRIVATE_ROUTER.map((route) => (
              <a
                key={route.key}
                href={route.hash}
                className={`nav-link ${current === route.key ? 'active' : ''}`}
              >
                <span>{route.label}</span>
              </a>
            ))}
          </nav>
          
          {/* AQUÍ ESTÁ EL BOTÓN DE CERRAR SESIÓN */}
          <div className="sidebar-footer">
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <section className="main-content">
          {renderPrivate()}
        </section>
      </div>
    )
  }

  return <LoginPage handleLoginSucces={handleLoginSucces} />
}

export default App