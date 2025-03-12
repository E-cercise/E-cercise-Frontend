import React, { useEffect, useState } from "react";
import {Pagination, Spin, Tag} from "antd";
import { IoIosArrowDown } from "react-icons/io";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link} from "react-router-dom";
import { filteredEquipment } from "../../../api/equipment/FilteredEquipment";
import { equipmentDetail } from "../../../api/equipment/EquipmentDetail";
import NavBar from "../../../components/navbar/NavBar";
import { EquipmentDetailResponse, FilteredEquipmentResponse } from "../../../interfaces/Equipment";
import SearchIcon from "../../../assets/home/search.png"
import "./Home.css";

function AdminHome() {
  const [equipmentId, setEquipmentId] = useState<number>(-1);
  const [titleHover, setTitleHover] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [muscleGroup, setMuscleGroup] = useState<string>("");
  const [filteredEquipments, setfilteredEquipments] =
    useState<FilteredEquipmentResponse>();
  const [tempState, setTempState] = useState<boolean>(false);
  const pageSize = 50;

  const equipments = async (
    searchKeyword: string,
    muscleGroup: string,
    currentPage: number,
    pageSize: number,
  ) => {
    try {
      const getAllEquipments = await filteredEquipment(
        searchKeyword,
        muscleGroup,
        currentPage,
        pageSize,
      );
      setfilteredEquipments(getAllEquipments);
      setTempState(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    equipments(searchKeyword, muscleGroup, currentPage, pageSize);
  }, [searchKeyword, muscleGroup, currentPage, currentPage]);

  const cards = Array.isArray(filteredEquipments?.equipments.equipments)
    ? filteredEquipments.equipments.equipments.map((equipment, index) => (
        <div
          key={index}
          className="w-[200px] bg-[#F2EFEF] p-4 space-y-2 rounded-md"
        >
          <img
            src={equipment.image_path}
            alt=""
            className="w-full rounded-md"
          />
          <p
            className={`cursor-pointer  text-sm ${
              titleHover && equipmentId === index
                ? "text-[#DC8900]"
                : "text-[#000000]"
            }`}
            onMouseEnter={() => {
              setEquipmentId(index);
              setTitleHover(true);
            }}
            onMouseOut={() => {
              setEquipmentId(-1);
              setTitleHover(false);
            }}
          >
            <Link to={`/equipment/${equipment.ID}`}>{equipment.name}</Link>
          </p>
          <div className="flex items-center space-x-2">
            <div className="cursor-pointer flex items-center space-x-1">
              <div className="flex w-[100px] space-x-1">
                <FaStar color="#FFAA1D" />
                <FaStar color="#FFAA1D" />
                <FaStar color="#FFAA1D" />
                <FaStar color="#FFAA1D" />
                <FaStarHalfAlt color="#FFAA1D" />
              </div>
              <IoIosArrowDown />
            </div>
            <p className="text-xs text-[#31A421]">(1,046)</p>
          </div>
          <p>฿{equipment.price}</p>
          {/* {
            cart?.line_equipments.filter((lineEquipment) => lineEquipment.equipment_name.includes(equipment.name)) !== undefined ?
              <div className="text-[12px] font-bold">
                In cart
              </div>
            : */}
          <Tag className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md">
            <span className="mr-2 text-black">Remaining Products</span>
            <span className="font-bold text-black">{equipment.remaining_product}</span>
          </Tag>
        </div>
      ))
    : [];

  const paginatedCards = cards.slice(0, pageSize);

  return (
    <div>
      <NavBar
        setSearchKeyword={setSearchKeyword}
        setMuscleGroup={setMuscleGroup}
        setCurrentPage={setCurrentPage}
      />
      <div className="h-full pt-3 pb-3 pl-5 pr-5">
        {cards.length === 0 ? (
          tempState ? (
            <div className="flex flex-col items-center justify-center w-full h-[84.5vh] bg-[#D9D9D9] rounded-md space-y-2">
              <img src={SearchIcon} alt="Search icon" width={80} />
              <p className="text-lg font-semibold">
                No equipments match your search
              </p>
              <p className="text-md font-semibold">
                Nothing found for {"<<"}
                {searchKeyword}
                {">>"}
              </p>
            </div>
          ) : (
            <div className=" w-full h-[85vh] flex items-center justify-center ">
              <Spin size="large"></Spin>
            </div>
          )
        ) : (
          <React.Fragment>
            <p className="text-[17px] font-bold ml-5 mb-3">
              Sport Gym Equipment
            </p>
            <div className="grid grid-cols-5 gap-4 w-full h-full bg-[#D9D9D9] p-4 rounded-md">
              {paginatedCards}
            </div>
            <div className="flex items-center mt-3">
              <Pagination
                showSizeChanger={false}
                defaultCurrent={1}
                total={filteredEquipments!.total_rows}
                pageSize={pageSize}
                current={currentPage}
                onChange={(page) => setCurrentPage(page)}
                className="m-auto"
              />
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
