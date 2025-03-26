import API from "../index.ts";


export const getEquipmentCategory = async () => {
    const response = await API.get(`/equipment/categories`);
    return response.data;
}