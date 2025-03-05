import API from "../index";

export const getEquipmentsInCart = async () => {
    try {
        const response = await API.get("/api/cart/items");
        return response.data;
    } catch(err) {
        console.error(err);
    }
}