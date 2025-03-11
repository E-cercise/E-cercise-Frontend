import {useEffect, useState} from "react";


interface JwtPayload {
    exp: number;
    name: string;
    role: string;
    user_id: string;
}

const useUserRole = () => {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedJson = atob(payloadBase64);
                const payload: JwtPayload = JSON.parse(decodedJson);

                setRole(payload.role);
            } catch (error) {
                console.error('Invalid token:', error);
                setRole(null);
            }
        }
    }, []);

    return role;
};

export default useUserRole;
