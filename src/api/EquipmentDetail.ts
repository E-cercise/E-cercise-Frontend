import API from "../api/index";

export const equipmentDetail = async (id: string) => {
    try {
        const response = await API.get(`/api/equipment/${id}`);
        return response.data;
    } catch(err) {
        console.error(err);
    }
}