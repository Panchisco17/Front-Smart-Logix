import { getOrdersRequest, createOrderRequest, getOrderByNumberRequest } from "../api/orderApi"
import { getRequiredAuthorizationHeader } from "./authService"

export async function getOrders() {
    // El service valida sesión antes de pedir datos al backend.
    const authorizationHeader = getRequiredAuthorizationHeader()
    return getOrdersRequest(authorizationHeader)
}

export async function createOrder(orderData) {
    // Validación de negocio: una orden necesita al menos el email del cliente y un arreglo de ítems
    if (!orderData.customerEmail || !orderData.items || orderData.items.length === 0) {
        throw new Error("La orden debe tener un email de cliente y al menos un producto")
    }

    const authorizationHeader = getRequiredAuthorizationHeader()
    return createOrderRequest(authorizationHeader, orderData)
}

export async function getOrderByNumber(orderNumber) {
    // Evita hacer la petición si el número de orden viene vacío
    if (!orderNumber) {
        throw new Error("El número de orden es obligatorio para la búsqueda")
    }

    const authorizationHeader = getRequiredAuthorizationHeader()
    return getOrderByNumberRequest(authorizationHeader, orderNumber)
}