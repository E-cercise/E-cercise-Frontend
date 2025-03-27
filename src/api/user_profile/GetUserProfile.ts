import API from "../index.ts";
import {UserProfile} from "../../interfaces/UserProfile.ts";

export const getUserProfile = async (): Promise<UserProfile> => {
    const response = await API.get<UserProfile>("/profile/me");
    if (response.status !== 200) {
        throw new Error("Failed to get user profile");
    }
    return response.data;
};