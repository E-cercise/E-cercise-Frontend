import API from "../index.ts"

export const getOrderDetail = async (id: string) => {
    const response = await API.get(`/order/${id}`)
    if (response.status !== 200) {
        throw new Error(`Failed to get order detail id: ${id}`)
    }
    return response.data;
}
