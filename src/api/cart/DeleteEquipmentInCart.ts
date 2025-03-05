import API from "../index";

export const deleteEquipmentInCart = async (lineEquipmentId: string) => {
    try {
        const response = await API.delete(`/api/cart/${lineEquipmentId}`)
        return response.data;
    } catch(err) {
        console.error(err);
    }
}