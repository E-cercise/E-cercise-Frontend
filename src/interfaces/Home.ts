import React from "react";

export interface IEquipment {
    ID: string
    name: string
    image_path: string
    price: number
    remaining_product: number
}

export interface EquipmentCardProps {
    equipment: IEquipment
    index: number
    equipmentId: number
    titleHover: boolean
    setEquipmentId: React.Dispatch<React.SetStateAction<number>>
    setTitleHover: React.Dispatch<React.SetStateAction<boolean>>
    role: string | null
    onAddToCart: (equipmentId: string) => void;
    isAddingToCart?: boolean;
}

export interface HeaderRowProps {
    role: string | null
    title: string
}
