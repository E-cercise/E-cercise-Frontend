import API from "../index.ts"

export const getOrderList = async (orderStatus?: string, userId?: string, orderId?: string, paymentType?: string) => {
    const response = await API.get(`/order/list`)
    if (response.status !== 200) {
        throw new Error("Failed to get order list");
    }
    return response.data;
}