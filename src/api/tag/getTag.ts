import API from "../index.ts";

export const getTags = async () => {
    const res = await API.get('/tags');
    return res.data;
};