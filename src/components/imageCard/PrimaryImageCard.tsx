import React, {useState} from "react";
import {message, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import type { UploadFile } from "antd/es/upload/interface";
import {uploadEquipmentImage} from "../../api/image/UploadEquipmentImage.ts";
import {validateFileTypeAndSize} from "./util.ts";

export interface UploadedImage {
    fileID: string;
    thumbnail?: string;
    is_primary?: boolean;
}

interface PrimaryImageCardProps {
    value?: UploadedImage | null;
    onChange?: (file: UploadedImage | null) => void;
}

const PrimaryImageCard: React.FC<PrimaryImageCardProps> = ({
                                                               value = null,
                                                               onChange,
                                                           }) => {
    const [fileList, setFileList] = useState<UploadFile[]>(
        value
            ? [
                {
                    uid: value.fileID,
                    name: value.fileID,
                    status: "done",
                    url: value.thumbnail || "",
                },
            ]
            : []
    );

    const handleChange = ({fileList: newFileList}: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
        const uploadedFile =
            newFileList[0] && newFileList[0].response
                ? {
                    fileID: newFileList[0].response.fileID,
                    thumbnail: newFileList[0].response.thumbnail || newFileList[0].url,
                    is_primary: true,
                }
                : null;
        if (onChange) {
            onChange(uploadedFile);
        }
    };

    const customRequest = (options: UploadRequestOption) => {
        const {file, onSuccess, onError} = options;

        uploadEquipmentImage(file as File)
            .then((response) => {
                onSuccess?.(response, file);
                message.success("Image uploaded successfully!");
            })
            .catch((error) => {
                console.error(error);
                onError?.(error);
                message.error(error.message || "Upload failed.");
            });
    };


    const uploadButton = (
        <div
            style={{
                width: 150,
                height: 150,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <PlusOutlined style={{fontSize: 24}}/>
            <div style={{marginTop: 8}}>Upload Primary</div>
        </div>
    );

    return (
        <Upload
            customRequest={customRequest}
            listType="picture-card"
            fileList={fileList}
            maxCount={1}
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
            {fileList.length >= 1 ? null : uploadButton}
        </Upload>
    );
};

export default PrimaryImageCard;