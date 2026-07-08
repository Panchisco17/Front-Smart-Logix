import { useEffect, useState } from "react";
import { getUsersRequest, updateUserRoleRequest, updateUserStatusRequest } from "../api/authApi";
import { getSaveUser } from "../service/authService";

const ROLES = ["ROLE_USER", "ROLE_ADMIN", "ROLE_WAREHOUSE_MANAGER"];

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [savingId, setSavingId] = useState(null);

    const currentUser = getSaveUser();
    if (currentUser?.role !== "ROLE_ADMIN") {
        return (
            <div className="text-center py-10 text-rose-600 font-bold">
                Acceso denegado. Esta vista es exclusiva para Administradores.
            </div>
        );
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        setError("");
        try {
            const response = await getUsersRequest();
            setUsers(response);
        } catch (err) {
            setError("Error al cargar la lista de usuarios.");
        } finally {
            setLoading(false);
        }
    }

    async function handleRoleChange(user, newRole) {
        if (newRole === user.role) {
            setEditingId(null);
            return;
        }
        setSavingId(user.id);
        setError("");
        try {
            const updated = await updateUserRoleRequest(user.id, newRole);
            setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
        } catch (err) {
            setError(err.message || "No se pudo actualizar el rol.");
        } finally {
            setSavingId(null);
            setEditingId(null);
        }
    }

    async function handleToggleStatus(user) {
        setSavingId(user.id);
        setError("");
        try {
            const updated = await updateUserStatusRequest(user.id, !user.enabled);
            setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
        } catch (err) {
            setError(err.message || "No se pudo actualizar el estado del usuario.");
        } finally {
            setSavingId(null);
        }
    }

    if (loading) {
        return <div className="text-center py-10 text-slate-600">Cargando usuarios...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-900/5 border border-slate-200">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Gestión de Usuarios</h2>

            {error && (
                <div className="mb-4 p-3 rounded bg-rose-100 text-rose-700">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-slate-500">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => {
                                const isSelf = user.username === currentUser.username;
                                const isSaving = savingId === user.id;
                                return (
                                    <tr key={user.id} className="bg-white hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{user.id}</td>
                                        <td className="px-6 py-4 font-bold">
                                            {user.username}
                                            {isSelf && <span className="ml-2 text-xs text-slate-400">(tú)</span>}
                                        </td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {editingId === user.id ? (
                                                <select
                                                    className="border border-slate-300 rounded px-2 py-1 text-xs"
                                                    defaultValue={user.role}
                                                    autoFocus
                                                    disabled={isSaving}
                                                    onChange={(e) => handleRoleChange(user, e.target.value)}
                                                    onBlur={() => setEditingId(null)}
                                                >
                                                    {ROLES.map((r) => (
                                                        <option key={r} value={r}>{r}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                                                    user.role === 'ROLE_ADMIN' ? 'bg-violet-100 text-violet-800' :
                                                    user.role === 'ROLE_WAREHOUSE_MANAGER' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.enabled ? (
                                                <span className="text-emerald-600 font-bold">Activo</span>
                                            ) : (
                                                <span className="text-rose-600 font-bold">Suspendido</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className="text-indigo-600 hover:text-indigo-800 mr-3 disabled:opacity-40 disabled:cursor-not-allowed"
                                                disabled={isSelf || isSaving}
                                                title={isSelf ? "No puedes cambiar tu propio rol" : ""}
                                                onClick={() => setEditingId(user.id)}
                                            >
                                                Editar Rol
                                            </button>
                                            <button
                                                className={`hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed ${
                                                    user.enabled ? "text-rose-600" : "text-emerald-600"
                                                }`}
                                                disabled={isSelf || isSaving}
                                                title={isSelf ? "No puedes suspender tu propia cuenta" : ""}
                                                onClick={() => handleToggleStatus(user)}
                                            >
                                                {isSaving ? "Guardando..." : user.enabled ? "Suspender" : "Reactivar"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UsersPage;
