import API from './index'

export const filteredEquipment = async (searchKeyword: string, muscleGroup: string, page: number) => {
    try {
        const response = await API.get(`/api/equipment/list?q=${searchKeyword}&muscle_group=${muscleGroup}&page=${page}&limit=100`);
        return response.data;
    } catch(err) {
        console.error(err);
    }
}