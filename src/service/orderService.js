import {
    getOrdersRequest,
    getOrderByNumberRequest,
    createOrderRequest,
    updateOrderRequest,
    deleteOrderRequest
} from "../api/orderApi";

import { getRequiredAuthorizationHeader } from "./authService";

// GET ALL
export async function getOrders() {
    return getOrdersRequest();
}

// GET BY NUMBER
export async function getOrderByNumber(orderNumber) {
    if (!orderNumber) throw new Error("Order number requerido");
    return getOrderByNumberRequest(orderNumber);
}

// CREATE
export async function createOrder(orderData) {
    if (
        !orderData.customerName ||
        !orderData.customerEmail ||
        !orderData.shippingAddress ||
        !orderData.lines?.length
    ) {
        throw new Error("Order inválida");
    }

    return createOrderRequest(orderData);
}

// UPDATE
export async function updateOrder(orderId, orderData) {
    if (!orderId) throw new Error("Order ID requerido");
    return updateOrderRequest(orderId, orderData);
}

// DELETE
export async function deleteOrder(orderId) {
    if (!orderId) throw new Error("Order ID requerido");
    return deleteOrderRequest(orderId);
}