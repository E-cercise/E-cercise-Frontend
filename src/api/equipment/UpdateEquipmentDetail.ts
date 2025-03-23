import API from "../index.ts";
import {UpdateEquipmentRequest} from "../../interfaces/equipment/UpdateEquipment.ts";

export async function updateEquipment(equipmentId: string, payload: UpdateEquipmentRequest) {
    try {
        const response = await API.put(`/equipment/${equipmentId}`, JSON.stringify(payload));
        if (response.status != 200){
            throw new Error(response.statusText);
        }

        return response.data;
    }catch (error) {
        console.error(error);
        return error
    }

}