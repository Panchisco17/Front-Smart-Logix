import { useEffect, useState } from "react";
// Asegúrate de que esta ruta a authApi exista y tenga la función getUsersRequest
import { getUsersRequest } from "../api/authApi"; 
import { getSaveUser } from "../service/authService";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Verificación extra de seguridad en la vista
    const currentUser = getSaveUser();
    if (currentUser?.role !== "ROLE_ADMIN") {
        return (
            <div className="text-center py-10 text-red-600 font-bold">
                Acceso denegado. Esta vista es exclusiva para Administradores.
            </div>
        );
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        setLoading(true);
        try {
            // Simulamos la carga temporalmente si aún no tienes el endpoint en el backend
            // Si ya lo tienes, descomenta la siguiente línea y borra los datos de prueba
            const response = await getUsersRequest();
           
            
            setUsers(response); 
        } catch (err) {
            setError("Error al cargar la lista de usuarios.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Cargando usuarios...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h2>

            {error && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
                    {error}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Usuario</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Rol</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-6 text-gray-500">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="bg-white hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 font-bold">{user.username}</td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                                            user.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' : 
                                            user.role === 'ROLE_WAREHOUSE_MANAGER' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.enabled ? (
                                            <span className="text-green-600 font-bold">Activo</span>
                                        ) : (
                                            <span className="text-red-600 font-bold">Inactivo</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 mr-3">Editar Rol</button>
                                        <button className="text-red-600 hover:text-red-800">Suspender</button>
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

export default UsersPage;