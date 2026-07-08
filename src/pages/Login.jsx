import { useState } from "react"
import { login, saveLoginSession } from "../service/authService"
import Logo from "../components/Logo"

function LoginPage({ handleLoginSucces, onNavigateToRegister }) {
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event) {
        event.preventDefault()
        setMessage("")
        setLoading(true)

        try {
            const response = await login({
                credential,
                password
            })

            saveLoginSession(response)
            handleLoginSucces()

        } catch (error) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-100 p-6">
            <div className="w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <Logo size={40} className="text-slate-800" />
                </div>

                <div className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">Bienvenido de nuevo</h2>
                    <p className="text-slate-500 text-sm mb-8 text-center">Ingresa tus credenciales para continuar</p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="text-sm font-medium text-slate-700">
                            Usuario
                            <input
                                className="input-field mt-1"
                                onChange={(event) => setCredential(event.target.value)}
                                value={credential}
                            />
                        </label>
                        <label className="text-sm font-medium text-slate-700">
                            Contraseña
                            <input
                                type="password"
                                className="input-field mt-1"
                                onChange={(event) => setPassword(event.target.value)}
                                value={password}
                            />
                        </label>

                        <div className="flex gap-2 mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 py-2.5"
                            >
                                {loading ? "Ingresando..." : "Ingresar"}
                            </button>
                            <button
                                type="button"
                                onClick={onNavigateToRegister}
                                className="btn-secondary flex-1 py-2.5"
                            >
                                Registrarse
                            </button>
                        </div>

                        {message && <p className="text-center text-sm text-rose-700 bg-rose-50 ring-1 ring-rose-200 p-2.5 rounded-xl">{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
