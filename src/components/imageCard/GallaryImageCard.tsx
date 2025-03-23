import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, RcCustomRequestOptions } from "antd/es/upload/interface";
import { UploadEquipmentImage } from "../../api/image/UploadEquipmentImage";
import { UploadedImage } from "./PrimaryImageCard";
import { validateFileTypeAndSize } from "./util";

interface GalleryImageCardProps {
    value?: UploadedImage[];
    onChange?: (files: UploadedImage[]) => void;
}

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({
                                                               value = [],
                                                               onChange,
                                                           }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        console.log(value)
        if (value && value.length > 0) {
            const mappedFiles: UploadFile[] = value.map((item) => ({
                uid: item.fileID,
                name: item.fileID,
                status: "done",
                url: item.thumbnail ,
            }));
            setFileList(mappedFiles);
        } else {
            setFileList([]);
        }
    }, []);

    const handleChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        const mappedFileList = newFileList.map((file) => {
            if (file.response && file.response.url) {
                file.url = file.response.url;
                file.status = 'done';
            }
            return file;
        });

        setFileList(mappedFileList);
        const uploadedFiles: UploadedImage[] = mappedFileList
            .filter((file) => file.response)
            .map((file) => ({
                fileID: file.response.fileId,
                thumbnail: file.response.url,
                is_primary: false,
            }));
        onChange?.(uploadedFiles);
    };

    const customRequest = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            const response = await UploadEquipmentImage(file as File);
            onSuccess?.(response, file);
            message.success("Gallery image uploaded successfully!");
        } catch (error) {
            onError?.(error);
            message.error("Gallery image upload failed.");
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
