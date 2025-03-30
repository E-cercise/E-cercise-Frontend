import { useEffect, useState } from "react";
import { message, Spin } from "antd";

import HeaderRow from "../../components/headerRow/HeaderRow.tsx";
import NavBar from "../../components/navbar/NavBar.tsx";
import UserProfileForm from "../../components/form/UserProfileForm.tsx";
import { useAuth } from "../../hook/UseAuth.ts";
import { getUserProfile } from "../../api/user_profile/GetUserProfile.ts";
import { updateUserProfile } from "../../api/user_profile/UpdateUserProfile.ts";
import { getTags } from "../../api/tag/getTag.ts";
import { getGoals } from "../../api/goal/getGoal.ts";
import { UserGoal, UserTag } from "../../interfaces/UserProfile.ts";


const UserProfilePage = () => {
    const {role} = useAuth();
    const [initialData, setInitialData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<UserTag[]>([]);
    const [goals, setGoals] = useState<UserGoal[]>([]);

    useEffect(() => {
        const loadAll = async () => {
            try {
                setLoading(true);
                const [profile, tagList, goalList] = await Promise.all([
                    getUserProfile(),
                    getTags(),
                    getGoals(),
                ]);

                const normalized = {
                    ...profile,
                    goal_id: profile.goal?.id ?? null,
                    gender: typeof profile.gender === 'string' ? profile.gender : profile.gender?.name ?? 'Male',
                    experience: typeof profile.experience === 'string' ? profile.experience : profile.experience?.name ?? 'Beginner',
                    preferences: profile.preferences?.map((p: any) => p.id) ?? [],
                };

                setInitialData(normalized);
                setTags(tagList);
                setGoals(goalList);
            } catch {
                message.error("Failed to load profile or metadata");
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []);

    const handleSave = async (values: any) => {
        const hide = message.loading("Saving...");
        try {
            await updateUserProfile(values);
            hide();
            message.success("Profile updated successfully!");
            setInitialData({ ...initialData, ...values });
        } catch (error) {
            hide();
            message.error("Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar />
            <HeaderRow role={role} title="User Profile" />

            <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
                {loading ? (
                    <div className="text-center">
                        <Spin />
                    </div>
                ) : (
                    <UserProfileForm
                        initialValues={initialData}
                        onSave={handleSave}
                        availableTags={tags}
                        availableGoals={goals}
                    />
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
