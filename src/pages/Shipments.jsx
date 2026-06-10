import { useEffect, useState } from "react";
import {
    getShipment,
    createShipment,
    deleteShipment,
    updateShipmentStatus
} from "../service/shipmentService";

function ShipmentsPage() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [newShipment, setNewShipment] = useState({
        orderNumber: "",
        destinationAddress: "",
        totalUnits: 1
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoading(true);
            setMessage("");

            const data = await getShipment();
            setShipments(data);

        } catch (error) {
            setMessage(error.message || "No se pudieron cargar los envíos");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(event) {
        event.preventDefault();

        try {
            await createShipment(newShipment);

            setMessage("Envío creado correctamente");

            setNewShipment({
                orderNumber: "",
                destinationAddress: "",
                totalUnits: 1
            });

            loadData();

        } catch (error) {
            setMessage(error.message || "No se pudo crear el envío");
        }
    }

    async function handleDelete(trackingCode) {
        const confirmed = window.confirm(
            "¿Estás seguro de eliminar este envío?"
        );

        if (!confirmed) return;

        try {
            await deleteShipment(trackingCode);

            setMessage("Envío eliminado correctamente");

            loadData();

        } catch (error) {
            setMessage(error.message || "No se pudo eliminar el envío");
        }
    }

    async function handleDelivered(trackingCode) {
    try {
        await updateShipmentStatus(
            trackingCode,
            "DELIVERED"
        );

        setMessage("Envío marcado como entregado");

        loadData();

    } catch (error) {
        setMessage(
            error.message ||
            "No se pudo actualizar el estado"
        );
    }
}

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-600 text-lg">
                    Cargando envíos...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">

            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Gestión de Envíos
                </h2>

                <form
                    onSubmit={handleCreate}
                    className="grid md:grid-cols-4 gap-4"
                >
                    <input
                        type="text"
                        placeholder="Número de Orden"
                        value={newShipment.orderNumber}
                        onChange={(e) =>
                            setNewShipment({
                                ...newShipment,
                                orderNumber: e.target.value
                            })
                        }
                        className="p-2 border rounded"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Dirección Destino"
                        value={newShipment.destinationAddress}
                        onChange={(e) =>
                            setNewShipment({
                                ...newShipment,
                                destinationAddress: e.target.value
                            })
                        }
                        className="p-2 border rounded"
                        required
                    />

                    <input
                        type="number"
                        min="1"
                        value={newShipment.totalUnits}
                        onChange={(e) =>
                            setNewShipment({
                                ...newShipment,
                                totalUnits: Number(e.target.value)
                            })
                        }
                        className="p-2 border rounded"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
                    >
                        Agregar Envío
                    </button>
                </form>
            </div>

            {message && (
                <div
                    className={`p-3 rounded-md text-center ${
                        message.toLowerCase().includes("correctamente")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {message}
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">

                <div className="px-6 py-4 border-b">
                    <h3 className="font-semibold text-gray-700">
                        Lista de Envíos
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">

                        <thead className="bg-gray-100">
                            <tr>
                                <th className="text-left p-4 font-semibold">
                                    Orden
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Estado
                                </th>

                                <th className="text-left p-4 font-semibold">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {shipments.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center p-6 text-gray-500"
                                    >
                                        No existen envíos registrados.
                                    </td>
                                </tr>
                            ) : (
                                shipments.map((shipment) => (
                                    <tr
                                        key={shipment.trackingCode}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4">
                                            {shipment.orderNumber}
                                        </td>

                                        <td className="p-4">
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                                                {
                                                shipment.status === "PLANNED"
                                                    ? "Planificado"
                                                    : shipment.status === "PICKED_UP"
                                                    ? "Retirado"
                                                    : shipment.status === "IN_TRANSIT"
                                                    ? "En tránsito"
                                                    : shipment.status === "DELIVERED"
                                                    ? "Entregado"
                                                    : shipment.status
                                            }
                                            </span>
                                        </td>

                                        <td className="p-4 flex gap-2">
                                            {shipment.status !== "DELIVERED" && (
                                                <button
                                                    onClick={() =>
                                                        handleDelivered(
                                                            shipment.trackingCode
                                                        )
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition"
                                                >
                                                    Entregar
                                                </button>
                                            )}

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        shipment.trackingCode
                                                    )
                                                }
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
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

        </div>
    );
}

export default ShipmentsPage;