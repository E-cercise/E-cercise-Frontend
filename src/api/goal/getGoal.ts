import API from "../index.ts";

export const getGoals = async () => {
    const res = await API.get('/goals');
    return res.data;
};