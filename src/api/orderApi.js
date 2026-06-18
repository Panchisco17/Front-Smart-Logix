import { httpRequest } from "./httpClient";
import { getRequiredAuthorizationHeader } from "../service/authService";

export function getOrdersRequest() {
    return httpRequest("/api/orders", {
        method: "GET",
        headers: {
            "Authorization": getRequiredAuthorizationHeader()
        }
    });
}

export function getOrderByNumberRequest(orderNumber) {
    return httpRequest(`/api/orders/${orderNumber}`, {
        method: "GET",
        headers: {
            "Authorization": getRequiredAuthorizationHeader()
        }
    });
}

export function createOrderRequest(orderData) {
    return httpRequest("/api/orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getRequiredAuthorizationHeader() 
        },
        body: JSON.stringify(orderData)
    });
}

export function updateOrderRequest(orderId, orderData) {
    return httpRequest(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": getRequiredAuthorizationHeader()
        },
        body: JSON.stringify(orderData)
    });
}

export function deleteOrderRequest(id) {
    return httpRequest(`/api/orders/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": getRequiredAuthorizationHeader()
        }
    });
}

export function updateOrderStatusRequest(orderNumber, status) {
    return httpRequest(`/api/orders/${orderNumber}/status?status=${status}`, {
        method: "PUT",
        headers: {
            "Authorization": getRequiredAuthorizationHeader()
        }
    });
}