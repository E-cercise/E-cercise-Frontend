import React, { useState } from "react";
import { Popover, Select } from 'antd';
import { Carousel } from "react-responsive-carousel";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import NavBar from "../../components/navbar/NavBar";
import Image24 from "../../assets/test/detail/61B23FTbldL._AC_SX679_.jpg";
import Image25 from "../../assets/test/detail/81MibHuZ-2L._AC_SX679_.jpg";
import Image26 from "../../assets/test/detail/81fe9+bCwnL._AC_SX679_.jpg";
import Image27 from "../../assets/test/detail/71jHa14xWRL._AC_SX679_.jpg";
import Image28 from "../../assets/test/detail/714Ok8Q27iL._AC_SX679_.jpg";
import Image29 from "../../assets/test/detail/71FgyakEiQL._AC_SX679_.jpg";
import Image30 from "../../assets/test/detail/91HJDUO53iL._AC_SX679_.jpg";
import Cart from "../../assets/test/detail/+ Cart.png";
import { frontAttributes, backAttributes } from "../../components/muscles/muscles";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Detail.css";

function Detail() {
  const [activePath, setActivePath] = useState<string>("");
  const [showPopOver, setShowPopOver] = useState<boolean>(false);
  const [, setShowMusclesPopover] = useState<boolean>(false);
  const [clickedMuscles, _] = useState<string[]>([]);

  const frontMusclesUsed = ['ft_5', 'ft_6', 'ft_14', 'ft_15'];
  const backMusclesUsed = ['bk_8', 'bk_9', 'bk_10', 'bk_11']

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleMouseEnter = (id: any) => {
    setActivePath(id);
  };

  const handleMouseLeave = () => {
    setActivePath("");
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

  return (
    <div>
      <NavBar />
      <div className="h-full pt-5 pb-5 pl-10 pr-10">
        <div className="h-full bg-[#E7E7E7] pt-3 pb-3 pl-3 pr-3 rounded-md">
          <div className="flex space-x-10 pl-[60px] pr-[60px] pt-5">
            <div className="text-[20px] w-[300px] max-w-[1200px]">
              <Carousel
                showArrows={false}
                infiniteLoop={true}
                showIndicators={false}
                showStatus={false}
                thumbWidth={72}
              >
                <img src={Image24} className="rounded-lg" />
                <img src={Image25} className="rounded-lg" />
                <img src={Image26} className="rounded-lg" />
                <img src={Image27} className="rounded-lg" />
                <img src={Image28} className="rounded-lg" />
                <img src={Image29} className="rounded-lg" />
                <img src={Image30} className="rounded-lg" />
              </Carousel>
            </div>
            <div className="space-y-3">
              <span className="text-[22px] font-semibold">
                Rep Fitness Rubber Hex Dumbbell(s) - Singles (55LB +) and Pairs
                (5LB - 50LB) - Low Odor, Fully Knurled Handle
              </span>
              <div className="flex space-x-[45px]">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span>4.5</span>
                    <div className="flex items-center w-[100px] space-x-1">
                      <FaStar color="#FFAA1D" />
                      <FaStar color="#FFAA1D" />
                      <FaStar color="#FFAA1D" />
                      <FaStar color="#FFAA1D" />
                      <FaStarHalfAlt color="#FFAA1D" />
                    </div>
                    <IoIosArrowDown />
                    <span className="text-[#31A421]">(1,026)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>฿</span>
                    <p>XXXX</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[12px] font-bold">Style</span>
                    <Select
                      defaultValue="10 LB Pair"
                      onChange={(e: any) => handleChange(e.value)}
                      className="w-[110px] h-6"
                      options={[
                        { value: 10, label: "10 LB Pair" },
                        { value: 20, label: "20 LB Pair" },
                        { value: 30, label: "30 LB Pair" },
                        { value: 40, label: "40 LB Pair" },
                        { value: 50, label: "50 LB Pair" },
                      ]}
                    />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[12px] font-bold">Brand</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[12px] font-bold">Color</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[12px] font-bold">Material</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[12px] font-bold">Item Weight</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[12px] font-bold">Model</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-[12px] font-bold">
                      Special Feature
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="180px"
                      height="250px"
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
                        if (frontMusclesUsed.includes(id)) {
                          return (
                            <React.Fragment>
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
                                    activePath === id || frontMusclesUsed.includes(id)
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
                                      activePath === id ||
                                      frontMusclesUsed.includes(id)
                                        ? "rgba(231, 89, 99, 0.5)"
                                        : "rgb(253, 88, 88)",
                                  }}
                                />
                              </Popover>
                            </React.Fragment>
                          );
                        }
                      })}
                    </svg>
                    <svg
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="180px"
                      height="250px"
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
                        if (backMusclesUsed.includes(id)) {
                          return (
                            <React.Fragment>
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
                                    activePath === id || backMusclesUsed.includes(id)
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
                                      activePath === id ||
                                      backMusclesUsed.includes(id)
                                        ? "rgba(231, 89, 99, 0.5)"
                                        : "rgb(253, 88, 88)",
                                  }}
                                />
                              </Popover>
                            </React.Fragment>
                          );
                        }
                      })}
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-10 pl-8 pt-3">
                <button className="flex items-center bg-[#D9D9D9] font-bold border-2 border-[#565656] rounded w-[170px] pl-5 pr-5 pt-3 pb-3 space-x-3">
                  <img src={Cart} className="w-7 h-6" />
                  <span className="text-[14px]">Add To Cart</span>
                </button>
                <button className="text-white bg-[#555555] font-bold border-2 border-[#565656] rounded w-[170px] pl-10 pr-10 pt-3 pb-3">
                  <span className="text-[14px]">Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
