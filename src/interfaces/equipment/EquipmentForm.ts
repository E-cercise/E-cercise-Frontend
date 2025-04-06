import {Category} from "./EquipmentDetail.ts";
import {FormInstance} from "antd";

export interface EquipmentFormProps {
    mode: "ADD" | "EDIT";
    form: FormInstance<any>;
    isEditing: boolean;
    loadingCategories: boolean;
    categories: Category[];
    initialValues?: any;
    onSubmit: (formValues: any) => Promise<void>;
    onCategorySearch: (val: string) => void;
    onAddNewCategory: () => void;
    searchCategory: string;
    submitting?: boolean;
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
    features: EquipmentFeatureForm[];
    additional_fields: AdditionalFieldForm[];
    options: EquipmentOptionForm[];
}


export interface EquipmentFeatureForm {
    __id?: string;
    description: string;
}

export interface AdditionalFieldForm {
    __id?: string;
    key: string;
    value: string;
}

export interface EquipmentImage {
    fileID: string;
    thumbnail?: string;
    is_primary?: boolean;
}

export interface EquipmentOptionForm {
    __id?: string;
    name: string;
    price: number;
    weight: number;
    available: number;
    primaryImage?: EquipmentImage;
    galleryImages?: EquipmentImage[];
}
