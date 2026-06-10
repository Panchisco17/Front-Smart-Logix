import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../service/orderService';

export default function Order() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingNumber, setEditingNumber] = useState(null);

    const [form, setForm] = useState({
        customerName: '',
        customerEmail: '',
        shippingAddress: '',
        sku: '',
        quantity: 1,
        unitPrice: 0
    });

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders();
            setOrders(Array.isArray(response) ? response : []);
            setError(null);
        } catch (err) {
            console.error("Error al cargar órdenes:", err);
            setError("No se pudieron cargar las órdenes del servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const payload = {
            customerName: form.customerName.trim(),
            customerEmail: form.customerEmail.trim(),
            shippingAddress: form.shippingAddress.trim(),
            lines: [
                {
                    sku: form.sku.trim(),
                    quantity: Number(form.quantity),
                    unitPrice: Number(form.unitPrice)
                }
            ]
        };

        try {
            if (editingNumber) {
                await updateOrder(editingNumber, payload);
                alert("Orden actualizada con éxito");
            } else {
                await createOrder(payload);
                alert("Orden creada con éxito");
            }
            resetForm();
            loadOrders();
        } catch (err) {
            console.error("Error al guardar la orden:", err);
            alert("Error al guardar la orden. Revisa la consola.");
        }
    };

    const handleEdit = (order) => {
        setEditingNumber(order.orderNumber);
        
        const firstLine = order.lines && order.lines[0] ? order.lines[0] : {};

        // Como el backend no devuelve los datos del cliente, los dejamos en blanco para que 
        // se puedan volver a ingresar si se está actualizando la orden.
        setForm({
            customerName: '',
            customerEmail: '',
            shippingAddress: '',
            sku: firstLine.sku || '',
            quantity: firstLine.quantity || 1,
            unitPrice: firstLine.unitPrice || 0
        });
    };

    const handleDeleteOrder = async (order) => {
        if (!window.confirm(`¿Estás seguro de eliminar la orden ${order.orderNumber}?`)) return;
        try {
            await deleteOrder(order.orderNumber);
            alert("Orden eliminada con éxito");
            loadOrders();
        } catch (err) {
            console.error("Error al eliminar orden:", err);
            alert("Error al eliminar orden.");
        }
    };

    const resetForm = () => {
        setEditingNumber(null);
        setForm({
            customerName: '',
            customerEmail: '',
            shippingAddress: '',
            sku: '',
            quantity: 1,
            unitPrice: 0
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Gestión de Órdenes</h1>
            
            {/* Formulario de Registro / Edición */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                    {editingNumber ? `Editar Orden: ${editingNumber}` : 'Crear Nueva Orden'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Nombre Cliente</label>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={form.customerName}
                            onChange={e => setForm({...form, customerName: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Email Cliente</label>
                        <input 
                            type="email" 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={form.customerEmail}
                            onChange={e => setForm({...form, customerEmail: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Dirección de Envío</label>
                        <input 
                            type="text" 
                            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={form.shippingAddress}
                            onChange={e => setForm({...form, shippingAddress: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="border-t pt-4 mt-4">
                    <h3 className="text-md font-medium mb-3 text-gray-700">Detalle del Producto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">SKU</label>
                            <input 
                                type="text" 
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={form.sku}
                                onChange={e => setForm({...form, sku: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Cantidad</label>
                            <input 
                                type="number" 
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={form.quantity}
                                onChange={e => setForm({...form, quantity: e.target.value})}
                                min="1"
                                required
                        />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Precio Unitario</label>
                            <input 
                                type="number" 
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={form.unitPrice}
                                onChange={e => setForm({...form, unitPrice: e.target.value})}
                                min="0"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex gap-2 justify-end">
                    {editingNumber && (
                        <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition">
                            Cancelar
                        </button>
                    )}
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                        {editingNumber ? 'Actualizar Orden' : 'Crear Orden'}
                    </button>
                </div>
            </form>

            {/* Alerta de Error */}
            {error && <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

            {/* Tabla de Órdenes Simplificada */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3">Nº Orden</th>
                            <th className="px-6 py-3">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-400">Cargando datos del sistema...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-400">No se encontraron registros de órdenes.</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.orderNumber} className="bg-white hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {order.orderNumber}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        ${order.totalAmount?.toLocaleString('es-CL') || order.totalAmount}
                                    </td>
                                    
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex gap-2 justify-center">
                                            <button 
                                                onClick={() => handleEdit(order)} 
                                                className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded hover:bg-amber-100 transition text-xs"
                                            >
                                                Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteOrder(order)} 
                                                className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 transition text-xs"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
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