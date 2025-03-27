import API from "../index";
import {UserProfile} from "../../interfaces/UserProfile.ts";

export const updateUserProfile = async (data: Partial<UserProfile>) => {
    const response = await API.put("/profile/me", data);
    if (response.status !== 200) {
        throw new Error("Failed to update profile");
    }
    return response.data;
};