import API from "../index.ts";
import {AddEquipmentRequest} from "../../interfaces/equipment/AddEquipment.ts";

export const addEquipment = async (data: AddEquipmentRequest) => {
    const response = await API.post('/equipment', data);
    return response.data;
};
