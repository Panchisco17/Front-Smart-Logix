import { 
    getShipmentRequest, 
    createShipmentRequest, 
    getShipmentByTrackingRequest, 
    updateShipmentStatusRequest 
} from "../api/shipmentApi"
import { getRequiredAuthorizationHeader } from "./authService"

export async function getShipments() {
    const authorizationHeader = getRequiredAuthorizationHeader()
    return getShipmentRequest(authorizationHeader)
}

export async function createShipment(shipmentData) {  //Se usa cuando el sistema de ventas confirma que una orden debe ser entregada. 
    // Validación básica: asegura que tengamos un código de orden para el envío
    if (!shipmentData.orderNumber) {
        throw new Error("El número de orden es obligatorio para crear el envío")
    }
    const authorizationHeader = getRequiredAuthorizationHeader()
    return createShipmentRequest(authorizationHeader, shipmentData)
}

export async function getShipmentByTracking(trackingCode) { // se valida con codigo para ver seguimiento del pedido 
    if (!trackingCode) throw new Error("Código de seguimiento es obligatorio")
    const authorizationHeader = getRequiredAuthorizationHeader()
    return getShipmentByTrackingRequest(authorizationHeader, trackingCode)
}

export async function updateStatus(trackingCode, status) { // se actualiza el estado de envio  con el codigo 
    if (!trackingCode || !status) throw new Error("Datos incompletos para actualizar estado")
    const authorizationHeader = getRequiredAuthorizationHeader()
    return updateShipmentStatusRequest(authorizationHeader, trackingCode, status)
}