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

    // 4. Hacemos la petición con los encabezados actualizados
    const response = await fetch(`${API_URL_BASE}${path}`, {
        ...options,
        headers
    })

    const text = await response.text()
    const data = text ? JSON.parse(text) : null

    if (!response.ok) {
        throw new Error(data?.message || "Error en la solicitud al backend")
    }

    return data
}

export { API_URL_BASE }