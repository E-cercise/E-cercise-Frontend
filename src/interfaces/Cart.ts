interface LineEquipment {
  line_equipment_id: string;
  equipment_name: string;
  per_unit_price: number;
  img_url: string;
  quantity: number;
  total: number;
}

export interface CartResponse {
  line_equipments: LineEquipment[];
  total_price: number;
}
