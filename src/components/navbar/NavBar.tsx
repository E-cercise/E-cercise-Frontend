import React, { useState } from "react";
import { Button, Dropdown, Input, Popover } from "antd";
import { Link } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ECerciseLogo from "../../assets/navbar/E-Cercise-Logo.png";
import ComparisonLogo from "../../assets/navbar/Comparison-Logo.png";
import Cart from "../../assets/navbar/Cart.png";
import MusclesFront from "../../assets/navbar/muscles-front-image.png";
import MusclesBack from "../../assets/navbar/muscles-back-image.png";
import "./NavBar.css";

function NavBar() {
  const [showMusclesPopover, setShowMusclesPopover] = useState<boolean>(false);

  const handleShowMusclesPopover = (value: boolean) => {
    setShowMusclesPopover(value);
  };

  return (
    <div className="flex items-center bg-[#2D2A32] p-2 space-x-10 sticky top-0">
      <img src={ECerciseLogo} alt="E-Cercise Logo" className="h-14 ml-4" />
      <Input.Search
        allowClear
        placeholder="Search"
        className="absolute left-[180px] w-[35vw]"
      />
      <Popover
        placement="bottom"
      >
        <button
          className="flex items-center space-x-[3px] absolute right-[400px] text-[13px] font-bold bg-[#EAEAEA] rounded-md pl-3 w-[93px] h-8"
          onMouseEnter={() => handleShowMusclesPopover(true)}
          onMouseLeave={() => handleShowMusclesPopover(false)}
        >
          <div className="flex items-center space-x-[3px]">
            <span>Filter</span>
            <FiFilter />
          </div>
          <div className="flex items-center justify-center bg-[#878787] rounded-md w-[28px] h-[28px] ">
            <IoIosArrowDown size={15} />
          </div>
        </button>
      </Popover>
      <img
        src={ComparisonLogo}
        alt="Comparison Logo"
        className="absolute right-[310px] w-[60px] h-8"
      />
      <img src={Cart} alt="Cart Logo" className="absolute right-[240px] h-8" />
      <div className="absolute right-8 space-x-6">
        <Link to="/signup">
          <Button className="text-[13px] font-bold">Sign Up</Button>
        </Link>
        <Link to="/login">
          <Button className="text-[13px] font-bold">Login</Button>
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
