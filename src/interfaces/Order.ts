export interface LineEquipment {
    line_equipment_id: string;
    equipment_name: string;
    per_unit_price: number;
    img_url: string;
    quantity: number;
    total: number;
}

export interface PlaceOrder {
    line_equipment: LineEquipment[];
    payment_type: string;
    address: string;
}