import API from "../index.ts";


export const getEquipmentCategories = async () => {
    const response = await API.get(`/equipment/categories`);
    return response.data;
}