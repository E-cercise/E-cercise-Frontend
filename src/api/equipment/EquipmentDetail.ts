import API from "../index";

export const equipmentDetail = async (id: string | undefined) => {
        const response = await API.get(`/equipment/${id}`);
        return response.data;
}