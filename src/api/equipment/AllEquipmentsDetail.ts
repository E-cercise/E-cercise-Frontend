import API from '../index'

export const allEquipmentsDetail = async (equipmentIDs: string) => {
    const response = await API.get(`/equipment/comparison?equipment_ids=${equipmentIDs}`);
    if (response.status != 200) {
        throw new Error("")
    }
    return response.data;
}