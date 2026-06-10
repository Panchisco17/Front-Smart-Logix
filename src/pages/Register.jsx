import { useState } from "react";
import { registerRequest } from "../api/authApi";

function RegisterPage({ onNavigateToLogin }) {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            await registerRequest(userData);

            setMessage("Usuario registrado correctamente");

            setTimeout(() => {
                onNavigateToLogin();
            }, 1500);

        } catch (err) {
            setMessage(err.message || "No se pudo registrar");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Crear Cuenta
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    <label className="text-sm font-medium text-gray-700">
                        Usuario
                        <input
                            type="text"
                            value={userData.username}
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    username: e.target.value
                                })
                            }
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </label>

                    <label className="text-sm font-medium text-gray-700">
                        Correo electrónico
                        <input
                            type="email"
                            value={userData.email}
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    email: e.target.value
                                })
                            }
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </label>

                    <label className="text-sm font-medium text-gray-700">
                        Contraseña
                        <input
                            type="password"
                            value={userData.password}
                            onChange={(e) =>
                                setUserData({
                                    ...userData,
                                    password: e.target.value
                                })
                            }
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </label>

                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
                        >
                            Registrarse
                        </button>

                        <button
                            type="button"
                            onClick={onNavigateToLogin}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md transition"
                        >
                            Volver
                        </button>
                    </div>

                    {message && (
                        <p
                            className={`text-center text-sm p-2 rounded ${
                                message.includes("correctamente")
                                    ? "text-green-700 bg-green-100"
                                    : "text-red-600 bg-red-100"
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;