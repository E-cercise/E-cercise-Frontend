import API from "../index";

export const addEquipmentToCart = async (equipment_id: string | undefined, equipment_option_id: string | undefined, quantity: number, navigate: (path: string) => void) => {
    try {
        const response = await API.post('/api/cart/item', {
            "equipment_id": equipment_id,
            "equipment_option_id": equipment_option_id,
            "quantity": quantity,
        });
        return response.data;
    } catch(err: any) {
        if (err.response?.status === 401) {
            navigate("/login"); // Redirect to login page
        } else {
            console.error(err);
        }
    }
}