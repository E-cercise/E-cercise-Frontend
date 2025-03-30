import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Divider, message, Select } from "antd";
import NavBar from "../../components/navbar/NavBar.tsx";
import Dumbbells1 from "../../assets/test/comparison/image 16.png";
import Dumbbells2 from "../../assets/test/comparison/image 17.png";
import Dumbbells3 from "../../assets/test/comparison/image 18.png";
import { getEquipmentCategories } from "../../api/equipment/EquipmentCategory.ts";
import { equipmentInCategory } from "../../api/equipment/EquipmentsInCategory.ts";
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

  const fetchEquipmentCategories = async () => {
    getEquipmentCategories()
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
      setEquipment1(response.equipments[0]);
      setEquipment2(response.equipments[1]);
      setEquipment3(response.equipments[2]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEquipmentCategories();
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
        <Link to="/">
          <p className="text-[#0B8AE5]">Shop Equipments {">"}</p>
        </Link>
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
            <Link to={`/equipment/${selectedID1}`}>
              <button className="bg-[#0B8AE5] text-[15px] text-white w-[140px] px-2 py-[2px] rounded-xl">
                See more details
              </button>
            </Link>
            <div className="w-[260px] text-center text-sm">
              <p className="font-bold">{equipment1?.name}</p>
              <p><strong>Brand:</strong> {equipment1?.brand}</p>
              <p><strong>Weight:</strong> {equipment1?.model}</p>
              <p><strong>Material:</strong> {equipment1?.material}</p>
              <p><strong>Option:</strong> {equipment1?.option[0]?.name}</p>
              <p><strong>Price:</strong> ฿{equipment1?.option[0]?.price?.toFixed(2)}</p>
              <p><strong>Weight:</strong> {equipment1?.option[0]?.weight} kg</p>
              <Divider style={{ borderColor: "#8C8C8C" }} />
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
            <Link to={`/equipment/${selectedID2}`}>
              <button className="bg-[#0B8AE5] text-[15px] text-white w-[140px] px-2 py-[2px] rounded-xl">
                See more details
              </button>
            </Link>
            <div className="w-[260px] text-center text-sm">
              <p className="font-bold">{equipment2?.name}</p>
              <p><strong>Brand:</strong> {equipment2?.brand}</p>
              <p><strong>Model:</strong> {equipment2?.model}</p>
              <p><strong>Material:</strong> {equipment2?.material}</p>
              <p><strong>Option:</strong> {equipment2?.option[0]?.name}</p>
              <p><strong>Price:</strong> ฿{equipment2?.option[0]?.price?.toFixed(2)}</p>
              <p><strong>Weight:</strong> {equipment2?.option[0]?.weight} kg</p>
              <Divider style={{ borderColor: "#8C8C8C" }} />
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
            <Link to={`/equipment/${selectedID3}`}>
              <button className="bg-[#0B8AE5] text-[15px] text-white w-[140px] px-2 py-[2px] rounded-xl">
                See more details
              </button>
            </Link>
            <div className="w-[260px] text-center text-sm">
              <p className="font-bold">{equipment3?.name}</p>
              <p><strong>Brand:</strong> {equipment3?.brand}</p>
              <p><strong>Model:</strong> {equipment3?.model}</p>
              <p><strong>Material:</strong> {equipment3?.material}</p>
              <p><strong>Option:</strong> {equipment3?.option[0]?.name}</p>
              <p><strong>Price:</strong> ฿{equipment3?.option[0]?.price?.toFixed(2)}</p>
              <p><strong>Weight:</strong> {equipment3?.option[0]?.weight} kg</p>
              <Divider style={{ borderColor: "#8C8C8C" }} />
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
