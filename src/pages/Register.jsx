import { useState } from "react";
import { registerRequest } from "../api/authApi";
import Logo from "../components/Logo";

function RegisterPage({ onNavigateToLogin }) {
    const [userData, setUserData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            await registerRequest(userData);

            setMessage("Usuario registrado correctamente");

            setTimeout(() => {
                onNavigateToLogin();
            }, 1500);

        } catch (err) {
            setMessage(err.message || "No se pudo registrar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-100 p-6">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <Logo size={40} className="text-slate-800" />
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">Crear cuenta</h2>
                    <p className="text-slate-500 text-sm mb-8 text-center">Regístrate para empezar a comprar</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-slate-700">
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
                                className="input-field mt-1"
                                required
                            />
                        </label>

                        <label className="text-sm font-medium text-slate-700">
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
                                className="input-field mt-1"
                                required
                            />
                        </label>

                        <label className="text-sm font-medium text-slate-700">
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
                                className="input-field mt-1"
                                required
                            />
                        </label>

                        <div className="flex gap-2 mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 py-2.5"
                            >
                                {loading ? "Creando..." : "Registrarse"}
                            </button>

                            <button
                                type="button"
                                onClick={onNavigateToLogin}
                                className="btn-secondary flex-1 py-2.5"
                            >
                                Volver
                            </button>
                        </div>

                        {message && (
                            <p
                                className={`text-center text-sm p-2.5 rounded-xl ${
                                    message.includes("correctamente")
                                        ? "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200"
                                        : "text-rose-700 bg-rose-50 ring-1 ring-rose-200"
                                }`}
                            >
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
