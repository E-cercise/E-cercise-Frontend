import API from '../index'

export const equipmentInCategory = async (category: string) => {
    const response = await API.get(`/equipment/equipments-category?category=${category}`);
    return response.data;
}