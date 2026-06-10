import { httpRequest } from "../api/httpClient";

export async function getOrders() {
    return httpRequest("/api/orders", { method: "GET" });
}

export async function createOrder(orderData) {
    return httpRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
    });
}

export async function updateOrder(orderNumber, orderData) {
    if (!orderNumber) throw new Error("Order Number requerido para actualizar");
    return httpRequest(`/api/orders/${orderNumber}`, {
        method: "PUT",
        body: JSON.stringify(orderData),
    });
}

export async function deleteOrder(orderNumber) {
    if (!orderNumber) throw new Error("Order Number requerido para eliminar");
    return httpRequest(`/api/orders/${orderNumber}`, {
        method: "DELETE",
    });
}