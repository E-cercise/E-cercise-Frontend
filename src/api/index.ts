import axios from "axios";

const API = axios.create({
    baseURL: process.env.API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

export default API;