import { useEffect, useState } from "react";
import { getShipment, createShipment, deleteShipment } from "../service/shipmentService";

function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newShipment, setNewShipment] = useState({ destination: "", status: "Pendiente" });

    useEffect(() => { loadData(); }, []);

    async function loadData() {
        setLoading(true);
        try {
            const data = await getShipment();
            setShipments(data);
        } catch (err) { console.error(err); }
        setLoading(false);
    }

    async function handleCreate(e) {
        e.preventDefault();
        await createShipment(newShipment);
        setNewShipment({ destination: "", status: "Pendiente" });
        loadData(); // Recarga la tabla
    }

    async function handleDelete(id) {
        if (confirm("¿Eliminar este envío?")) {
            await deleteShipment(id);
            loadData();
        }
    }

    return (
        <div className="space-y-6">
            {/* Formulario de Creación */}
            <form onSubmit={handleCreate} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                <input 
                    placeholder="Destino" 
                    className="border p-2 rounded"
                    value={newShipment.destination}
                    onChange={(e) => setNewShipment({...newShipment, destination: e.target.value})}
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Agregar Envío</button>
            </form>

            {/* Tabla de Datos */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 uppercase text-xs">
                        <tr>
                            <th className="p-3">Destino</th>
                            <th className="p-3">Estado</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {shipments.map((s) => (
                            <tr key={s.id}>
                                <td className="p-3">{s.destination}</td>
                                <td className="p-3">{s.status}</td>
                                <td className="p-3">
                                    <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default ShipmentsPage;