import {useEffect, useState} from "react";
import {message, Spin} from "antd";

import HeaderRow from "../../components/headerRow/HeaderRow.tsx";
import NavBar from "../../components/navbar/NavBar.tsx";
import UserProfileForm from "../../components/form/UserProfileForm.tsx";
import {useAuth} from "../../hook/UseAuth.ts";
import {getUserProfile} from "../../api/user_profile/GetUserProfile.ts";
import {updateUserProfile} from "../../api/user_profile/UpdateUserProfile.ts";
import { UserProfile } from "../../interfaces/UserProfile.ts";


const UserProfilePage = () => {
    const {role} = useAuth();
    const [initialData, setInitialData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getUserProfile()
            .then((data) => {
                setInitialData(data);
            })
            .catch(() => {
                message.error("Failed to load profile");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (values: any) => {
        const hide = message.loading("Saving...");
        try {
            await updateUserProfile(values);
            hide();
            message.success("Profile updated successfully!");
            setInitialData(values); // keep UI in sync
        } catch (error) {
            hide();
            message.error("Failed to update profile");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <NavBar/>
            <HeaderRow role={role} title="User Profile"/>

            <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-lg shadow-md">
                {loading ? (
                    <div className="text-center">
                        <Spin/>
                    </div>
                ) : (
                    <UserProfileForm
                        initialValues={initialData}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
