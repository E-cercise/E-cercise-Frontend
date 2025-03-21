import React, { useState, useEffect } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, RcCustomRequestOptions } from "antd/es/upload/interface";
import { UploadEquipmentImage } from "../../api/image/UploadEquipmentImage.ts";

export interface UploadedImage {
    id: string;
    is_primary?: boolean;
    url?: string;
}

interface PrimaryImageCardProps {
    /** The old or existing value, e.g. { id:'abc', is_primary:true, url:'...' } */
    value?: UploadedImage | null;
    /** Called when user uploads or removes a file */
    onChange?: (file: UploadedImage | null) => void;
}

const PrimaryImageCard: React.FC<PrimaryImageCardProps> = ({ value = null, onChange }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    /** Sync with “value” from outside (the form’s field) */
    useEffect(() => {
        if (value) {
            setFileList([
                {
                    uid: value.id,
                    name: value.id,
                    status: "done",
                    url: value.url || "", // if you want to preview the image
                },
            ]);
        } else {
            setFileList([]);
        }
    }, [value]);

    /** Called whenever user’s fileList changes (upload, remove, etc.) */
    const handleChange = ({ fileList: newList }: { fileList: UploadFile[] }) => {
        setFileList(newList);

        // If there’s exactly one newly uploaded file with a response, build a new UploadedImage
        const first = newList[0];
        if (first && first.status === "done" && first.response) {
            // Suppose API returns { id:'...', url:'...' } upon successful upload
            const uploaded = {
                id: first.response.id,
                url: first.response.url,
                is_primary: true,
            };
            onChange?.(uploaded);
        } else if (newList.length === 0) {
            // If user removed the image, we send null
            onChange?.(null);
        }
    };

    /** Handle how we manually upload the file to server */
    const customRequest = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            // Your custom API call to upload
            const response = await UploadEquipmentImage(file as File);
            // Suppose response is { id:'...', url:'...' }
            if (onSuccess) onSuccess(response, file);
            message.success("Primary image uploaded successfully!");
        } catch (error) {
            if (onError) onError(error);
            message.error("Primary image upload failed.");
        }
    };

    const uploadButton = (
        <div style={{ width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PlusOutlined style={{ fontSize: 24 }} />
            <div style={{ marginTop: 8 }}>Upload Primary</div>
        </div>
    );

    return (
        <Upload
            customRequest={customRequest}
            listType="picture-card"
            fileList={fileList}
            maxCount={1}
            onChange={handleChange}
            // For previewing
            onPreview={async (file) => {
                let src = file.url as string;
                if (!src && file.originFileObj) {
                    // Convert local file to base64 for preview in new tab
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
