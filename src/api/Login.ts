import axios from "axios";


export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${process.env.API_BASE_URL}api/auth/login`,
            {
                "email": email,
                "password": password
            },
            { 
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );
        return response.data;
    } catch(error) {
        console.error(error);
    }
};