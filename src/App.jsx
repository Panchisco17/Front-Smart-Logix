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
import CouponsPage from './pages/Coupons'
import Logo from './components/Logo'

const PRIVATE_ROUTER = [
  // Tienda (Visible para Clientes y Administradores)
  { key: "products", label: "Tienda", hash: "#/products", icon: "🛍️", allowedRoles: ["ROLE_USER", "ROLE_ADMIN"] },

  // 2. NUEVA RUTA: Mis Pedidos (Solo para Clientes, o Admin si quiere revisar)
  { key: "my-orders", label: "Mis Pedidos", hash: "#/my-orders", icon: "📦", allowedRoles: ["ROLE_USER", "ROLE_ADMIN"] },

  // Vistas Administrativas
  { key: "inventory", label: "Inventario", hash: "#/inventory", icon: "🗃️", allowedRoles: ["ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"] },
  { key: "order", label: "Órdenes", hash: "#/order", icon: "🧾", allowedRoles: ["ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"] },
  { key: "shipment", label: "Envíos", hash: "#/shipment", icon: "🚚", allowedRoles: ["ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"] },
  { key: "coupons", label: "Cupones", hash: "#/coupons", icon: "🏷️", allowedRoles: ["ROLE_ADMIN"] },
  { key: "users", label: "Usuarios", hash: "#/users", icon: "👥", allowedRoles: ["ROLE_ADMIN"] }
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
  "ROLE_ADMIN": "bg-violet-500",
  "ROLE_WAREHOUSE_MANAGER": "bg-amber-500",
  "ROLE_USER": "bg-emerald-500"
};

const PAYMENT_NOTICES = {
  success: { text: "Pago aprobado. Tu pedido fue confirmado.", icon: "✅", className: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200" },
  failed: { text: "Pago rechazado. Tu pedido no pudo completarse.", icon: "❌", className: "bg-rose-50 text-rose-800 ring-1 ring-rose-200" },
  pending: { text: "El pago quedó pendiente de confirmación.", icon: "⏳", className: "bg-amber-50 text-amber-800 ring-1 ring-amber-200" },
}

function App() {
  const [isLogin, setIsLogin] = useState(Boolean(getSaveToken()))
  const [isRegistering, setIsRegistering] = useState(false)
  const [paymentNotice, setPaymentNotice] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const payment = params.get("payment")
    if (payment) {
      setPaymentNotice(payment)
      const cleanUrl = window.location.pathname + window.location.hash
      window.history.replaceState({}, "", cleanUrl)
      setTimeout(() => setPaymentNotice(null), 6000)
    }
  }, [])

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
    if (current === "coupons") return <CouponsPage />
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

  const currentRoute = PRIVATE_ROUTER.find(r => r.key === current);
  const currentLabel = currentRoute?.label || current;
  const initials = (currentUser?.username || "U").slice(0, 2).toUpperCase();

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">
      <aside className="w-64 shrink-0 bg-linear-to-b from-slate-900 via-slate-900 to-indigo-950 text-white flex flex-col h-screen">
        <div className="p-6 border-b border-white/10">
          <Logo size={38} />
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {authorizedRoutes.map((route) => {
            const isActive = current === route.key;
            return (
              <a
                key={route.key}
                href={route.hash}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-base leading-none">{route.icon}</span>
                {route.label}
              </a>
            );
          })}
        </nav>

        <div className="p-4 m-3 mt-0 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0 ${roleColor}`}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white truncate text-sm" title={currentUser?.username}>
                {currentUser?.username || "Usuario"}
              </p>
              <p className="text-xs text-slate-400">{displayRole}</p>
            </div>
          </div>

          <button
            className="w-full bg-white/10 hover:bg-rose-600 text-slate-200 hover:text-white py-2 rounded-xl transition-colors font-semibold flex items-center justify-center gap-2 text-sm"
            onClick={() => { clearLogin(); setIsLogin(false); }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <section className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-8 py-5">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">SmartLogix</p>
          <h1 className="text-2xl font-bold text-slate-800">{currentLabel}</h1>
        </header>

        <div className="p-8">
          {paymentNotice && PAYMENT_NOTICES[paymentNotice] && (
            <div className={`mb-6 px-4 py-3 rounded-2xl font-semibold flex items-center gap-2 ${PAYMENT_NOTICES[paymentNotice].className}`}>
              <span className="text-lg">{PAYMENT_NOTICES[paymentNotice].icon}</span>
              {PAYMENT_NOTICES[paymentNotice].text}
            </div>
          )}
          <main>
            {renderPrivate()}
          </main>
        </div>
      </section>
    </div>
  )
}

export default App