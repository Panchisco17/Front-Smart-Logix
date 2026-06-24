import { useEffect, useState } from "react";
import { getOrdersRequest } from "../api/orderApi";
import { getSaveUser } from "../service/authService";

function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Obtenemos los datos del usuario logueado
    const currentUser = getSaveUser();

    useEffect(() => {
        loadMyOrders();
    }, []);

    async function loadMyOrders() {
        setLoading(true);
        try {
            const response = await getOrdersRequest();
            
            // Extraemos los posibles identificadores del usuario desde el JWT
            const username = currentUser?.username?.toLowerCase() || "";
            const email = currentUser?.email?.toLowerCase() || currentUser?.sub?.toLowerCase() || "";

            // Filtro Inteligente: Buscamos órdenes que coincidan con el correo O con el nombre de usuario
            const userOrders = response.filter((order) => {
                const orderEmail = order.customerEmail?.toLowerCase() || "";
                const orderName = order.customerName?.toLowerCase() || "";
                
                const matchEmail = email && orderEmail === email;
                const matchName = username && orderName === username;
                const matchUsernameInEmail = username && orderEmail.includes(username); // Por si el correo es admin@...
                
                return matchEmail || matchName || matchUsernameInEmail;
            });

            // Ordenamos de la más reciente a la más antigua
            const sortedOrders = userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
            
        } catch (err) {
            setError("No pudimos cargar tu historial de pedidos.");
        } finally {
            setLoading(false);
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': 
                return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">Pendiente</span>;
            case 'APPROVED': 
                return <span className="bg-yellow-50 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">En Preparación</span>;
            case 'SHIPMENT_REQUESTED': 
                return <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">Despachado</span>;
            case 'REJECTED': 
                return <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">Rechazado</span>;
            case 'FAILED': 
                return <span className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">Problema con el Envío</span>;
            default: 
                return <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Cargando tus pedidos...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto bg-transparent p-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">📦 Mis Pedidos</h2>

            {error && (
                <div className="mb-4 p-4 rounded bg-red-100 text-red-700 font-medium">
                    {error}
                </div>
            )}

            {orders.length === 0 ? (
                <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500 text-lg">Aún no has realizado ninguna compra con este usuario.</p>
                    <p className="text-sm text-gray-400 mt-2">Asegúrate de usar tu nombre de usuario al realizar el pedido.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                        <div key={order.orderNumber} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Orden # {order.orderNumber}</p>
                                    <p className="text-sm text-gray-600 font-medium">{new Date(order.createdAt).toLocaleDateString()} a las {new Date(order.createdAt).toLocaleTimeString()}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 mb-1">Total Pagado</p>
                                        <p className="text-lg font-bold text-green-600">${order.totalAmount?.toFixed(0)}</p>
                                    </div>
                                    <div>{getStatusBadge(order.status)}</div>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">Dirección de Entrega</h4>
                                    <p className="text-sm text-gray-600">{order.shippingAddress}</p>
                                </div>
                                
                                <div className="flex-1 bg-gray-50 p-4 rounded border border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-700 mb-2">Seguimiento Logístico</h4>
                                    {order.status === 'SHIPMENT_REQUESTED' ? (
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Tu código de rastreo es:</p>
                                            <span className="font-mono text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded">
                                                {order.trackingCode}
                                            </span>
                                        </div>
                                    ) : order.status === 'REJECTED' ? (
                                        <p className="text-xs text-red-600">{order.reason || "Rechazado por falta de stock u otro motivo"}</p>
                                    ) : (
                                        <p className="text-xs text-gray-500 italic">El código de seguimiento se generará cuando el pedido sea despachado de bodega.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrdersPage;