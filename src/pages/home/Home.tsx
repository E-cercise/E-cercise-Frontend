import React, { useState } from "react";
import { Button } from "antd";
import { IoIosArrowDown } from "react-icons/io";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import NavBar from "../../components/navbar/NavBar";
import Test from "../../assets/test/Group 32.png";
import './Home.css'

function Home() {
  const [equipmentId, setEquipmentId] = useState<number>(-1);
  const [titleHover, setTitleHover] = useState<boolean>(false);

  const Cards = () => {
    let cards = [];
    for (let i = 0; i < 10; i++) {
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
          <button className="text-[12px] bg-[#F2DF09] hover:bg-[#FDDA0D] pl-3 pr-3 pt-2 pb-2 rounded-lg">Add to Cart</button>
        </div>
      );
    }
    return cards;
  };

  return (
    <div>
      <NavBar />
      <div className="h-full pt-3 pb-3 pl-5 pr-5">
        <p className="text-[17px] font-bold ml-5 mb-3">Sport Gym Equipment</p>
        <div className="grid grid-cols-5 gap-4 w-full h-full bg-[#D9D9D9] p-4 rounded-md">
          {Cards()}
        </div>
      </div>
    </div>
  );
}

export default Home;
