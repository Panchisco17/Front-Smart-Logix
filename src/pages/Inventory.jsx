import { useEffect, useState } from "react";
import { getInventory, createInventoryItem } from "../service/inventoryService";
import { getSaveUser } from "../service/authService";

function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // 1. Agregamos el precio al estado inicial
    const [newItem, setNewItem] = useState({
        sku: "",
        productName: "",
        warehouseCode: "",
        initialQuantity: 0,
        reorderLevel: 0,
        price: 0 // <-- NUEVO
    });

    const currentUser = getSaveUser();
    const userRole = currentUser?.role;

    useEffect(() => {
        loadInventory();
    }, []);

    async function loadInventory() {
        setLoading(true);
        try {
            const response = await getInventory();
            setInventory(response);
        } catch (err) {
            setError("Error al cargar el inventario");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateItem(event) {
        event.preventDefault();
        try {
            await createInventoryItem(newItem);
            setMessage("Producto agregado correctamente");
            setError("");
            
            // Reiniciamos el formulario incluyendo el precio
            setNewItem({
                sku: "",
                productName: "",
                warehouseCode: "",
                initialQuantity: 0,
                reorderLevel: 0,
                price: 0 // <-- NUEVO
            });
            await loadInventory();
        } catch (err) {
            setMessage("");
            setError(err.message || "No se pudo crear el producto");
        }
    }

    if (loading) {
        return <div className="text-center py-10 text-slate-600">Cargando datos...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-900/5 border border-slate-200">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Gestión de Inventario</h2>

            {(userRole === "ROLE_ADMIN" || userRole === "ROLE_WAREHOUSE_MANAGER") && (
                <div className="bg-slate-50 p-4 rounded-xl border mb-6">
                    <h3 className="font-semibold text-slate-700 mb-4">Agregar Producto</h3>
                    <form onSubmit={handleCreateItem}>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">SKU</label>
                                <input type="text" value={newItem.sku} onChange={(e) => setNewItem({...newItem, sku: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Producto</label>
                                <input type="text" value={newItem.productName} onChange={(e) => setNewItem({...newItem, productName: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Bodega</label>
                                <input type="text" value={newItem.warehouseCode} onChange={(e) => setNewItem({...newItem, warehouseCode: e.target.value})} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Cantidad</label>
                                <input type="number" min="0" value={newItem.initialQuantity} onChange={(e) => setNewItem({...newItem, initialQuantity: Number(e.target.value)})} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Reorden</label>
                                <input type="number" min="0" value={newItem.reorderLevel} onChange={(e) => setNewItem({...newItem, reorderLevel: Number(e.target.value)})} className="w-full p-2 border rounded" required />
                            </div>
                            {/* 2. NUEVO INPUT PARA EL PRECIO */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Precio ($)</label>
                                <input type="number" step="0.01" min="0" value={newItem.price} onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})} className="w-full p-2 border rounded" required />
                            </div>
                            
                            <div className="md:col-span-6 flex justify-end mt-2">
                                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded transition font-bold">
                                    + Agregar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {message && <div className="mb-4 p-3 rounded bg-emerald-100 text-emerald-700">{message}</div>}
            {error && <div className="mb-4 p-3 rounded bg-rose-100 text-rose-700">{error}</div>}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Bodega</th>
                            <th className="px-6 py-4">Precio</th> {/* <-- NUEVA COLUMNA */}
                            <th className="px-6 py-4">Cantidad</th>
                            <th className="px-6 py-4">Reservado</th>
                            <th className="px-6 py-4">Última Actualización</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {inventory.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-6 text-slate-500">No existen productos registrados.</td></tr>
                        ) : (
                            inventory.map((item) => (
                                <tr key={item.sku} className="bg-white hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.sku}</td>
                                    <td className="px-6 py-4">{item.productName}</td>
                                    <td className="px-6 py-4"><span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">{item.warehouseCode}</span></td>
                                    {/* 3. MOSTRAMOS EL PRECIO FORMATEADO */}
                                    <td className="px-6 py-4 font-bold text-emerald-600">${item.price?.toFixed(2)}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{item.availableQuantity}</td>
                                    <td className="px-6 py-4">{item.reservedQuantity}</td>
                                    <td className="px-6 py-4 text-slate-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryPage;