import API from "../index";

export const equipmentDetail = async (id: string | undefined) => {
    try {
        const response = await API.get(`/equipment/${id}`);
        return response.data;
    } catch(err) {
        console.error(err);
    }
}