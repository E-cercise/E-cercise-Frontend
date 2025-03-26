import API from '../index'

export interface UploadImageResponse {
    fileID: string;
    url: string;
    thumbnail?: string;
}

export const uploadEquipmentImage = async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("img", file);

    try {
        const response = await API.post<UploadImageResponse>("/image/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error: any) {
        throw new Error(
            error?.response?.data?.message || error.message || "Image upload failed"
        );
    }
};
