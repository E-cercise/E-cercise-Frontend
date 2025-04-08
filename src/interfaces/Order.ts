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

interface Address {
    full_name: string;
    phone_number: string;
    address_line: string;
}

export interface OrderDetailResponse {
    id: string;
    order_status: string;
    address: Address;
    orders: LineEquipment[];
    net_price: number;
}

export interface FirstLineEquipment {
    img_url: string;
    name: string;
}

export interface Order {
    created_at: string;
    first_line_equipment: FirstLineEquipment;
    id: string
    order_status: string;
    payment_type: string
    total_price: string;
    updated_at: string;
    user_id: string
}