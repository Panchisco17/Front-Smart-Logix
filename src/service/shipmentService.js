import {
    getShipments,
    createShipment as createShipmentApi,
    deleteShipment as deleteShipmentApi
} from "../api/shipmentApi";

export async function getShipment() {
    return getShipments();
}

export async function createShipment(shipmentData) {
    return createShipmentApi(shipmentData);
}

export async function deleteShipment(id) {
    return deleteShipmentApi(id);
}