import API from '../index'

export const filteredEquipment = async (searchKeyword: string, muscleGroup: string, page: number, limit: number, minBudget: string, maxBudget: string) => {
    const response = await API.get(`/equipment/list?q=${searchKeyword}&muscle_group=${muscleGroup}&page=${page}&limit=${limit}&min_budget=${minBudget}&max_budget=${maxBudget}`);
    return response.data;
}