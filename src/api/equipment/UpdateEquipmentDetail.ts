import API from "../index.ts";
import {UpdateEquipmentRequest} from "../../interfaces/equipment/UpdateEquipment.ts";

export async function updateEquipment(equipmentId: string, payload: UpdateEquipmentRequest) {
    const response = await API.put(`/equipment/${equipmentId}`, payload);

    return response.data;
}