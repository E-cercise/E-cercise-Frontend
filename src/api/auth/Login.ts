import axios from "axios";

export const fetchToken = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${process.env.API_BASE_URL}/api/auth/login`,
            {
                "email": email,
                "password": password
            },
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
            }
        );
        return response.data;
    } catch(error) {
        console.error(error);
    }
};