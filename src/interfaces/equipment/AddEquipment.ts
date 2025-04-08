interface AdditionalFieldAdd {
    key: string;
    value: string;
}

export interface OptionAdd {
    available: number;
    images?: ImageAdd[];
    name: string;
    price: number;
    weight: number;
}

interface ImageAdd {
    id: string;
    isPrimary: boolean;
}

export interface AddEquipmentRequest {
    additionalFields?: AdditionalFieldAdd[];
    brand: string;
    category: string;
    color: string;
    description: string;
    features: string[];
    material: string;
    model: string;
    muscleGroupUsed: string[];
    name: string;
    options: OptionAdd[];
}

