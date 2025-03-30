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
  const [equipments, setEquipments] = useState([]);
  const [selectedID1, setSelectedID1] = useState<string | null>(null);
  const [selectedID2, setSelectedID2] = useState<string | null>(null);
  const [selectedID3, setSelectedID3] = useState<string | null>(null);
  const [equipment1, setEquipment1] = useState<EquipmentDetailResponse>();
  const [equipment2, setEquipment2] = useState<EquipmentDetailResponse>();
  const [equipment3, setEquipment3] = useState<EquipmentDetailResponse>();

  // console.log(categories);
  console.log(selectedID1);

  const handleCategoryChange = (value: string) => {
    setCategory(value);
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
    fetchEquipmentInCategory(category);
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
          onChange={(value: any) => handleCategoryChange(value)}
          className="w-[220px] h-[48px]"
          options={categories}
        />
        <p className="text-[#0B8AE5]">Shop Equipments {">"}</p>
        <div className="flex justify-center space-x-[80px]">
          <div className="flex flex-col items-center space-y-5">
            <Select
              value={equipments[0]}
              className="w-[220px] h-[48px]"
              options={equipments}
              onChange={setSelectedID1}
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
            <div className="text-[14px]">Show equipment's details</div>
          </div>
          <div className="flex flex-col items-center space-y-5">
            <Select
              value={equipments[1]}
              className="w-[220px] h-[48px]"
              options={equipments}
              onChange={setSelectedID2}
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
            <div className="text-[14px]">Show equipment's details</div>
          </div>
          <div className="flex flex-col items-center space-y-5">
            <Select
              value={equipments[2]}
              className="w-[220px] h-[48px]"
              options={equipments}
              onChange={setSelectedID3}
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
            <div className="text-[14px]">Show equipment's details</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comparison;
