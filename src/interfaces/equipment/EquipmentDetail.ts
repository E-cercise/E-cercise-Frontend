interface EquipmentDetail {
    ID: string;
    name: string;
    price: number;
    image_path: string;
    muscles_group_used: string[];
    remaining_product: number
}

export interface FilteredEquipmentResponse {
    equipments: { equipments: EquipmentDetail[] };
    page: number;
    limit: number;
    total_pages: number;
    total_rows: number;
}

interface Image {
    id: string;
    url: string;
    is_primary: boolean;
}

interface Option {
    id: string;
    name: string;
    available: string;
    price: number;
    weight: number;
    images: Image[];
}

interface Feature {
    id: string;
    description: string;
}

interface AdditionalField {
    id: string;
    key: string;
    value: string;
}

export interface EquipmentDetailResponse {
    brand: string;
    color: string;
    material: string;
    description: string;
    category: string;
    model: string;
    muscle_group_used: string[];
    name: string;
    option: Option[];
    feature: Feature[];
    additional_field: AdditionalField[];
}

export interface EquipmentDetailForComparison {
    id: string;
    brand: string;
    color: string;
    material: string;
    description: string;
    category: string;
    model: string;
    name: string;
    option: Option[];
    additional_field: AdditionalField[];
}

export interface Category {
    label: string;
    value: number;
}

export interface CategoryResponse {
    categories: Category[]
}

