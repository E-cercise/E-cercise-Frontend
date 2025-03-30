import { useEffect, useState } from "react";
import { Divider, message, Select } from "antd";
import NavBar from "../../components/navbar/NavBar.tsx";
import Dumbbells1 from "../../assets/test/comparison/image 16.png";
import Dumbbells2 from "../../assets/test/comparison/image 17.png";
import Dumbbells3 from "../../assets/test/comparison/image 18.png";
import { equipmentInCategory } from "../../api/equipment/EquipmentsInCategory.ts";
import { getEquipmentCategory } from "../../api/equipment/EquipmentCategory.ts";
import { allEquipmentsDetail } from "../../api/equipment/AllEquipmentsDetail.ts";
import { EquipmentDetailResponse } from "../../interfaces/equipment/EquipmentDetail.ts";

interface Equipment {
  ID: string;
  image_path: string;
  muscle_group_used: string[];
  name: string;
  price: number;
}

function Comparison() {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState<string>("dumbbell");
  const [equipments, setEquipments] = useState<{ label: string; value: string; }[]>([]);
  const [selectedID1, setSelectedID1] = useState<string>("");
  const [selectedID2, setSelectedID2] = useState<string>("");
  const [selectedID3, setSelectedID3] = useState<string>("");
  const [equipment1, setEquipment1] = useState<EquipmentDetailResponse>();
  const [equipment2, setEquipment2] = useState<EquipmentDetailResponse>();
  const [equipment3, setEquipment3] = useState<EquipmentDetailResponse>();

  // console.log(categories);
  // console.log(selectedID1);
  // console.log(selectedID2);
  // console.log(selectedID3);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleSelectChange = (slot: number, newValue: string) => {
    if (slot === 1) {
        if (newValue === selectedID2) {
            setSelectedID1(selectedID2);
            setSelectedID2(selectedID1);
        } else if (newValue === selectedID3) {
            setSelectedID1(selectedID3);
            setSelectedID3(selectedID1);
        } else {
            setSelectedID1(newValue);
        }
    } else if (slot === 2) {
        if (newValue === selectedID1) {
            setSelectedID2(selectedID1);
            setSelectedID1(selectedID2);
        } else if (newValue === selectedID3) {
            setSelectedID2(selectedID3);
            setSelectedID3(selectedID2);
        } else {
            setSelectedID2(newValue);
        }
    } else if (slot === 3) {
        if (newValue === selectedID1) {
            setSelectedID3(selectedID1);
            setSelectedID1(selectedID3);
        } else if (newValue === selectedID2) {
            setSelectedID3(selectedID2);
            setSelectedID2(selectedID3);
        } else {
            setSelectedID3(newValue);
        }
    }
};

  const fetchEquipmentCategory = async () => {
    getEquipmentCategory()
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchEquipmentInCategory = async (category: string) => {
    try {
      const response = await equipmentInCategory(category);
      const formattedEquipments = response.equipments?.map(
        (equipment: Equipment) => ({
          label: equipment.name,
          value: equipment.ID,
        })
      );
      console.log(formattedEquipments)
      setEquipments(formattedEquipments);
      if (formattedEquipments && formattedEquipments.length >= 3) {
        setSelectedID1(formattedEquipments[0].value);
        setSelectedID2(formattedEquipments[1].value);
        setSelectedID3(formattedEquipments[2].value);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to load equipment list.");
    }
  };

  const fetchAllEquipmentsDetail = async (equipmentIDs: string) => {
    try {
      const response = await allEquipmentsDetail(equipmentIDs);
      console.log(response);
      setEquipment1(response.equipments[0]);
      setEquipment2(response.equipments[1]);
      setEquipment3(response.equipments[2]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEquipmentCategory();
    if (equipments.length === 0) {
      fetchEquipmentInCategory(category);
    }
    if (selectedID1 && selectedID2 && selectedID3) {
      const idString = `${selectedID1},${selectedID2},${selectedID3}`;
      fetchAllEquipmentsDetail(idString);
    }
  }, [category, selectedID1, selectedID2, selectedID3]);

  return (
    <div>
      <NavBar />
      <div className="flex flex-col items-center space-y-5">
        <p className="text-[22px] font-bold pt-5">Compare Equipments</p>
        <Select
          defaultValue="dumbbell"
          onChange={(value: any) => {
            handleCategoryChange(value);
            setEquipments([]);
          }}
          className="w-[220px] h-[48px]"
          options={categories}
        />
        <p className="text-[#0B8AE5]">Shop Equipments {">"}</p>
        <div className="flex justify-center space-x-[80px] pb-8">
          <div className="flex flex-col items-center space-y-5">
            <Select
              value={selectedID1}
              className="w-[220px] h-[48px]"
              options={equipments}
              onChange={(value) => handleSelectChange(1, value)}
            />
            <div className="flex flex-col justify-center h-[200px]">
              <img
                src={equipment1?.option[0].images[0].url}
                alt=""
                className="w-[200px]"
              />
            </div>
            <Divider style={{ borderColor: "#8C8C8C" }} />
            <button className="bg-[#0B8AE5] text-[15px] text-white w-[50px] rounded-xl">
              Buy
            </button>
            {/* <div className="text-[14px]">Show equipment's details</div> */}
            <div className="w-[260px] text-center text-sm">
              <p className="font-bold">{equipment1?.name}</p>
              <p>Brand: {equipment1?.brand}</p>
              <p>Model: {equipment1?.model}</p>
              <p>Material: {equipment1?.material}</p>
              <p className="mt-2 font-semibold">{equipment1?.option[0]?.name}</p>
              <p>Price: ฿{equipment1?.option[0]?.price?.toFixed(2)}</p>
              <p>Weight: {equipment1?.option[0]?.weight} kg</p>

              <div className="mt-2 text-xs space-y-2">
                {equipment1?.additional_field?.map((field) => (
                  <div key={field.id}>
                    <strong>{field.key}:</strong> {field.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-5">
            <Select
              value={selectedID2}
              className="w-[220px] h-[48px]"
              options={equipments}
              onChange={(value) => handleSelectChange(2, value)}
            />
            <div className="flex flex-col justify-center h-[200px]">
              <img
                src={equipment2?.option[0].images[0].url}
                alt=""
                className="w-[200px]"
              />
            </div>
            <Divider style={{ borderColor: "#8C8C8C" }} />
            <button className="bg-[#0B8AE5] text-[15px] text-white w-[50px] rounded-xl">
              Buy
            </button>
            {/* <div className="text-[14px]">Show equipment's details</div> */}
            <div className="w-[260px] text-center text-sm">
              <p className="font-bold">{equipment2?.name}</p>
              <p>Brand: {equipment2?.brand}</p>
              <p>Model: {equipment2?.model}</p>
              <p>Material: {equipment2?.material}</p>
              <p className="mt-2 font-semibold">{equipment2?.option[0]?.name}</p>
              <p>Price: ฿{equipment2?.option[0]?.price?.toFixed(2)}</p>
              <p>Weight: {equipment2?.option[0]?.weight} kg</p>

              <div className="mt-2 text-xs space-y-2">
                {equipment2?.additional_field?.map((field) => (
                  <div key={field.id}>
                    <strong>{field.key}:</strong> {field.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-5">
            <Select
              value={selectedID3}
              className="w-[220px] h-[48px]"
              options={equipments}
              onChange={(value) => handleSelectChange(3, value)}
            />
            <div className="flex flex-col justify-center h-[200px]">
              <img
                src={equipment3?.option[0].images[0].url}
                alt=""
                className="w-[200px]"
              />
            </div>
            <Divider style={{ borderColor: "#8C8C8C" }} />
            <button className="bg-[#0B8AE5] text-[15px] text-white w-[50px] rounded-xl">
              Buy
            </button>
            {/* <div className="text-[14px]">Show equipment's details</div> */}
            <div className="w-[260px] text-center text-sm">
              <p className="font-bold">{equipment3?.name}</p>
              <p>Brand: {equipment3?.brand}</p>
              <p>Model: {equipment3?.model}</p>
              <p>Material: {equipment3?.material}</p>
              <p className="mt-2 font-semibold">{equipment3?.option[0]?.name}</p>
              <p>Price: ฿{equipment3?.option[0]?.price?.toFixed(2)}</p>
              <p>Weight: {equipment3?.option[0]?.weight} kg</p>

              <div className="mt-2 text-xs space-y-2">
                {equipment3?.additional_field?.map((field) => (
                  <div key={field.id}>
                    <strong>{field.key}:</strong> {field.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comparison;
