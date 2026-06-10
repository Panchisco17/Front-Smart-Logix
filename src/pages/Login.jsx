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
            const response = await login({
                credential,
                password
            })

            saveLoginSession(response)
            handleLoginSucces()

        } catch (error) {
            setMessage(error.message)
        }
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Smart Logix</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <label className="text-sm font-medium text-gray-700">
                        Usuario
                        <input
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(event) => setCredential(event.target.value)}
                            value={credential}
                        />
                    </label>
                    <label className="text-sm font-medium text-gray-700">
                        Contraseña
                        <input
                            type="password"
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                        />
                    </label>

                    <div className="flex gap-2 mt-2">
                        <button type="submit" className="...">Ingresar</button>
                        <button 
                            type="button" 
                            onClick={onNavigateToRegister} // AQUÍ CONECTAS LA FUNCIÓN
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-md transition"
                        >
                            Registrarse
                        </button>
                    </div>

                    {message && <p className="text-center text-sm text-red-600 bg-red-100 p-2 rounded">{message}</p>}
                </form>
            </div>
        </div>
    )
}

export default LoginPage