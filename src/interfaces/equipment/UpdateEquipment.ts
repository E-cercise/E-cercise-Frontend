export interface UpdateEquipmentRequest {
    additionalField?: AdditionalField;
    brand?: string;
    color?: string;
    feature?: Feature;
    material?: string;
    model?: string;
    muscleGroupUsed?: string[];
    name?: string;
    option?: Option;

    [property: string]: any;
}

export interface AdditionalField {
    created?: AdditionalFieldCreated[];
    deleted?: string[];
    updated?: AdditionalFieldUpdated[];

    [property: string]: any;
}

export interface AdditionalFieldCreated {
    key?: string;
    value?: string;

    [property: string]: any;
}

export interface AdditionalFieldUpdated {
    id?: string;
    key?: string;
    value?: string;

    [property: string]: any;
}

export interface Feature {
    created: string[];
    deleted: string[];
    updated: FeatureUpdated[];

    [property: string]: any;
}

export interface FeatureUpdated {
    description: string;
    id: string;

    [property: string]: any;
}

export interface Option {
    created: OptionCreated[];
    /**
     * backend: refer image and deleted it too!
     */
    deleted: string[];
    updated: OptionUpdated[];

    [property: string]: any;
}

export interface OptionCreated {
    available?: number;
    images: Image[];
    name: string;
    price?: number;
    weight?: number;

    [property: string]: any;
}

export interface Image {
    id: string;
    isPrimary: string;

    [property: string]: any;
}

export interface OptionUpdated {
    available?: number;
    id?: string;
    images: ImagePut;
    name: string;
    price?: number;
    weight?: number;

    [property: string]: any;
}

export interface ImagePut {
    deletedid: Deletedid[];
    uploadid: Uploadid[];

    [property: string]: any;
}

export interface Deletedid {
    id?: string;
    isPrimary?: boolean;
    url?: string;

    [property: string]: any;
}

export interface Uploadid {
    id?: string;
    isPrimary?: boolean;

    [property: string]: any;
}
