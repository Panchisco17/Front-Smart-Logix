const API_URL_BASE = "http://localhost:8080"

// Centraliza la comunicación HTTP para que las API no repitan fetch y parseo JSON.
export async function httpRequest(path, options = {}) {
    // 1. Preparamos los encabezados base
    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    }

    // 2. Buscamos si hay un token guardado (usamos la misma llave que definiste en tu authService)
    const token = localStorage.getItem("token")
    let user = null;
    
    try {
        user = JSON.parse(localStorage.getItem("user"))
    } catch (e) {
        // Ignoramos el error si no hay usuario válido
    }

    // 3. Si hay un token, inyectamos el encabezado de Autorización automáticamente
    if (token && !headers["Authorization"]) {
        const tokenType = user?.tokenType || "Bearer"
        headers["Authorization"] = `${tokenType} ${token}`
    }

    // 4. Hacemos la petición con los encabezados actualizados.
    // cache: "no-store" evita que el navegador reutilice una respuesta vieja
    // cacheada (ej. "Mis Pedidos" visitado antes de pagar) después de volver
    // de un redirect externo (Transbank) — sin esto, el estado/monto se veía
    // desactualizado hasta recargar la página a mano.
    const response = await fetch(`${API_URL_BASE}${path}`, {
        ...options,
        headers,
        cache: "no-store"
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        // Si mandamos un token y el backend lo rechaza (401), la sesión expiró
        // o quedó invalidada (el JWT dura 1 hora). Antes esto hacía que cada
        // pantalla fallara en silencio con un error genérico ("no se pudieron
        // cargar los pedidos", etc.) hasta que el usuario cerraba sesión a
        // mano. Ahora limpiamos la sesión y recargamos para volver al login
        // apenas se detecta, en vez de dejar la app en un estado confuso.
        if (response.status === 401 && token) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.reload()
            return new Promise(() => {})
        }
        throw new Error(data?.message || "Error en la solicitud al backend")
    }

    return data
}

export { API_URL_BASE }