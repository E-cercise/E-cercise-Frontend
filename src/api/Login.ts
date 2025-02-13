import axios from "axios";


export const login = async (encryptedLoginBody: string) => {
    try {
        const response = await axios.post(`${process.env.API_BASE_URL}api/auth/login`,
            {
                "login_body": encryptedLoginBody
            },
            { 
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': true
                },
            }
        );
        return response.data;
    } catch(error) {
        console.error(error);
    }
};