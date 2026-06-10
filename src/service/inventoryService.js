import { 
    getInventoryRequest,
    createInventoryItemRequest,
    getItemBySkuRequest,
    checkAvailabilityRequest,
    reserveStockRequest,
    releaseStockRequest,
    dispatchStockRequest
} from "../api/inventoryApi"
import { getRequiredAuthorizationHeader } from "./authService"

export async function getInventory() {
    // valida sesion antes de pedir datos al backend.
    const authorizationHeader = getRequiredAuthorizationHeader()
    return getInventoryRequest(authorizationHeader)
}

export async function createItem(itemData) {
    // Validación de negocio en el frontend
    if (!itemData.sku || !itemData.name || itemData.stock < 0) {
        throw new Error("Datos del producto inválidos o incompletos")
    }
    const authorizationHeader = getRequiredAuthorizationHeader()
    return createInventoryItemRequest(authorizationHeader, itemData)
}

export async function getItem(sku) { // para la busqueda por codigo solo se puede realizar con sku 
    if (!sku) throw new Error("El SKU es obligatorio para la búsqueda")
    const authorizationHeader = getRequiredAuthorizationHeader()
    return getItemBySkuRequest(authorizationHeader, sku)
}

export async function checkStock(sku, quantity) {
    if (quantity <= 0) throw new Error("La cantidad a consultar debe ser mayor a 0")
    const authorizationHeader = getRequiredAuthorizationHeader()
    return checkAvailabilityRequest(authorizationHeader, sku, quantity)
}

export async function reserveItem(sku, quantity) {
    if (quantity <= 0) throw new Error("Debe reservar al menos 1 unidad")
    const authorizationHeader = getRequiredAuthorizationHeader()
    return reserveStockRequest(authorizationHeader, sku, quantity)
}

export async function releaseItem(sku, quantity) {
    if (quantity <= 0) throw new Error("La cantidad a liberar debe ser mayor a 0")
    const authorizationHeader = getRequiredAuthorizationHeader()
    return releaseStockRequest(authorizationHeader, sku, quantity)
}

export async function dispatchItem(sku, quantity) {
    if (quantity <= 0) throw new Error("La cantidad a despachar debe ser mayor a 0")
    const authorizationHeader = getRequiredAuthorizationHeader()
    return dispatchStockRequest(authorizationHeader, sku, quantity)
}