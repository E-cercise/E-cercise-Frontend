import {CategoryResponse} from "./EquipmentDetail.ts";

export interface EquipmentFormProps {
    mode: "ADD" | "EDIT";
    isEditing: boolean;
    loadingCategories: boolean;
    categories: CategoryResponse[];
    initialValues?: any; // The shape for form initial values
    onSubmit: (formValues: any) => Promise<void>;
    onCategorySearch: (val: string) => void;
    onAddNewCategory: () => void;
    searchCategory: string;
}

export interface EquipmentFormValues {
    name: string;
    brand: string;
    model: string;
    color: string;
    material: string;
    category: string;
    description: string;
    muscle_group_used: string[];
    features: {
        __id?: string;
        description: string;
    }[];
    additional_fields: {
        __id?: string;
        key: string;
        value: string;
    }[];
    options: {
        __id?: string;
        name: string;
        price: number;
        weight: number;
        available: number;
        primaryImage?: {
            fileID: string;
            thumbnail?: string;
            is_primary?: boolean;
        };
        galleryImages?: {
            fileID: string;
            thumbnail?: string;
            is_primary?: boolean;
        }[];
    }[];
}
