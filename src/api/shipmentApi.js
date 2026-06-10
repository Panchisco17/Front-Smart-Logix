import { httpRequest } from "./httpClient";

export function getShipments() {
    return httpRequest("/api/shipments", { method: "GET" });
}

export function createShipment(data) {
    return httpRequest("/api/shipments", { 
        method: "POST", 
        body: JSON.stringify(data) 
    });
}

export function updateShipment(id, data) {
    return httpRequest(`/api/shipments/${id}`, { 
        method: "PUT", 
        body: JSON.stringify(data) 
    });
}

export function deleteShipment(id) {
    return httpRequest(`/api/shipments/${id}`, { method: "DELETE" });
}