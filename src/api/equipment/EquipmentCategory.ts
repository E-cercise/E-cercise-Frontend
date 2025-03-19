import API from "../index.ts";


export const getEquipmentCategory = async () => {
    try {
        const response = await API.get(`/equipment/categories`);
        return response.data;
    } catch(err) {
        console.error(err);
    }
}