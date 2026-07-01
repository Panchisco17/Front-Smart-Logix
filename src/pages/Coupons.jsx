import { useEffect, useState } from "react";
import {
    getCouponsRequest,
    createCouponRequest,
    updateCouponRequest,
    setCouponStatusRequest,
    deleteCouponRequest
} from "../api/couponApi";

const EMPTY_FORM = {
    code: "",
    description: "",
    type: "PERCENTAGE",
    value: "",
    minSubtotal: "",
    requiredEmailDomain: "",
    firstPurchaseOnly: false,
    active: true,
    startDate: "",
    endDate: "",
    durationDays: ""
};

const TYPE_LABELS = {
    PERCENTAGE: "Porcentaje (%)",
    FIXED_AMOUNT: "Monto fijo ($)",
    TWO_FOR_ONE: "2x1 (línea más barata gratis)"
};

function toDatetimeLocal(isoString) {
    if (!isoString) return "";
    const date = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadCoupons();
    }, []);

    async function loadCoupons() {
        setLoading(true);
        try {
            const response = await getCouponsRequest();
            setCoupons(response);
        } catch (err) {
            setError("Error al cargar los cupones.");
        } finally {
            setLoading(false);
        }
    }

    function handleDurationChange(days) {
        setForm((prev) => {
            if (!days) {
                return { ...prev, durationDays: "" };
            }
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + Number(days));
            return { ...prev, durationDays: days, endDate: toDatetimeLocal(endDate.toISOString()) };
        });
    }

    function resetForm() {
        setForm(EMPTY_FORM);
        setEditingId(null);
    }

    function handleEdit(coupon) {
        setEditingId(coupon.id);
        setForm({
            code: coupon.code,
            description: coupon.description || "",
            type: coupon.type,
            value: coupon.value ?? "",
            minSubtotal: coupon.minSubtotal ?? "",
            requiredEmailDomain: coupon.requiredEmailDomain || "",
            firstPurchaseOnly: coupon.firstPurchaseOnly,
            active: coupon.active,
            startDate: toDatetimeLocal(coupon.startDate),
            endDate: toDatetimeLocal(coupon.endDate),
            durationDays: ""
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setMessage("");

        const payload = {
            code: form.code.trim().toUpperCase(),
            description: form.description.trim() || null,
            type: form.type,
            value: form.value !== "" ? Number(form.value) : null,
            minSubtotal: form.minSubtotal !== "" ? Number(form.minSubtotal) : null,
            requiredEmailDomain: form.requiredEmailDomain.trim() || null,
            firstPurchaseOnly: form.firstPurchaseOnly,
            active: form.active,
            startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
            endDate: form.endDate ? new Date(form.endDate).toISOString() : null
        };

        try {
            if (editingId) {
                await updateCouponRequest(editingId, payload);
                setMessage("Cupón actualizado correctamente.");
            } else {
                await createCouponRequest(payload);
                setMessage("Cupón creado correctamente.");
            }
            resetForm();
            await loadCoupons();
        } catch (err) {
            setError(err.message || "No se pudo guardar el cupón.");
        }
    }

    async function handleToggleActive(coupon) {
        try {
            await setCouponStatusRequest(coupon.id, !coupon.active);
            await loadCoupons();
        } catch (err) {
            setError(err.message || "No se pudo cambiar el estado del cupón.");
        }
    }

    async function handleDelete(coupon) {
        if (!window.confirm(`¿Eliminar el cupón ${coupon.code}?`)) return;
        try {
            await deleteCouponRequest(coupon.id);
            await loadCoupons();
        } catch (err) {
            setError(err.message || "No se pudo eliminar el cupón.");
        }
    }

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Cargando cupones...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    {editingId ? `Editar cupón` : "Nuevo cupón"}
                </h2>

                {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>}
                {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{message}</div>}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Código</label>
                        <input
                            type="text"
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                            className="w-full p-2 border rounded uppercase"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tipo</label>
                        <select
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full p-2 border rounded"
                        >
                            {Object.entries(TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                            Valor {form.type === "TWO_FOR_ONE" && "(no aplica para 2x1)"}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.value}
                            onChange={(e) => setForm({ ...form, value: e.target.value })}
                            className="w-full p-2 border rounded"
                            disabled={form.type === "TWO_FOR_ONE"}
                        />
                    </div>

                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Ej: 25% de descuento en la primera compra"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Subtotal mínimo ($)</label>
                        <input
                            type="number"
                            min="0"
                            value={form.minSubtotal}
                            onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Opcional"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Dominio de correo requerido</label>
                        <input
                            type="text"
                            value={form.requiredEmailDomain}
                            onChange={(e) => setForm({ ...form, requiredEmailDomain: e.target.value })}
                            className="w-full p-2 border rounded"
                            placeholder="Ej: @duocuc.cl (opcional)"
                        />
                    </div>

                    <div className="flex items-end gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.firstPurchaseOnly}
                                onChange={(e) => setForm({ ...form, firstPurchaseOnly: e.target.checked })}
                            />
                            Solo primera compra
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={form.active}
                                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                            />
                            Activo
                        </label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Fecha de inicio</label>
                        <input
                            type="datetime-local"
                            value={form.startDate}
                            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">Deja vacío para que empiece a regir de inmediato.</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Duración fija (días)</label>
                        <input
                            type="number"
                            min="0"
                            value={form.durationDays}
                            onChange={(e) => handleDurationChange(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Ej: 30 (opcional)"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Fecha de término</label>
                        <input
                            type="datetime-local"
                            value={form.endDate}
                            onChange={(e) => setForm({ ...form, endDate: e.target.value, durationDays: "" })}
                            className="w-full p-2 border rounded"
                        />
                        <p className="text-[11px] text-gray-400 mt-1">Deja vacío para que el cupón no venza.</p>
                    </div>

                    <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                        {editingId && (
                            <button type="button" onClick={resetForm} className="px-6 py-2 rounded font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                                Cancelar
                            </button>
                        )}
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition font-bold">
                            {editingId ? "Guardar cambios" : "+ Crear cupón"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Cupones registrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3">Código</th>
                                <th className="px-4 py-3">Tipo</th>
                                <th className="px-4 py-3">Valor</th>
                                <th className="px-4 py-3">Condiciones</th>
                                <th className="px-4 py-3">Vigencia</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coupons.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-6 text-gray-500">No hay cupones registrados.</td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr key={coupon.id} className="bg-white hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-bold text-gray-900">{coupon.code}</td>
                                        <td className="px-4 py-3">{TYPE_LABELS[coupon.type] || coupon.type}</td>
                                        <td className="px-4 py-3">
                                            {coupon.type === "TWO_FOR_ONE"
                                                ? "—"
                                                : coupon.type === "PERCENTAGE"
                                                    ? `${coupon.value}%`
                                                    : `$${coupon.value}`}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500">
                                            {coupon.minSubtotal ? <div>Mín: ${coupon.minSubtotal}</div> : null}
                                            {coupon.requiredEmailDomain ? <div>Correo: {coupon.requiredEmailDomain}</div> : null}
                                            {coupon.firstPurchaseOnly ? <div>Solo primera compra</div> : null}
                                            {!coupon.minSubtotal && !coupon.requiredEmailDomain && !coupon.firstPurchaseOnly ? "—" : null}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500">
                                            {coupon.startDate && <div>Desde {new Date(coupon.startDate).toLocaleDateString()}</div>}
                                            {coupon.endDate
                                                ? <div>Hasta {new Date(coupon.endDate).toLocaleDateString()}</div>
                                                : <div>Sin vencimiento</div>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleToggleActive(coupon)}
                                                className={`text-xs font-bold px-3 py-1 rounded-full transition ${
                                                    coupon.active
                                                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                                }`}
                                            >
                                                {coupon.active ? "Activo" : "Inactivo"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEdit(coupon)} className="text-blue-600 hover:text-blue-800 text-xs font-bold">
                                                    Editar
                                                </button>
                                                <button onClick={() => handleDelete(coupon)} className="text-red-600 hover:text-red-800 text-xs font-bold">
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
        </div>
    );
}

export default CouponsPage;
