import { useState } from "react"
import { login, saveLoginSession } from "../service/authService"

function LoginPage({ handleLoginSucces, onNavigateToRegister }) {
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    async function handleSubmit(event) {
        event.preventDefault()
        setMessage("")
        try {
            const response = await login({ credential, password })
            saveLoginSession(response)
            handleLoginSucces()
        } catch (error) {
            setMessage(error.message)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Smart Logix</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(event) => setCredential(event.target.value)}
                            value={credential}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                        />
                    </div>

                    <div className="flex gap-2 pt-4">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                            Ingresar
                        </button>
                        <button type="button" onClick={onNavigateToRegister} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition">
                            Registrarse
                        </button>
                    </div>
                    {message && <p className="text-red-500 text-sm text-center">{message}</p>}
                </form>
            </div>
        </div>
    )
}

export default LoginPage