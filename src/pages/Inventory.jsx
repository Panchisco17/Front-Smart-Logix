import { useEffect, useState } from "react";
import {
    getInventory,
    createInventoryItem
} from "../service/inventoryService";

function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [newItem, setNewItem] = useState({
        sku: "",
        productName: "",
        warehouseCode: "",
        initialQuantity: 0,
        reorderLevel: 0
    });

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

            setNewItem({
                sku: "",
                productName: "",
                warehouseCode: "",
                initialQuantity: 0,
                reorderLevel: 0
            });

            await loadInventory();

        } catch (err) {
            setMessage("");
            setError(
                err.message ||
                "No se pudo crear el producto"
            );
        }
    }

    if (loading) {
        return (
            <div className="text-center py-10 text-gray-600">
                Cargando datos...
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">

            <h2 className="text-xl font-bold mb-6 text-gray-800">
                Gestión de Inventario
            </h2>

            <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                <h3 className="font-semibold text-gray-700 mb-4">
                    Agregar Producto
                </h3>

                <form onSubmit={handleCreateItem}>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">
                                    SKU
                                </th>

                                <th className="p-2 text-left">
                                    Producto
                                </th>

                                <th className="p-2 text-left">
                                    Bodega
                                </th>

                                <th className="p-2 text-left">
                                    Cantidad
                                </th>

                                <th className="p-2 text-left">
                                    Reorden
                                </th>

                               
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={newItem.sku}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                sku: e.target.value
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={newItem.productName}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                productName: e.target.value
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="text"
                                        value={newItem.warehouseCode}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                warehouseCode:
                                                    e.target.value
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={newItem.initialQuantity}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                initialQuantity:
                                                    Number(e.target.value)
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={newItem.reorderLevel}
                                        onChange={(e) =>
                                            setNewItem({
                                                ...newItem,
                                                reorderLevel:
                                                    Number(e.target.value)
                                            })
                                        }
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </td>

                                <td className="p-2">
                                    <button
                                        type="submit"
                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
                                    >
                                        Agregar
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>

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

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">

                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">
                                SKU
                            </th>

                            <th className="px-6 py-4">
                                Producto
                            </th>

                            <th className="px-6 py-4">
                                Bodega
                            </th>

                            <th className="px-6 py-4">
                                Cantidad
                            </th>

                            <th className="px-6 py-4">
                                Reservado
                            </th>

                            <th className="px-6 py-4">
                                Reorden
                            </th>

                            <th className="px-6 py-4">
                                Última Actualización
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {inventory.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-6 text-gray-500"
                                >
                                    No existen productos registrados.
                                </td>
                            </tr>
                        ) : (
                            inventory.map((item) => (
                                <tr
                                    key={item.sku}
                                    className="bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {item.sku}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.productName}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {item.warehouseCode}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 font-bold text-gray-800">
                                        {item.availableQuantity}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.reservedQuantity}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.reorderLevel}
                                    </td>

                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(
                                            item.updatedAt
                                        ).toLocaleDateString()}
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

export default InventoryPage;