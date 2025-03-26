import API from "../index";

export const deleteEquipmentInCart = async (lineEquipmentId: string) => {
    const response = await API.delete(`/cart/${lineEquipmentId}`)
    return response.data;
}