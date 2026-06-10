import {
    getInventoryRequest,
    createInventoryItemRequest
} from "../api/inventoryApi";

import { getRequiredAuthorizationHeader } from "./authService";

export async function getInventory() {
    const authorizationHeader = getRequiredAuthorizationHeader();

    return getInventoryRequest(
        authorizationHeader
    );
}

export async function createInventoryItem(itemData) {
    const authorizationHeader =
        getRequiredAuthorizationHeader();

    return createInventoryItemRequest(
        itemData,
        authorizationHeader
    );
}