import API from "../index.ts"

export const getOrderList = async (orderStatus?: string, userId?: string, orderId?: string, paymentType?: string) => {
    const response = await API.get(`/order/list?order_status=${orderStatus}&user_id=${userId}&order_id=${orderId}&payment_type=${paymentType}`)
    if (response.status !== 200) {
        throw new Error("Failed to get order list");
    }
    return response.data;
}