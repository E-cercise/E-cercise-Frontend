import API from '../index'

export const UploadEquipmentImage = async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("img", file);

    try {
        const response = await API.post("/image/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};