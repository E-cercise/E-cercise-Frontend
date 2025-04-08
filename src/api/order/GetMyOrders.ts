import API from "../index.ts"

export const getMyOrders = async (orderStatus: string) => {
    const response = await API.get(`/order/me?order_status=${orderStatus}`)
    if (response.status !== 200) {
        throw new Error("Failed to get order list");
    }
    return response.data;
}