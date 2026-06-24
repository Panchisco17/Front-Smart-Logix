import { useEffect, useState } from 'react'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import { clearLogin, getSaveToken, getSaveUser } from './service/authService'
import ShipmentsPage from './pages/Shipments'
import OrderPage from './pages/Order'
import InventoryPage from './pages/Inventory'
import UsersPage from './pages/Users'
import ProductsPage from './pages/Products'
// 1. IMPORTAMOS LA NUEVA PÁGINA DE MIS PEDIDOS
import MyOrdersPage from './pages/MyOrders'

const PRIVATE_ROUTER = [
  // Tienda (Visible para Clientes y Administradores)
  { key: "products", label: "Tienda", hash: "#/products", allowedRoles: ["ROLE_USER", "ROLE_ADMIN"] },
  
  // 2. NUEVA RUTA: Mis Pedidos (Solo para Clientes, o Admin si quiere revisar)
  { key: "my-orders", label: "Mis Pedidos", hash: "#/my-orders", allowedRoles: ["ROLE_USER", "ROLE_ADMIN"] },
  
  // Vistas Administrativas
  { key: "inventory", label: "Inventario", hash: "#/inventory", allowedRoles: ["ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"] },
  { key: "order", label: "Órdenes", hash: "#/order", allowedRoles: ["ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"] },
  { key: "shipment", label: "Envíos", hash: "#/shipment", allowedRoles: ["ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"] },
  { key: "users", label: "Usuarios", hash: "#/users", allowedRoles: ["ROLE_ADMIN"] }
]

function getRouterFromHash() {
  return window.location.hash.replace("#/", "")
}

const ROLE_NAMES = {
  "ROLE_ADMIN": "Administrador",
  "ROLE_WAREHOUSE_MANAGER": "Bodeguero",
  "ROLE_USER": "Cliente" 
};

const ROLE_COLORS = {
  "ROLE_ADMIN": "bg-purple-600",
  "ROLE_WAREHOUSE_MANAGER": "bg-yellow-600",
  "ROLE_USER": "bg-green-600" 
};

function App() {
  const [isLogin, setIsLogin] = useState(Boolean(getSaveToken()))
  const [isRegistering, setIsRegistering] = useState(false)
  
  const currentUser = getSaveUser();
  const displayRole = currentUser ? (ROLE_NAMES[currentUser.role] || currentUser.role) : "";
  const roleColor = currentUser ? (ROLE_COLORS[currentUser.role] || "bg-gray-500") : "bg-gray-500";

  const authorizedRoutes = PRIVATE_ROUTER.filter(route => 
    currentUser && route.allowedRoles.includes(currentUser.role)
  );

  const initialHash = getRouterFromHash();
  const isValidHash = authorizedRoutes.some(r => r.key === initialHash);
  const defaultRoute = authorizedRoutes.length > 0 ? authorizedRoutes[0].key : "products";

  const [current, setCurrent] = useState(isValidHash ? initialHash : defaultRoute);

  useEffect(() => {
    function handleHashChange() {
      const hash = getRouterFromHash();
      if (hash && authorizedRoutes.some(r => r.key === hash)) {
        setCurrent(hash);
      } else if (hash) {
         window.location.hash = `#/${defaultRoute}`;
      }
    }
    window.addEventListener("hashchange", handleHashChange)
    handleHashChange()
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [authorizedRoutes, defaultRoute])

  function renderPrivate() {
    if (current === "products") return <ProductsPage />
    // 3. RENDERIZAMOS LA NUEVA PÁGINA SEGÚN EL HASH
    if (current === "my-orders") return <MyOrdersPage />
    if (current === "shipment") return <ShipmentsPage />
    if (current === "order") return <OrderPage />
    if (current === "inventory") return <InventoryPage />
    if (current === "users") return <UsersPage />
    return <h1 className="text-xl text-gray-500">Cargando interfaz...</h1>
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
          {authorizedRoutes.map((route) => (
            <a
              key={route.key}
              href={route.hash}
              className={`block px-6 py-3 transition-colors ${
                current === route.key ? 'bg-blue-600 text-white border-l-4 border-blue-300' : 'text-gray-400 hover:bg-gray-700 hover:text-white border-l-4 border-transparent'
              }`}
            >
              {route.label}
            </a>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-700 bg-gray-900">
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Conectado como</p>
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

      </aside>

      <section className="flex-1 p-8 overflow-y-auto">
        <header className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">{currentLabel}</h1>
        </header>
        <main className="bg-transparent rounded-lg">
          {renderPrivate()}
        </main>
      </section>
    </div>
  )
}

export default App