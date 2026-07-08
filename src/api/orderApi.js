import { httpRequest, API_URL_BASE } from "./httpClient";
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

// Descarga la boleta en PDF de una orden pagada y dispara la descarga en el
// navegador. No usa httpRequest porque la respuesta es un PDF binario, no JSON.
export async function downloadReceiptPdf(orderNumber) {
    const response = await fetch(`${API_URL_BASE}/api/orders/${orderNumber}/receipt`, {
        headers: {
            "Authorization": getRequiredAuthorizationHeader()
        }
    });

    if (!response.ok) {
        let message = "No se pudo descargar la boleta.";
        try {
            const data = await response.json();
            message = data?.message || message;
        } catch {
            // respuesta sin cuerpo JSON legible; se usa el mensaje por defecto
        }
        throw new Error(message);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `boleta-${orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}