import React, { useState, useEffect, useRef } from "react";
import { Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, RcCustomRequestOptions } from "antd/es/upload/interface";
import { UploadEquipmentImage } from "../../api/image/UploadEquipmentImage.ts";

/** The shape of each image in the final data. */
export interface GalleryUploadedImage {
    id: string;
    url?: string;
    is_primary?: boolean; // Typically false for gallery
}

interface GalleryImageCardProps {
    /**
     * The old images from parent, e.g. [
     *   { id:'abc', url:'...', is_primary:false },
     *   { id:'def', url:'...' },
     * ]
     */
    value?: GalleryUploadedImage[];
    /**
     * If you want to emit final array plus which IDs are newly added or deleted,
     * define a payload object with these fields.
     */
    onChange?: (result: {
        final: GalleryUploadedImage[];
        deletedIDs: string[];
        addedIDs: string[];
    }) => void;
}

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({ value = [], onChange }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    // Keep track of old file IDs for detecting removals
    const oldFileIDsRef = useRef<string[]>([]);

    useEffect(() => {
        // When “value” changes from outside, map them to UploadFile.
        if (value && value.length > 0) {
            const mapped = value.map((img) => ({
                uid: img.id,
                name: img.id,
                status: "done",
                url: img.url || "",
            }));
            setFileList(mapped);
            oldFileIDsRef.current = value.map((v) => v.id);
        } else {
            setFileList([]);
            oldFileIDsRef.current = [];
        }
    }, [value]);

    const handleChange = ({ fileList: newList }: { fileList: UploadFile[] }) => {
        setFileList(newList);

        // Build the final array from the newList
        // Only consider files whose status === "done" with a server response
        const finalImages: GalleryUploadedImage[] = newList
            .filter((file) => file.status === "done" && file.response)
            .map((file) => ({
                id: file.response.id,
                url: file.response.url,
                is_primary: false,
            }));

        // Compare old IDs vs new IDs
        const oldIDs = oldFileIDsRef.current;
        const newIDs = finalImages.map((img) => img.id);
        const deletedIDs = oldIDs.filter((oid) => !newIDs.includes(oid));
        const addedIDs = newIDs.filter((nid) => !oldIDs.includes(nid));

        onChange?.({ final: finalImages, deletedIDs, addedIDs });
    };

    const customRequest = async (options: RcCustomRequestOptions) => {
        const { file, onSuccess, onError } = options;
        try {
            // Upload to your server
            const response = await UploadEquipmentImage(file as File);
            // e.g. response might be { id:'some-uuid', url:'https://...' }
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

    return (
        <Upload
            multiple
            customRequest={customRequest}
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            // If you want file size/type checks, use a “beforeUpload” function
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
