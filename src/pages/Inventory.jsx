import { useEffect, useState } from 'react';
import { getInventory } from "../service/inventoryService";

function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
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
        loadInventory();
    }, []);

    if (loading) return <div className="text-center py-10 text-gray-600">Cargando datos...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Listado de Inventario</h2>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">SKU</th>
                            <th className="px-6 py-4">Producto</th>
                            <th className="px-6 py-4">Bodega</th>
                            <th className="px-6 py-4">Cantidad</th>
                            <th className="px-6 py-4">Última Actualización</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {inventory.map((item) => (
                            <tr key={item.sku} className="bg-white hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{item.sku}</td>
                                <td className="px-6 py-4">{item.productName}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        {item.warehouseCode}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-800">{item.availableQuantity}</td>
                                <td className="px-6 py-4 text-gray-500">{new Date(item.updatedAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InventoryPage;