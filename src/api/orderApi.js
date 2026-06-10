import { httpRequest } from "./httpClient"

// GET /api/orders
export function getOrdersRequest(authorizationHeader) {
    return httpRequest("/api/orders", {
        headers: { Authorization: authorizationHeader }
    })
}

// POST /api/orders
export function createOrderRequest(authorizationHeader, orderData) {
    return httpRequest("/api/orders", {
        method: "POST",
        headers: { Authorization: authorizationHeader },
        body: JSON.stringify(orderData)
    })
}

// GET /api/orders/{orderNumber}
export function getOrderByNumberRequest(authorizationHeader, orderNumber) {
    return httpRequest(`/api/orders/${orderNumber}`, {
        headers: { Authorization: authorizationHeader }
    })
}