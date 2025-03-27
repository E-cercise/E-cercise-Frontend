import API from "../index.ts";

export const updateOrderStatus = async (id: string) => {
    try {
        const response = await API.put(`/order/status/${id}`);
        return response.data;
    } catch(err) {
        console.error(err);
    }
}