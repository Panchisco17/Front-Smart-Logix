import { httpRequest } from "./httpClient"
// Importamos la función para obtener el token guardado y enviarlo en la petición
import { getRequiredAuthorizationHeader } from "../service/authService"

// El API solo conoce el endpoint y como enviar los datos al backend.
export function loginRequest({ credential, password }) {
    return httpRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            credential,
            password
        })
    })
}

// POST Registra un nuevo usuario en el sistema
export function registerRequest(userData) {
    return httpRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
    })
}

// GET Valida un token JWT existente
export function validateTokenRequest(token) {
    return httpRequest("/api/auth/validate", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

// --- NUEVA FUNCIÓN ---
// GET Obtiene la lista de todos los usuarios (Exclusivo para el ADMIN)
export function getUsersRequest() {
    return httpRequest("/api/auth/users", {
        method: "GET",
        headers: {
            "Authorization": getRequiredAuthorizationHeader()
        }
    })
}