import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { message, Select } from "antd";
import NavBar from "../../components/navbar/NavBar.tsx";
import { equipmentInCategory } from "../../api/equipment/EquipmentsInCategory.ts";
import { allEquipmentsDetail } from "../../api/equipment/AllEquipmentsDetail.ts";
import { EquipmentDetailResponse } from "../../interfaces/equipment/EquipmentDetail.ts";
import { getEquipmentCategory } from "../../api/equipment/EquipmentCategory.ts";

function Comparison() {
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [category, setCategory] = useState<string>("dumbbell");
  const [equipments, setEquipments] = useState<{ label: string; value: string }[]>([]);
  const [selectedIDs, setSelectedIDs] = useState<string[]>(["", "", ""]);
  const [equipmentDetails, setEquipmentDetails] = useState<EquipmentDetailResponse[]>([]);

  const fetchEquipmentCategories = async () => {
    try {
      const data = await getEquipmentCategory();

      setCategories(data.categories);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setEquipments([]);
    setSelectedIDs(["", "", ""]);
    setEquipmentDetails([]);
  };

  // fetch equipment in category
  const fetchEquipmentInCategory = async (cat: string) => {
    try {
      const response = await equipmentInCategory(cat);
      const formattedEquipments = response.equipments?.map((e: any) => ({
        label: e.name,
        value: e.ID,
      })) || [];

      setEquipments(formattedEquipments);

      // If we want to auto-select the first 3:
      if (formattedEquipments.length >= 3) {
        setSelectedIDs([
          formattedEquipments[0].value,
          formattedEquipments[1].value,
          formattedEquipments[2].value,
        ]);
      }
    } catch (err) {
      console.error("Error fetching equipments:", err);
      message.error("Failed to load equipment list.");
    }
  };

  // fetch equipment details
  const fetchAllEquipmentsDetail = async (equipmentIDs: string) => {
    try {
      const response = await allEquipmentsDetail(equipmentIDs);
      setEquipmentDetails(response.equipments);
    } catch (err) {
      console.error("Error fetching equipment details:", err);
    }
  };

  // swap logic for selectedIDs
  const handleSelectChange = (index: number, newValue: string) => {
    const updated = [...selectedIDs];
    if (updated.includes(newValue)) {
      const existingIndex = updated.indexOf(newValue);
      [updated[existingIndex], updated[index]] = [updated[index], updated[existingIndex]];
    } else {
      updated[index] = newValue;
    }
    setSelectedIDs(updated);
  };

  // effect hooks
  useEffect(() => {
    fetchEquipmentCategories();
  }, []);

  useEffect(() => {
    // each time category changes, fetch new items
    fetchEquipmentInCategory(category);
  }, [category]);

  useEffect(() => {
    // if all 3 selectedIDs are non-empty, fetch their details
    if (selectedIDs.every((id) => id)) {
      fetchAllEquipmentsDetail(selectedIDs.join(","));
    }
  }, [selectedIDs]);

  // build table rows
  const allAdditionalKeys = Array.from(
      new Set(equipmentDetails.flatMap((eq) => eq.additional_fields.map((f) => f.key)))
  );

  const getPrice = (eq: EquipmentDetailResponse) => {
    const p = eq.options[0]?.price;
    return p ? `฿${p.toFixed(2)}` : "N/A";
  };
  const getWeight = (eq: EquipmentDetailResponse) => {
    const w = eq.options[0]?.weight;
    return w ? `${w} kg` : "N/A";
  };

  const rows = [
    {
      label: "Image",
      values: equipmentDetails.map((eq: any) => (
          <img
              key={eq.ID}
              src={eq.options[0]?.images[0]?.url || "placeholder.png"}
              alt={eq.name}
              className="w-32 h-32 object-contain mx-auto"
          />
      )),
    },
    {
      label: "Name",
      values: equipmentDetails.map((eq) => eq.name),
    },
    {
      label: "Brand",
      values: equipmentDetails.map((eq) => eq.brand || "N/A"),
    },
    {
      label: "Model",
      values: equipmentDetails.map((eq) => eq.model || "N/A"),
    },
    {
      label: "Material",
      values: equipmentDetails.map((eq) => eq.material || "N/A"),
    },
    {
      label: "Option",
      values: equipmentDetails.map((eq) => eq.options[0]?.name || "N/A"),
    },
    {
      label: "Price",
      values: equipmentDetails.map((eq) => getPrice(eq)),
    },
    {
      label: "Weight",
      values: equipmentDetails.map((eq) => getWeight(eq)),
    },
    // Additional fields
    ...allAdditionalKeys.map((key) => ({
      label: key,
      values: equipmentDetails.map(
          (eq) => eq.additional_fields.find((f) => f.key === key)?.value || "N/A"
      ),
    })),
  ];

  return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="max-w-7xl mx-auto p-4">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-1">Compare Equipment</h1>
            <p className="text-gray-600">
              Select a category and up to three items to compare features
            </p>
          </div>

          {/* Category & Link */}
          <div className="flex items-center justify-between bg-white p-4 rounded shadow mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Category:</span>
              <Select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-[220px]"
                  // Pass categories directly if they are already in { label, value } form
                  options={categories}
              />
            </div>
            <Link
                to="/"
                className="text-blue-600 hover:underline transition-colors duration-300"
            >
              &larr; Shop Equipment
            </Link>
          </div>

          {/* Equipment Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className="bg-white p-4 rounded shadow flex flex-col items-center"
                >
                  <Select
                      value={selectedIDs[index]}
                      onChange={(value) => handleSelectChange(index, value)}
                      className="w-full mb-3"
                      placeholder={`Select Equipment ${index + 1}`}
                      // This is an array of { label, value } for each piece of equipment
                      options={equipments}
                  />
                  {equipmentDetails[index] && (
                      <Link to={`/equipment/${selectedIDs[index]}`}>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300">
                          See More Details
                        </button>
                      </Link>
                  )}
                </div>
            ))}
          </div>

          {/* Comparison Table */}
          {equipmentDetails.length === 3 && (
              <div className="bg-white rounded shadow p-4 overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <tbody>
                  {rows.map((row, rowIndex) => (
                      <tr
                          key={row.label}
                          className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="p-3 text-gray-600 text-left">{row.label}</td>
                        {row.values.map((val, idx) => (
                            <td key={idx} className="p-3 text-center text-gray-800">
                              {val}
                            </td>
                        ))}
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
  );
}

export default Comparison;
