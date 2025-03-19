import axios from "axios";

const API = axios.create({
    baseURL: `${process.env.API_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use(
    (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
}, (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
}
);

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized! Redirecting to login...');
            localStorage.removeItem('token'); // delete token
            window.location.href = '/';
        }
        const errorMessage = error.response?.data?.message || error.message || 'An unknown error occurred';
        console.error('API error:', errorMessage);
        return Promise.reject(new Error(errorMessage));
    }
);

export default API;