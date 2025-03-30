import React, {useEffect, useState} from "react";
import {message, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import type { UploadFile } from "antd/es/upload/interface";
import {uploadEquipmentImage} from "../../api/image/UploadEquipmentImage";
import {UploadedImage} from "./PrimaryImageCard";
import {validateFileTypeAndSize} from "./util";

interface GalleryImageCardProps {
    value?: UploadedImage[];
    onChange?: (files: UploadedImage[]) => void;
    onDelete?: (deleted: UploadedImage[]) => void;
}

const GalleryImageCard: React.FC<GalleryImageCardProps> = ({
                                                               value = [],
                                                               onChange,
                                                               onDelete,
                                                           }) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [initialImages] = useState<UploadedImage[]>(value);

    useEffect(() => {
        if (value && value.length > 0) {
            const mappedFiles: UploadFile[] = value.map((item) => ({
                uid: item.fileID,
                name: item.fileID,
                status: "done",
                url: item.thumbnail,
            }));
            setFileList(mappedFiles);
        }
    }, []);

    const handleChange = ({fileList: newFileList}: { fileList: UploadFile[] }) => {
        const mapped = newFileList.map((file) => {
            if (file.response && file.response.url) {
                file.url = file.response.url;
                file.status = "done";
            }
            return file;
        });

        setFileList(mapped);

        const currentFiles = mapped
            .filter((file) => file.response || file.url)
            .map((file) => ({
                fileID: file.response?.fileID || file.uid,
                thumbnail: file.response?.url || file.url,
                is_primary: false,
            }));

        onChange?.(currentFiles);

        const deleted = initialImages.filter(
            (init) => !currentFiles.find((curr) => curr.fileID === init.fileID)
        );
        if (deleted.length > 0) {
            onDelete?.(deleted);
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


    return (
        <Upload
            multiple
            customRequest={customRequest}
            listType="picture-card"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={validateFileTypeAndSize}
        >
            {fileList.length >= 8 ? null : (
                <div>
                    <PlusOutlined/>
                    <div style={{marginTop: 8}}>Upload</div>
                </div>
            )}
        </Upload>
    );
};

export default GalleryImageCard;
