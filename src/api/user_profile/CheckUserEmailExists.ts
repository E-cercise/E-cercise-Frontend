import API from "../index.ts";

export const checkUserEmailExist = async (email: string): Promise<boolean> => {
    const response = await API.get('/profile/is_exist', {
        params: { email },
    });

    return response.data?.isUserExists === true;
};