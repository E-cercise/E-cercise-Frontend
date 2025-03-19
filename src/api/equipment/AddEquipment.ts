import API from "../index.ts";
import {AddEquipmentRequest} from "../../interfaces/Equipment.ts";

export const addEquipment = async (data: AddEquipmentRequest) => {
    try {
        const response = await API.post('/equipment', data);

        if (response.status !== 200){
            throw new Error(response.data.error);
        }
        return response.data;
    } catch (error) {
        console.error('Failed to add equipment:', error);
        throw error;
    }
};
