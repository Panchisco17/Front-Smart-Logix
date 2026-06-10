import { useEffect, useState } from "react";
import {
    getOrders,
    createOrder,
    updateOrder,
    deleteOrder
} from "../service/orderService";

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        customerName: "",
        customerEmail: "",
        shippingAddress: "",
        sku: "",
        quantity: 1,
        unitPrice: 0
    });

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        setError("");

        try {
            const response = await getOrders();

            console.log("RAW ORDERS RESPONSE:", response);

            const data =
                response?.data ??
                response?.content ??
                response;

            setOrders(Array.isArray(data) ? data : []);

        } catch (err) {
            setError("Error al cargar órdenes");
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setForm({
            customerName: "",
            customerEmail: "",
            shippingAddress: "",
            sku: "",
            quantity: 1,
            unitPrice: 0
        });
        setEditingId(null);
    }

    function buildOrderPayload() {
        return {
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
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const data = buildOrderPayload();

        if (
            !data.customerName ||
            !data.customerEmail ||
            !data.shippingAddress ||
            !data.lines[0].sku ||
            data.lines[0].quantity < 1 ||
            !data.lines[0].unitPrice
        ) {
            setError("Completa todos los campos correctamente");
            return;
        }

        try {
            if (editingId) {
                await updateOrder(editingId, data);
                setMessage("Orden actualizada correctamente");
            } else {
                await createOrder(data);
                setMessage("Orden creada correctamente");
            }

            resetForm();
            await loadOrders();
            setError("");

        } catch (err) {
            setError(err.message || "Error al guardar orden");
        }
    }

    async function handleDelete(order) {
        if (!confirm("¿Eliminar esta orden?")) return;

        try {
            const id = order.orderNumber || order.id;
            await deleteOrder(id);

            setMessage("Orden eliminada correctamente");
            await loadOrders();

        } catch (err) {
            setError("Error al eliminar orden");
        }
    }

    function handleEdit(order) {
        setEditingId(order.id);

        const line = order.lines?.[0];

        setForm({
            customerName: order.customerName || "",
            customerEmail: order.customerEmail || "",
            shippingAddress: order.shippingAddress || "",
            sku: line?.sku || "",
            quantity: line?.quantity || 1,
            unitPrice: line?.unitPrice || 0
        });
    }

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-600">
                Cargando órdenes...
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

            <h2 className="text-xl font-bold mb-6 text-gray-800">
                Gestión de Órdenes
            </h2>

            {/* FORM */}
            <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                <h3 className="font-semibold text-gray-700 mb-4">
                    {editingId ? "Editar Orden" : "Crear Orden"}
                </h3>

                <form onSubmit={handleSubmit}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Nombre</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-left">Dirección</th>
                                <th className="p-2 text-left">SKU</th>
                                <th className="p-2 text-left">Cantidad</th>
                                <th className="p-2 text-left">Precio</th>
                                <th className="p-2 text-left">Acción</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="p-2">
                                    <input
                                        value={form.customerName}
                                        onChange={(e) =>
                                            setForm({ ...form, customerName: e.target.value })
                                        }
                                        className="w-full p-2 border rounded"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        value={form.customerEmail}
                                        onChange={(e) =>
                                            setForm({ ...form, customerEmail: e.target.value })
                                        }
                                        className="w-full p-2 border rounded"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        value={form.shippingAddress}
                                        onChange={(e) =>
                                            setForm({ ...form, shippingAddress: e.target.value })
                                        }
                                        className="w-full p-2 border rounded"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        value={form.sku}
                                        onChange={(e) =>
                                            setForm({ ...form, sku: e.target.value })
                                        }
                                        className="w-full p-2 border rounded"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={form.quantity}
                                        onChange={(e) =>
                                            setForm({ ...form, quantity: e.target.value })
                                        }
                                        className="w-full p-2 border rounded"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.unitPrice}
                                        onChange={(e) =>
                                            setForm({ ...form, unitPrice: e.target.value })
                                        }
                                        className="w-full p-2 border rounded"
                                    />
                                </td>

                                <td className="p-2 flex gap-2">
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                    >
                                        {editingId ? "Actualizar" : "Agregar"}
                                    </button>

                                    {editingId && (
                                        <button
                                            type="button"
                                            onClick={resetForm}
                                            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>

            {/* MESSAGES */}
            {message && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
                    {error}
                </div>
            )}

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">

                    <thead className="text-xs uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Dirección</th>
                            <th className="px-6 py-4">Productos</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No existen órdenes registradas.
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id} className="bg-white hover:bg-gray-50">

                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {order.id}
                                    </td>

                                    <td className="px-6 py-4">
                                        {order.customerName}
                                    </td>

                                    <td className="px-6 py-4">
                                        {order.customerEmail}
                                    </td>

                                    <td className="px-6 py-4">
                                        {order.shippingAddress}
                                    </td>

                                    <td className="px-6 py-4">
                                        {order.lines?.map(l =>
                                            `${l.sku} (${l.quantity})`
                                        ).join(", ")}
                                    </td>

                                    <td className="px-6 py-4 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(order)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => handleDelete(order)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>
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