import API from "../index";

export const getEquipmentsInCart = async () => {
    try {
        const response = await API.get("/api/cart/items");
        return response.data;
    } catch(err: any) {
        // if (err.response?.status === 401) {
        //     navigate("/login"); // Redirect to login page
        // } else {
        console.error(err);
        // }
    }
}