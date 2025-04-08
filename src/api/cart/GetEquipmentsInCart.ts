import API from "../index";

export const getEquipmentsInCart = async () => {
    const response = await API.get("/cart/items");
    return response.data;
}