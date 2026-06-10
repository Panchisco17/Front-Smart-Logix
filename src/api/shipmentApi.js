import { httpRequest } from "./httpClient"

// GET /api/shipments
export function getShipmentRequest(authorizationHeader) {
    return httpRequest("/api/shipments", {
        headers: { Authorization: authorizationHeader }
    })
}

// POST /api/shipments //  Crear un nuevo envío
export function createShipmentRequest(authorizationHeader, shipmentData) {
    return httpRequest("/api/shipments", {
        method: "POST",
        headers: { Authorization: authorizationHeader },
        body: JSON.stringify(shipmentData)
    })
}

// GET /api/shipments/{trackingCode} // Rastrear envío
export function getShipmentByTrackingRequest(authorizationHeader, trackingCode) {
    return httpRequest(`/api/shipments/${trackingCode}`, {
        headers: { Authorization: authorizationHeader }
    })
}

// PATCH /api/shipments/{trackingCode}/status //actualiaz el estado de envio 
export function updateShipmentStatusRequest(authorizationHeader, trackingCode, status) {
    // El backend recibe el status como un query param (?value=STATUS)
    return httpRequest(`/api/shipments/${trackingCode}/status?value=${status}`, {
        method: "PATCH",
        headers: { Authorization: authorizationHeader }
    })
}