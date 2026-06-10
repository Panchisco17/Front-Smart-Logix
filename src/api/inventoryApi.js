import { httpRequest } from "./httpClient";

export function getInventoryRequest(authorizationHeader) {
    return httpRequest("/api/inventory/items", {
        headers: {
            Authorization: authorizationHeader
        }
    });
}

export function createInventoryItemRequest(data, authorizationHeader) {
    return httpRequest("/api/inventory/items", {
        method: "POST",
        headers: {
            Authorization: authorizationHeader
        },
        body: JSON.stringify(data)
    });
}