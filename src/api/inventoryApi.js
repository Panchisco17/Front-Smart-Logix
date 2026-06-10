import { httpRequest } from "./httpClient"

// GET /api/inventory/items //trae una lista completa con todos los productos que existen en el inventario.
export function getInventoryRequest(authorizationHeader) {
    return httpRequest("/api/inventory/items", {
        headers: { Authorization: authorizationHeader }
    })
}

// POST /api/inventory/items //Toma los datos de un producto nuevo y lo registra en el sistema 
export function createInventoryItemRequest(authorizationHeader, itemData) {
    return httpRequest("/api/inventory/items", {
        method: "POST",
        headers: { Authorization: authorizationHeader },
        body: JSON.stringify(itemData)
    })
}

// GET /api/inventory/items/{sku} // Busca un único producto específico utilizando su código SKU
export function getItemBySkuRequest(authorizationHeader, sku) {
    return httpRequest(`/api/inventory/items/${sku}`, {
        headers: { Authorization: authorizationHeader }
    })
}
// GET /api/inventory/items/{sku}/availability  // valida si el stock es suficiente 
export function checkAvailabilityRequest(authorizationHeader, sku, quantity) {
    return httpRequest(`/api/inventory/items/${sku}/availability?quantity=${quantity}`, {
        headers: { Authorization: authorizationHeader }
    })
}

// PATCH /api/inventory/items/{sku}/reserve // cambia el estado de stock si este se agrega al carro de compras 
export function reserveStockRequest(authorizationHeader, sku, quantity) {
    return httpRequest(`/api/inventory/items/${sku}/reserve?quantity=${quantity}`, {
        method: "PATCH",
        headers: { Authorization: authorizationHeader }
    })
}

// PATCH /api/inventory/items/{sku}/release // si se elimina un producto del carro de compra este devuelve el stock 
export function releaseStockRequest(authorizationHeader, sku, quantity) {
    return httpRequest(`/api/inventory/items/${sku}/release?quantity=${quantity}`, {
        method: "PATCH",
        headers: { Authorization: authorizationHeader }
    })
}

// PATCH /api/inventory/items/{sku}/dispatch // se marca como despachado y ya se borra del stock 
export function dispatchStockRequest(authorizationHeader, sku, quantity) {
    return httpRequest(`/api/inventory/items/${sku}/dispatch?quantity=${quantity}`, {
        method: "PATCH",
        headers: { Authorization: authorizationHeader }
    })
}