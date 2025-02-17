import { useState } from "react";
import { Button, Input, Popover, Tag } from "antd";
import { Link, useLocation } from "react-router-dom";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import ECerciseLogo from "../../assets/navbar/E-Cercise-Logo.png";
import ComparisonLogo from "../../assets/navbar/Comparison-Logo.png";
import Cart from "../../assets/navbar/Cart.png";
import { frontAttributes, backAttributes } from "../muscles/muscles";
import "./NavBar.css";

function NavBar({
  setSearchKeyword,
  setMuscleGroup,
  setTempState,
}: {
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
  setMuscleGroup: React.Dispatch<React.SetStateAction<string>>;
  setTempState: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [activePath, setActivePath] = useState<string>("");
  const [, setShowPopOver] = useState<boolean>(false);
  const [, setShowMusclesPopover] = useState<boolean>(false);
  const [tempKeyword, setTempKeyword] = useState<string>("");
  const [clickedMuscles, setClickedMuscles] = useState<string[]>([]);
  const location = useLocation(); // Get the current location
  const isHomePage = location.pathname === "/home";

  console.log(clickedMuscles);

  const handleMouseEnter = (id: any) => {
    setActivePath(id);
  };

  const handleMouseLeave = () => {
    setActivePath("");
  };

  const handleKeywordOnChange = (keyword: string) => {
    setTempKeyword(keyword); // Store typed input but don't trigger search yet
  };

  const handleSearchClick = () => {
    setSearchKeyword(tempKeyword);
  };

  const handleShowPopOver = (value: boolean) => {
    setShowPopOver(value);
  };

  const handleShowMusclesPopover = (value: boolean) => {
    setShowMusclesPopover(value);
  };

  const handleClickedMuscles = (id: string) => {
    if (!clickedMuscles.includes(id)) {
      clickedMuscles.push(id);
    } else {
      const index = clickedMuscles.indexOf(id, 0);
      clickedMuscles.splice(index, 1);
    }
  };

  const handleMuscleGroup = (value: string) => {
    setMuscleGroup(value);
  };

  const clearAllClickedMuscles = () => {
    setClickedMuscles([]);
  };

  return (
    <div className="flex items-center bg-[#2D2A32] p-2 space-x-10 sticky top-0 z-5">
      <Link to="/home">
      <div className="flex items-center space-x-4 ml-4">
        <img src={ECerciseLogo} alt="E-Cercise Logo" className="h-14 ml-4" />
      </div>
      </Link>
      <Input.Search
        allowClear
        value={tempKeyword}
        placeholder="Search"
        className="absolute left-[180px] w-[35vw]"
        onChange={(e) => handleKeywordOnChange(e.target.value)}
        onSearch={handleSearchClick}
      />
      {isHomePage && (
        <Popover
          onOpenChange={() => handleShowMusclesPopover(true)}
          placement="bottom"
          content={
            <div className="">
              <div className="flex items-center space-x-2">
                <span className="">Filtered Muscles:</span>
                <div className="flex items-center flex-wrap w-[400px] space-x-2">
                  {clickedMuscles.map((id: string) => {
                    const frontIndex = frontAttributes.findIndex(
                      (obj) => obj.id === id
                    );
                    const backIndex = backAttributes.findIndex(
                      (obj) => obj.id === id
                    );

                    if (frontIndex > -1) {
                      return (
                        <Tag
                          key={id}
                          closable
                          onClose={() => handleClickedMuscles(id)}
                        >
                          {frontAttributes[frontIndex].name}
                        </Tag>
                      );
                    }

                    if (backIndex > -1) {
                      return (
                        <Tag
                          key={id}
                          closable
                          onClose={() => handleClickedMuscles(id)}
                        >
                          {backAttributes[backIndex].name}
                        </Tag>
                      );
                    }

                    return null; // Handle cases where the id is not found
                  })}
                </div>
              </div>
              <div className="flex items-center">
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="250px"
                  height="400px"
                  viewBox="0 0 600 980"
                  xmlSpace="preserve"
                >
                  <image
                    href="src\assets\navbar\muscles-front-image.png"
                    width="600"
                    height="980"
                  ></image>
                  {frontAttributes.map((element, index) => {
                    const id = `ft_${index + 1}`;
                    // console.log(showPopOver);
                    return (
                      <>
                        <Popover title={element.name}>
                          <path
                            key={id}
                            id={id}
                            fill="#FF0000"
                            // stroke={activePath === id ? "#0000FF" : "#ff8080"} // Change stroke color on hover
                            stroke={"#ff8080"} // Change stroke color on hover
                            vectorEffect="non-scaling-stroke"
                            d={element.d} // Replace with actual path data for each path
                            fillOpacity={
                              activePath === id || clickedMuscles.includes(id)
                                ? "1"
                                : "0"
                            }
                            strokeOpacity="1"
                            cursor="pointer"
                            onMouseEnter={() => {
                              handleMouseEnter(id);
                              handleShowPopOver(true);
                            }}
                            onMouseLeave={() => {
                              handleMouseLeave();
                              handleShowPopOver(false);
                            }}
                            onClick={() => {
                              handleClickedMuscles(id);
                            }}
                            style={{
                              fill:
                                activePath === id || clickedMuscles.includes(id)
                                  ? "rgba(231, 89, 99, 0.5)"
                                  : "rgb(253, 88, 88)",
                            }}
                          />
                        </Popover>
                      </>
                    );
                  })}
                </svg>
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="250px"
                  height="400px"
                  viewBox="0 0 600 980"
                  xmlSpace="preserve"
                >
                  <image
                    href="src\assets\navbar\muscles-back-image.png"
                    width="600"
                    height="980"
                  ></image>
                  {backAttributes.map((element, index) => {
                    const id = `bk_${index + 1}`;
                    // console.log(showPopOver);
                    return (
                      <>
                        <Popover title={element.name}>
                          <path
                            key={id}
                            id={id}
                            fill="#FF0000"
                            // stroke={activePath === id ? "#0000FF" : "#ff8080"} // Change stroke color on hover
                            stroke={"#ff8080"} // Change stroke color on hover
                            vectorEffect="non-scaling-stroke"
                            d={element.d} // Replace with actual path data for each path
                            fillOpacity={
                              activePath === id || clickedMuscles.includes(id)
                                ? "1"
                                : "0"
                            }
                            strokeOpacity="1"
                            cursor="pointer"
                            onMouseEnter={() => {
                              handleMouseEnter(id);
                              handleShowPopOver(true);
                            }}
                            onMouseLeave={() => {
                              handleMouseLeave();
                              handleShowPopOver(false);
                            }}
                            onClick={() => {
                              handleClickedMuscles(id);
                            }}
                            style={{
                              fill:
                                activePath === id || clickedMuscles.includes(id)
                                  ? "rgba(231, 89, 99, 0.5)"
                                  : "rgb(253, 88, 88)",
                            }}
                          />
                        </Popover>
                      </>
                    );
                  })}
                </svg>
              </div>
              <div className="flow-root w-full">
                <div className="float-right space-x-3">
                  <Button onClick={() => clearAllClickedMuscles()}>
                    Clear All
                  </Button>
                  <Button
                    onClick={() => handleMuscleGroup(clickedMuscles.join(","))}
                  >
                    Filter
                  </Button>
                </div>
              </div>
            </div>
          }
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
      )}
      <Link to="/comparison" className="absolute right-[310px]">
        <img
          src={ComparisonLogo}
          alt="Comparison Logo"
          className="w-[60px] h-8"
        />
      </Link>
      <Link to="/cart" className="absolute right-[240px]">
        <img src={Cart} alt="Cart Logo" className="h-8" />
      </Link>
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
