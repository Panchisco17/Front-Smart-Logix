import {
    getShipments,
    createShipment as createShipmentApi,
    deleteShipment as deleteShipmentApi,
    updateShipmentStatus as updateShipmentStatusApi
} from "../api/shipmentApi";

export async function getShipment() {
    return getShipments();
}

export async function createShipment(shipmentData) {
    return createShipmentApi(shipmentData);
}

export async function deleteShipment(trackingCode) {
    return deleteShipmentApi(trackingCode);
}

export async function updateShipmentStatus(trackingCode, status) {
    return updateShipmentStatusApi(trackingCode, status);
}