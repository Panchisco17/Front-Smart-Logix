import { useEffect, useState } from "react";
import { getOrdersRequest, updateOrderStatusRequest } from "../api/orderApi";

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        try {
            const response = await getOrdersRequest();
            const sortedOrders = response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setOrders(sortedOrders);
        } catch (err) {
            setError("Error al cargar la lista de órdenes.");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStatus(orderNumber, nextStatus) {
        try {
            await updateOrderStatusRequest(orderNumber, nextStatus);
            await loadOrders(); 
        } catch (err) {
            alert(err.message || "Error al cambiar el estado del pedido.");
        }
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PENDING': 
                return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded">Pendiente</span>;
            case 'APPROVED':
                return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded">Pendiente de Pago</span>;
            case 'PAID':
                return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">Pagado</span>;
            case 'SHIPMENT_REQUESTED':
                return <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-1 rounded">Despachado</span>;
            case 'REJECTED': 
                return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded">Rechazado</span>;
            case 'FAILED':
                return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded">Pago Rechazado</span>;
            default: 
                return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded">{status}</span>;
        }
    };

    if (loading) {
        return <div className="text-center py-10 text-slate-600">Cargando órdenes...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-900/5 border border-slate-200">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Gestión de Órdenes</h2>

            {error && (
                <div className="mb-4 p-3 rounded bg-rose-100 text-rose-700">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">N° Orden</th>
                            <th className="px-6 py-4">Fecha</th>
                            <th className="px-6 py-4">Cliente</th>
                            <th className="px-6 py-4">Total</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-slate-500">
                                    No hay órdenes registradas.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.orderNumber} className="bg-white hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{order.orderNumber}</td>
                                    <td className="px-6 py-4 text-xs">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-800">{order.customerName}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1">{order.shippingAddress}</p>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        ${order.totalAmount?.toFixed(0)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-6 py-4 flex justify-center items-center min-w-40">
                                        
                                        {order.status === 'PAID' && (
                                            <button
                                                onClick={() => handleUpdateStatus(order.orderNumber, 'SHIPMENT_REQUESTED')}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded transition shadow-sm ring-1 ring-slate-900/5 w-full"
                                            >
                                                🚚 Despachar Pedido
                                            </button>
                                        )}

                                        {order.status === 'PENDING' && (
                                            <span className="text-xs text-slate-500 font-medium italic text-center">
                                                Validando inventario...
                                            </span>
                                        )}

                                        {order.status === 'APPROVED' && (
                                            <span className="text-xs text-slate-500 font-medium italic text-center">
                                                Esperando pago del cliente...
                                            </span>
                                        )}

                                        {order.status === 'SHIPMENT_REQUESTED' && (
                                            <div className="flex flex-col text-center w-full">
                                                <span className="text-xs font-bold text-slate-500">Enviado</span>
                                                <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded mt-1">
                                                    {order.trackingCode || "Generando..."}
                                                </span>
                                            </div>
                                        )}

                                        {order.status === 'REJECTED' && (
                                            <span className="text-xs text-rose-500 font-medium text-center line-clamp-2" title={order.rejectionReason}>
                                                {order.rejectionReason || "Rechazado por el sistema"}
                                            </span>
                                        )}

                                        {order.status === 'FAILED' && (
                                            <span className="text-xs text-rose-600 font-bold text-center" title={order.reason}>
                                                Pago rechazado por el cliente
                                            </span>
                                        )}

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default OrderPage;