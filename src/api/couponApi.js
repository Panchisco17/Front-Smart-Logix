import { httpRequest } from "./httpClient";
import { getRequiredAuthorizationHeader } from "../service/authService";

export function getCouponsRequest() {
    return httpRequest("/api/coupons", {
        method: "GET",
        headers: {
            Authorization: getRequiredAuthorizationHeader()
        }
    });
}

export function createCouponRequest(data) {
    return httpRequest("/api/coupons", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: getRequiredAuthorizationHeader()
        },
        body: JSON.stringify(data)
    });
}

export function updateCouponRequest(id, data) {
    return httpRequest(`/api/coupons/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: getRequiredAuthorizationHeader()
        },
        body: JSON.stringify(data)
    });
}

export function setCouponStatusRequest(id, active) {
    return httpRequest(`/api/coupons/${id}/status?active=${active}`, {
        method: "PATCH",
        headers: {
            Authorization: getRequiredAuthorizationHeader()
        }
    });
}

export function deleteCouponRequest(id) {
    return httpRequest(`/api/coupons/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: getRequiredAuthorizationHeader()
        }
    });
}
