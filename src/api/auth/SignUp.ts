import API from "../index.ts";
import {RegisterPayload} from "../../interfaces/Auth.ts";

export const registerUser = async (data: RegisterPayload) => {
    const payload = { ...data };
    delete payload.confirm_password;
    const res = await API.post('/auth/register', payload);
    return res.data;
};