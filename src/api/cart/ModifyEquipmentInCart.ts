import API from "../index";

export const modifyEquipmentInCart = async (object: { lineEquipmentId: string; quantity: number }) => {
    try {
        const response = await API.put("/cart/items", {
            "items" : [{
                "line_equipment_id": object.lineEquipmentId,
                "quantity": object.quantity
            }]
        })
        return response.data;
    } catch(err) {
        console.error(err);
    }
}