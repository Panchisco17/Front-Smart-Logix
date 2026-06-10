import { httpRequest } from "./httpClient";

// GET ALL
export function getOrdersRequest() {
    return httpRequest("/api/orders");
}

// GET BY NUMBER
export function getOrderByNumberRequest(orderNumber) {
    return httpRequest(`/api/orders/${orderNumber}`);
}

// CREATE
export function createOrderRequest(orderData) {
    return httpRequest("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });
}

// UPDATE
export function updateOrderRequest(orderId, orderData) {
    return httpRequest(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
    });
}

// DELETE
export function deleteOrderRequest(id) {
    return httpRequest(`/api/orders/${id}`, {
        method: "DELETE"
    });
}