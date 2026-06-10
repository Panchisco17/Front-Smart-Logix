// src/pages/Register.jsx
import { useState } from "react";
import { registerRequest } from "../api/authApi";

function RegisterPage({ onNavigateToLogin }) {
    const [userData, setUserData] = useState({ username: "", email: "", password: "" });
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerRequest(userData); // Llama a tu API
            alert("Registro exitoso");
            onNavigateToLogin(); // Vuelve al login
        } catch (err) {
            setMessage("Error: " + (err.message || "No se pudo registrar"));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                onChange={(e) => setUserData({...userData, username: e.target.value})}
                className="w-full p-2 border rounded" placeholder="Usuario" required 
            />
            <input 
                type="email"
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                className="w-full p-2 border rounded" placeholder="Correo" required 
            />
            <input 
                type="password"
                onChange={(e) => setUserData({...userData, password: e.target.value})}
                className="w-full p-2 border rounded" placeholder="Contraseña" required 
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                Registrarse
            </button>
            <button type="button" onClick={onNavigateToLogin} className="w-full text-blue-600">
                Volver a Login
            </button>
            {message && <p className="text-red-500">{message}</p>}
        </form>
    );
}
export default RegisterPage;