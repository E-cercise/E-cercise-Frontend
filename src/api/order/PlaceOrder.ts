import API from '../index.ts'
import { PlaceOrder } from '../../interfaces/Order.ts'

export const createOrder = async (data: Partial<PlaceOrder>) => {
    const response = await API.post("/order", data)
    if (response.status !== 201) {
        throw new Error("Failed to place order");
    }
    return response.data;
}