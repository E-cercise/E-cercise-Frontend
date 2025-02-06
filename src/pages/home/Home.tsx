import React, { useState } from "react";
import { Button, Pagination } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import NavBar from "../../components/navbar/NavBar";
import Test from "../../assets/test/home/Group 32.png";
import Dumbbells1 from "../../assets/test/comparison/image 16.png";
import "./Home.css";

function Home() {
  const [equipmentId, setEquipmentId] = useState<number>(-1);
  const [titleHover, setTitleHover] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  const Cards = () => {
    let cards = [];
    for (let i = 0; i < 500; i++) {
      if (i % 2 === 0) {
        cards.push(
          <div
            key={i}
            className="w-[200px] bg-[#F2EFEF] p-4 space-y-2 rounded-md"
          >
            <img src={Test} alt="" className="w-full" />
            <p
              className={`cursor-pointer  text-sm ${
                titleHover && equipmentId === i
                  ? "text-[#DC8900]"
                  : "text-[#000000]"
              }`}
              onMouseEnter={() => {
                setEquipmentId(i);
                setTitleHover(true);
              }}
              onMouseOut={() => {
                setEquipmentId(-1);
                setTitleHover(false);
              }}
            >
              Bodybuilding Dumbbell Kit 10 kg
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
            <p>$XX.XX</p>
            <button className="text-[12px] bg-[#F2DF09] hover:bg-[#FDDA0D] pl-3 pr-3 pt-2 pb-2 rounded-lg">
              Add to Cart
            </button>
          </div>
        );
      } else if (i % 3 === 0) {
        cards.push(
          <div
            key={i}
            className="w-[200px] bg-[#F2EFEF] p-4 space-y-2 rounded-md"
          >
            <img src={Dumbbells1} alt="" className="w-full" />
            <p
              className={`cursor-pointer  text-sm ${
                titleHover && equipmentId === i
                  ? "text-[#DC8900]"
                  : "text-[#000000]"
              }`}
              onMouseEnter={() => {
                setEquipmentId(i);
                setTitleHover(true);
              }}
              onMouseOut={() => {
                setEquipmentId(-1);
                setTitleHover(false);
              }}
            >
              Adjustable Weights Dumbbells Set, 20/30/40/60/80lbs Non-Rolling Adjustable Dumbbell Set, Free Weights Dumbbells Set Hexagon, Weights Set for Home Gym
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
            <p>$XX.XX</p>
            <button className="text-[12px] bg-[#F2DF09] hover:bg-[#FDDA0D] pl-3 pr-3 pt-2 pb-2 rounded-lg">
              Add to Cart
            </button>
          </div>
        );
      }
    }
    return cards;
  };

  const paginatedCards = Cards().slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <NavBar />
      <div className="h-full pt-3 pb-3 pl-5 pr-5">
        <p className="text-[17px] font-bold ml-5 mb-3">Sport Gym Equipment</p>
        <div className="grid grid-cols-5 gap-4 w-full h-full bg-[#D9D9D9] p-4 rounded-md">
          {paginatedCards}
        </div>
        <div className="flex items-center mt-3">
          <Pagination
            showSizeChanger={false}
            defaultCurrent={1}
            total={Cards().length}
            pageSize={pageSize}
            current={currentPage}
            onChange={(page) => setCurrentPage(page)}
            className="m-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
