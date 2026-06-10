import { httpRequest } from "./httpClient";

export function getShipments() {
    return httpRequest("/api/shipments", {
        method: "GET"
    });
}

export function createShipment(data) {
    return httpRequest("/api/shipments", {
        method: "POST",
        body: JSON.stringify(data)
    });
}

export function updateShipmentStatus(trackingCode, status) {
    return httpRequest(
        `/api/shipments/${trackingCode}/status?value=${status}`,
        {
            method: "PATCH"
        }
    );
}

export function deleteShipment(trackingCode) {
    return httpRequest(
        `/api/shipments/${trackingCode}`,
        {
            method: "DELETE"
        }
    );
}