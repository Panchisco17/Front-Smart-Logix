import { jwtDecode } from "jwt-decode"
import { loginRequest } from "../api/authApi"

export async function login({ credential, password }) {
    const cleanCredential = credential.trim()
    const cleanPassword = password.trim()

    if(!cleanCredential || !cleanPassword){
        throw new Error("Ingrese usuario y password")
    }

    // El service aplica reglas de negocio y delega la solicitud HTTP al API.
    return loginRequest({
        credential: cleanCredential,
        password: cleanPassword
    })
}

export function saveLoginSession(loginResponse){
    if(!loginResponse?.token){
        throw new Error("El backend no entrego token")
    }

    localStorage.setItem("token", loginResponse.token)

    localStorage.setItem("user",
        JSON.stringify({
            username: loginResponse.username,
            role: loginResponse.role,
            tokenType: loginResponse.tokenType,
            expiresInMs: loginResponse.expiresInMs
        })
    )
}

export function getSaveToken() {
    return localStorage.getItem("token")
}

// Importante: username y role se leen del JWT decodificado, NUNCA del objeto
// "user" guardado en localStorage. Ese objeto es JSON plano editable desde
// las DevTools del navegador (inspeccionar -> Application -> Local Storage);
// si confiáramos en él, cualquiera podría cambiar su rol a ROLE_ADMIN sin
// tocar el token. El JWT en cambio está firmado por el backend: si alguien
// edita su contenido, la firma deja de ser válida y el backend lo rechaza.
export function getSaveUser() {
    const token = getSaveToken()
    if (!token) {
        return null
    }

    try {
        const decoded = jwtDecode(token)
        const stored = JSON.parse(localStorage.getItem("user")) || {}

        return {
            username: decoded.sub,
            role: decoded.role,
            tokenType: stored.tokenType,
            expiresInMs: stored.expiresInMs
        }
    } catch {
        return null
    }
}

export function getAuthorizationHeader() {
    const token = getSaveToken()
    const user = getSaveUser()

    if(!token){
        return null
    }

    const tokenType = user?.tokenType || "Bearer"
    return `${tokenType} ${token}`
}

export function getRequiredAuthorizationHeader() {
    const authorizationHeader = getAuthorizationHeader()

    if(!authorizationHeader){
        throw new Error("No hay token guardado")
    }

    return authorizationHeader
}

export function clearLogin() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}
