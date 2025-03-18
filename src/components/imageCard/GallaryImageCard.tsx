import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, RcCustomRequestOptions } from "antd/es/upload/interface";
import { UploadEquipmentImage } from "../../api/image/UploadEquipmentImage.ts";
import { UploadedImage } from "./PrimaryImageCard";
import {validateFileTypeAndSize} from "./util.ts";

interface GalleryImageCardProps {
    value?: UploadedImage[];
    onChange?: (files: UploadedImage[]) => void;
}

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({
                                                               value = [],
                                                               onChange,
                                                           }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
        const uploadedFiles: UploadedImage[] = newFileList
            .filter((file) => file.response)
            .map((file) => ({
                fileID: file.response.fileID,
                is_primary: false,
            }));
        if (onChange) {
            onChange(uploadedFiles);
        }
    };

    const customRequest = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            const response = await UploadEquipmentImage(file as File);
            if (onSuccess) onSuccess(response, file);
            message.success("Gallery image uploaded successfully!");
        } catch (error) {
            if (onError) onError(error);
            message.error("Gallery image upload failed.");
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    // useEffect(() => {
    //     if (value && value.length > 0) {
    //         const mappedFiles: UploadFile[] = value.map((item) => ({
    //             uid: item.fileID,
    //             name: item.fileID,
    //             status: "done",
    //             url: item.thumbnail || "",
    //         }));
    //         setFileList(mappedFiles);
    //     }
    // }, [value]);

    return (
        <Upload
            multiple
            customRequest={customRequest}
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={validateFileTypeAndSize}
            onPreview={async (file) => {
                let src = file.url as string;
                if (!src && file.originFileObj) {
                    src = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file.originFileObj as File);
                        reader.onload = () => resolve(reader.result as string);
                    });
                }
                window.open(src);
            }}
        >
            {fileList.length >= 8 ? null : uploadButton}
        </Upload>
    );
};

export default GalleryImageCard;
