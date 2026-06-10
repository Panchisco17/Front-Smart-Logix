function RegisterPage({ onNavigateToLogin }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h2>
                
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                        <input
                            type="text"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ej: admin"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input
                            type="email"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition font-semibold">
                            Registrarse
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        ¿Ya tienes cuenta?{' '}
                        <button 
                            type="button" 
                            onClick={onNavigateToLogin}
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            Inicia sesión
                        </button>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default RegisterPage