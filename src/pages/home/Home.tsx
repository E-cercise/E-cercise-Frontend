import React, { useEffect, useState } from "react";
import { Button, Pagination, Spin } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { filteredEquipment } from "../../api/FilteredEquipment";
import NavBar from "../../components/navbar/NavBar";
import SearchIcon from "../../assets/home/search.png";
import Test from "../../assets/test/home/Group 32.png";
import Dumbbells1 from "../../assets/test/comparison/image 16.png";
import "./Home.css";

interface Equipment {
  ID: string;
  name: string;
  price: number;
  image_path: string;
  muscles_group_used: string[];
}

interface FilteredEquipmentResponse {
  equipments: { equipments: Equipment[] };
  page: number;
  limit: number;
  total_pages: number;
  total_rows: number;
}

function Home() {
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
      console.log(getAllEquipments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    equipments(searchKeyword, muscleGroup, currentPage, pageSize);
  }, [searchKeyword, muscleGroup, currentPage, currentPage]);

  // const Cards = () => {
  // let cards = [];
  // for (let i = 0; i < 500; i++) {
  //   if (i % 2 === 0) {
  //     cards.push(
  //       <div
  //         key={i}
  //         className="w-[200px] bg-[#F2EFEF] p-4 space-y-2 rounded-md"
  //       >
  //         <img src={Test} alt="" className="w-full" />
  //         <p
  //           className={`cursor-pointer  text-sm ${
  //             titleHover && equipmentId === i
  //               ? "text-[#DC8900]"
  //               : "text-[#000000]"
  //           }`}
  //           onMouseEnter={() => {
  //             setEquipmentId(i);
  //             setTitleHover(true);
  //           }}
  //           onMouseOut={() => {
  //             setEquipmentId(-1);
  //             setTitleHover(false);
  //           }}
  //         >
  //           Bodybuilding Dumbbell Kit 10 kg
  //         </p>
  //         <div className="flex items-center space-x-2">
  //           <div className="cursor-pointer flex items-center space-x-1">
  //             <div className="flex w-[100px] space-x-1">
  //               <FaStar color="#FFAA1D" />
  //               <FaStar color="#FFAA1D" />
  //               <FaStar color="#FFAA1D" />
  //               <FaStar color="#FFAA1D" />
  //               <FaStarHalfAlt color="#FFAA1D" />
  //             </div>
  //             <IoIosArrowDown />
  //           </div>
  //           <p className="text-xs text-[#31A421]">(1,046)</p>
  //         </div>
  //         <p>$XX.XX</p>
  //         <button className="text-[12px] bg-[#F2DF09] hover:bg-[#FDDA0D] pl-3 pr-3 pt-2 pb-2 rounded-lg">
  //           Add to Cart
  //         </button>
  //       </div>
  //     );
  //   } else if (i % 3 === 0) {
  //     cards.push(
  //       <div
  //         key={i}
  //         className="w-[200px] bg-[#F2EFEF] p-4 space-y-2 rounded-md"
  //       >
  //         <img src={Dumbbells1} alt="" className="w-full" />
  //         <p
  //           className={`cursor-pointer  text-sm ${
  //             titleHover && equipmentId === i
  //               ? "text-[#DC8900]"
  //               : "text-[#000000]"
  //           }`}
  //           onMouseEnter={() => {
  //             setEquipmentId(i);
  //             setTitleHover(true);
  //           }}
  //           onMouseOut={() => {
  //             setEquipmentId(-1);
  //             setTitleHover(false);
  //           }}
  //         >
  //           Adjustable Weights Dumbbells Set, 20/30/40/60/80lbs Non-Rolling
  //           Adjustable Dumbbell Set, Free Weights Dumbbells Set Hexagon,
  //           Weights Set for Home Gym
  //         </p>
  //         <div className="flex items-center space-x-2">
  //           <div className="cursor-pointer flex items-center space-x-1">
  //             <div className="flex w-[100px] space-x-1">
  //               <FaStar color="#FFAA1D" />
  //               <FaStar color="#FFAA1D" />
  //               <FaStar color="#FFAA1D" />
  //               <FaStar color="#FFAA1D" />
  //               <FaStarHalfAlt color="#FFAA1D" />
  //             </div>
  //             <IoIosArrowDown />
  //           </div>
  //           <p className="text-xs text-[#31A421]">(1,046)</p>
  //         </div>
  //         <p>$XX.XX</p>
  //         <button className="text-[12px] bg-[#F2DF09] hover:bg-[#FDDA0D] pl-3 pr-3 pt-2 pb-2 rounded-lg">
  //           Add to Cart
  //         </button>
  //       </div>
  //     );
  //   }
  // }
  // return cards;
  // };

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
          <button className="text-[12px] bg-[#F2DF09] hover:bg-[#FDDA0D] pl-3 pr-3 pt-2 pb-2 rounded-lg">
            Add to Cart
          </button>
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

export default Home;
