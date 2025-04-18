import API from "../index";

export const addEquipmentToCart = async (equipment_id: string | undefined, equipment_option_id: string | undefined, quantity: number) => {
    const response = await API.post('/cart/item', {
        "equipment_id": equipment_id,
        "equipment_option_id": equipment_option_id,
        "quantity": quantity,
    });
    return response.data;
}