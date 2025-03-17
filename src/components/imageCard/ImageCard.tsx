import React, { useState } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {RcCustomRequestOptions, UploadFile} from "antd/es/upload/interface";
import {UploadEquipmentImage} from "../../api/image/UploadEquipmentImage.ts";

interface UploadPictureCardFieldProps {
    value?: string[];
    onChange?: (fileIDs: string[]) => void;
}

const UploadPictureCard: React.FC<UploadPictureCardFieldProps> = ({
                                                                           value = [],
                                                                           onChange,
                                                                       }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
        // When a file upload succeeds, the file item will have a response with the fileID.
        const fileIDs = newFileList
            .filter(file => file.response) // only include successfully uploaded files
            .map(file => file.response.fileID); // adjust if your API returns a different key

        if (onChange) {
            onChange(fileIDs);
        }
    };

    const customRequest = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            // Call your custom API upload function
            const response = await UploadEquipmentImage(file as File);
            if (onSuccess) onSuccess(response, file);
            message.success("Image uploaded successfully!");
        } catch (error) {
            if (onError) onError(error);
            message.error("Image upload failed.");
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Upload
            customRequest={customRequest}
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            onPreview={async (file) => {
                let src = file.url as string;
                if (!src && file.originFileObj) {
                    src = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file.originFileObj as File);
                        reader.onload = () => resolve(reader.result as string);
                    });
                }
                const image = new Image();
                image.src = src;
                const imgWindow = window.open(src);
                if (imgWindow) {
                    imgWindow.document.write(image.outerHTML);
                }
            }}
        >
            {fileList.length >= 8 ? null : uploadButton}
        </Upload>
    );
};

export default UploadPictureCard;
