import PrimaryImageCard, { UploadedImage as PrimaryImg } from "../../components/imageCard/PrimaryImageCard";
import GalleryImageCard, { GalleryUploadedImage as GalleryImg } from "../../components/imageCard/GallaryImageCard";

export interface OptionFormValue {
    id?: string; // might exist if editing
    name: string;
    price: number;
    weight: number;
    available: number;
    primaryImage: PrimaryImg | null;
    galleryImages?: {
        final: GalleryImg[];
        deletedIDs: string[];
        addedIDs: string[];
    } | GalleryImg[]; // or any shape you prefer
}

export interface EquipmentFormValues {
    name: string;
    brand: string;
    model: string;
    color: string;
    material: string;
    category?: string;
    description?: string; // e.g. special_feature
    muscle_group_used: string[];
    options: OptionFormValue[];
    features: string[]; // or array of objects
    additional_fields: Array<{
        id?: string;
        key: string;
        value: string;
    }>;
}

export type EquipmentFormMode = "create" | "update" | "view";

export interface EquipmentFormProps {
    mode: EquipmentFormMode;
    initialValues?: Partial<EquipmentFormValues>;
    isSubmitting?: boolean;
    loadingCategories?: boolean;
    categories?: { label: string; value: string }[];
    onSubmit: (values: EquipmentFormValues) => void;
}