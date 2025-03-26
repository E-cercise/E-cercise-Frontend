import API from '../index'

export const filteredEquipment = async (searchKeyword: string, muscleGroup: string, page: number, limit: number) => {
    const response = await API.get(`/equipment/list?q=${searchKeyword}&muscle_group=${muscleGroup}&page=${page}&limit=${limit}`);
    return response.data;
}