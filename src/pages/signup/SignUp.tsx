import React, {useEffect, useState} from "react";
import {notification} from "antd";
import {Link, useNavigate} from "react-router-dom";
import "./SignUp.css";
import RegisterForm from "../../components/form/RegisterForm.tsx";
import {UserGoal, UserTag} from "../../interfaces/UserProfile.ts";
import {getGoals} from "../../api/goal/getGoal.ts";
import {getTags} from "../../api/tag/getTag.ts";
import {registerUser} from "../../api/auth/SignUp.ts";


function SignUp() {
    const [goals, setGoals] = useState<UserGoal[]>([]);
    const [tags, setTags] = useState<UserTag[]>([]);
    const [loading, setLoading] = useState(false);
    const [errorFields, setErrorFields] = useState<Record<string, string>>({});
    const [navigate] = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [goalRes, tagRes] = await Promise.all([
                    getGoals(),
                    getTags()
                ]);
                setGoals(goalRes);
                setTags(tagRes);
            } catch {
                notification.error({ message: 'Failed to load goals or tags' });
            }
        };

        fetchData();
    }, []);


    const handleSubmit = async (values: any) => {
        setLoading(true);
        setErrorFields({});
        try {
            await registerUser(values);
            notification.success({ message: 'Registered successfully!' });
            navigate("/login");
        } catch (error: any) {
            const isFieldError = typeof error === 'object' && error.message === 'Validation failed';
            if (isFieldError && error.response?.data?.errors) {
                setErrorFields(error.response.data.errors);
            } else {
                notification.error({ message: error.message });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-white p-8 shadow rounded">
                <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>
                <RegisterForm
                    onSubmit={handleSubmit}
                    loading={loading}
                    goals={goals}
                    tags={tags}
                    errorFields={errorFields}
                />
                <p className="text-center text-xs">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="underline underline-offset-1 text-[#0087E7]"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};



export default SignUp;
