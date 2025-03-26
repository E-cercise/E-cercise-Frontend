import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Collapse, Descriptions, Divider, Modal, Popover, Select, Spin } from "antd";
import { Carousel } from "react-responsive-carousel";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { equipmentDetail } from "../../api/equipment/EquipmentDetail.ts";
import { addEquipmentToCart } from "../../api/cart/AddEquipmentToCart.ts";
import NavBar from "../../components/navbar/NavBar.tsx";
import Cart from "../../assets/test/detail/+ Cart.png";
import FrontMuscle from "../../assets/navbar/muscles-front-image.png";
import BackMuscle from "../../assets/navbar/muscles-back-image.png";
import RightMark from "../../assets/detail/checkmark.png";
import {
  frontAttributes,
  backAttributes,
} from "../../components/muscles/muscles.ts";
import {
  Category,
  EquipmentDetailResponse,
} from "../../interfaces/equipment/EquipmentDetail.ts";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Detail.css";
import { Option } from "../../interfaces/equipment/UpdateEquipment.ts";

function Detail() {
  const [activePath, setActivePath] = useState<string>("");
  const [, setShowPopOver] = useState<boolean>(false);
  const [clickedMuscles, _] = useState<string[]>([]);
  const [detail, setDetail] = useState<EquipmentDetailResponse>();
  const [options, setOptions] = useState<Category[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  console.log(detail);

  const handleMouseEnter = (id: any) => {
    setActivePath(id);
  };

  const handleMouseLeave = () => {
    setActivePath("");
  };

  const handleShowPopOver = (value: boolean) => {
    setShowPopOver(value);
  };

  const handleSetOptions = (value: Category[]) => {
    setOptions(value);
  };

  const handleOptionChange = (value: number) => {
    setSelectedOption(value);
  };

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  const handleOk = () => {
    // setModalText('The modal will be closed after two seconds');
    // setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      // setConfirmLoading(false);
    }, 1500);
  };

  const handleClickedMuscles = (id: string) => {
    if (!clickedMuscles.includes(id)) {
      clickedMuscles.push(id);
    } else {
      const index = clickedMuscles.indexOf(id, 0);
      clickedMuscles.splice(index, 1);
    }
  };

  const equipment_id = useParams<{ equipment_id: string | undefined }>();

  const getEquipmentDetail = async (id: string | undefined) => {
    try {
      const detail = await equipmentDetail(id);
      setDetail(detail);
      const newOptions = detail.option.map((opt: Option, index: number) => ({
        value: index,
        label: opt.name,
      }));
      handleSetOptions(newOptions);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = async (
    equipment_id: string | undefined,
    equipment_option_id: string | undefined,
    quantity: number
  ) => {
    try {
      console.log(quantity);
      await addEquipmentToCart(
        equipment_id,
        equipment_option_id,
        quantity,
        navigate
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getEquipmentDetail(equipment_id.equipment_id);
  }, []);

  return (
    <div>
      <NavBar />
      {detail != undefined ? (
        <div className="h-full pt-5 pb-5 pl-10 pr-10">
          <div className="h-full bg-[#E7E7E7] pt-3 pb-6 pl-3 pr-3 rounded-md">
            <div className="flex space-x-10 pl-[60px] pr-[60px] pt-5">
              <div className="text-[20px] w-[300px] max-w-[1200px]">
                <Carousel
                  dynamicHeight
                  showArrows={false}
                  infiniteLoop={true}
                  showIndicators={false}
                  showStatus={false}
                  thumbWidth={72}
                >
                  {detail?.option[selectedOption].images
                    ?.slice()
                    .sort(
                      (a, b) => (b.is_primary ? 0 : 1) - (a.is_primary ? 0 : 1)
                    )
                    .map((image, index) => {
                      if (index == 0) {
                        return (
                          <img
                            key={index}
                            src={image.url}
                            className="rounded-lg"
                          />
                        );
                      } else {
                        return (
                          <img
                            key={index}
                            src={image.url}
                            className="rounded-lg"
                          />
                        );
                      }
                    })}
                </Carousel>
              </div>
              <div className="space-y-3">
                <span className="text-[22px] font-semibold">
                  {detail?.name}
                </span>
                <div className="flex space-x-[45px]">
                  <div className="w-[220px] space-y-3">
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
                      <p>
                        {detail?.option[selectedOption].price.toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-[12px] font-bold">Style:</span>
                        {detail.option.length !== 1 ? (
                          <span className="text-[12px]">
                            <Select
                              value={options[selectedOption].value}
                              onChange={handleOptionChange}
                              options={options}
                              className="h-7"
                            />
                          </span>
                        ) : (
                          <div className="text-[12px]">
                            {detail.option[0].name}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[12px] font-bold">Quantity:</span>
                        <div className="flex w-[150px] h-[25px] text-[12px] text-center">
                          <div className="flex">
                            <button
                              className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-s-md"
                              onClick={() =>
                                handleQuantityChange(
                                  quantity > 1 ? quantity - 1 : 1
                                )
                              }
                            >
                              -
                            </button>
                            <input
                              type="text"
                              value={
                                quantity >
                                parseInt(
                                  detail.option[selectedOption].available
                                )
                                  ? parseInt(
                                      detail.option[selectedOption].available
                                    )
                                  : quantity === 0
                                  ? ""
                                  : quantity
                              }
                              onChange={(e) => {
                                // Only update if the input is a valid number
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  setQuantity(
                                    value === "" ? 0 : parseInt(value)
                                  );
                                }
                              }}
                              className="w-10 text-center border-y-2 border-[#A5A5A5]"
                            />
                            <button
                              className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-e-md"
                              onClick={() =>
                                handleQuantityChange(
                                  quantity <
                                    parseInt(
                                      detail.option[selectedOption].available
                                    )
                                    ? quantity + 1
                                    : quantity
                                )
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex text-[12px] space-x-1 ml-[60px]">
                        <span>{detail.option[selectedOption].available}</span>
                        <span>pieces available</span>
                      </div>
                    </div>
                    <Divider style={{ borderColor: "#616161" }}></Divider>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-[12px] font-bold">Brand</span>
                        <span className="text-[12px]">{detail?.brand}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[12px] font-bold">Color</span>
                        <span className="text-[12px]">{detail?.color}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[12px] font-bold">Material</span>
                        <span className="text-[12px]">{detail?.material}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[12px] font-bold">
                          Item Weight
                        </span>
                        <span className="text-[12px]">
                          {detail?.option[selectedOption].weight} Pounds
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[12px] font-bold">Model</span>
                        <span className="text-[12px]">{detail?.model}</span>
                      </div>
                      {/* <div className="flex items-center space-x-3">
                        <span className="text-[12px] font-bold">
                          Special Feature
                        </span>
                        <span className="text-[12px]">
                          {detail?.additional_field.length !== 0
                            ? detail?.additional_field[0].value
                            : ""}
                        </span>
                      </div> */}
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
                          href={FrontMuscle}
                          width="600"
                          height="980"
                        ></image>
                        {frontAttributes.map((element) => {
                          // const id = `ft_${index + 1}`;
                          // console.log(showPopOver);
                          if (detail?.muscle_group_used.includes(element.id)) {
                            // console.log(element.id);
                            return (
                              <React.Fragment>
                                <Popover title={element.name}>
                                  <path
                                    key={element.id}
                                    id={element.id}
                                    fill="#FF0000"
                                    // stroke={activePath === id ? "#0000FF" : "#ff8080"} // Change stroke color on hover
                                    stroke={"#ff8080"} // Change stroke color on hover
                                    vectorEffect="non-scaling-stroke"
                                    d={element.d} // Replace with actual path data for each path
                                    fillOpacity={
                                      activePath === element.id ||
                                      detail?.muscle_group_used.includes(
                                        element.id
                                      )
                                        ? "1"
                                        : "0"
                                    }
                                    strokeOpacity="1"
                                    cursor="pointer"
                                    onMouseEnter={() => {
                                      handleMouseEnter(element.id);
                                      handleShowPopOver(true);
                                    }}
                                    onMouseLeave={() => {
                                      handleMouseLeave();
                                      handleShowPopOver(false);
                                    }}
                                    onClick={() => {
                                      handleClickedMuscles(element.id);
                                    }}
                                    style={{
                                      fill:
                                        activePath === element.id ||
                                        detail?.muscle_group_used.includes(
                                          element.id
                                        )
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
                          href={BackMuscle}
                          width="600"
                          height="980"
                        ></image>
                        {backAttributes.map((element) => {
                          // const id = `bk_${index + 1}`;
                          // console.log(showPopOver);
                          if (detail?.muscle_group_used.includes(element.id)) {
                            return (
                              <React.Fragment>
                                <Popover title={element.name}>
                                  <path
                                    key={element.id}
                                    id={element.id}
                                    fill="#FF0000"
                                    // stroke={activePath === id ? "#0000FF" : "#ff8080"} // Change stroke color on hover
                                    stroke={"#ff8080"} // Change stroke color on hover
                                    vectorEffect="non-scaling-stroke"
                                    d={element.d} // Replace with actual path data for each path
                                    fillOpacity={
                                      activePath === element.id ||
                                      detail?.muscle_group_used.includes(
                                        element.id
                                      )
                                        ? "1"
                                        : "0"
                                    }
                                    strokeOpacity="1"
                                    cursor="pointer"
                                    onMouseEnter={() => {
                                      handleMouseEnter(element.id);
                                      handleShowPopOver(true);
                                    }}
                                    onMouseLeave={() => {
                                      handleMouseLeave();
                                      handleShowPopOver(false);
                                    }}
                                    onClick={() => {
                                      handleClickedMuscles(element.id);
                                    }}
                                    style={{
                                      fill:
                                        activePath === element.id ||
                                        detail?.muscle_group_used.includes(
                                          element.id
                                        )
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
                {/* <div>
                  {
                    detail.additional_field.map((field) => (
                      <div className="flex items-center space-x-[10px]">
                        <span className="text-[12px] font-bold">
                          {field.key}
                        </span>
                        <span className="text-[12px] w-[250px]">
                          {field.value}
                        </span>
                      </div>
                    ))
                  }
                </div> */}
                <Collapse>
                  <Collapse.Panel header="Show Additional Fields" key="1" className="font-semibold">
                    <Descriptions column={2} size="small" bordered>
                      {detail.additional_field.map((field, index) => (
                        <Descriptions.Item key={index} label={field.key} style={{ fontSize: '12px' }}>
                          {field.value}
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </Collapse.Panel>
                </Collapse>
                <Divider style={{ borderColor: "#616161" }}></Divider>
                <div>
                  <span className="text-[12px] font-bold">About this item</span>
                  <ul className="list-disc ml-5">
                    {detail?.feature.map((feature, index) => (
                      <li key={index} className="text-[12px]">
                        {feature.description}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center space-x-10 pl-8 pt-3">
                  <button
                    className="flex items-center bg-[#D9D9D9] font-bold border-2 border-[#565656] rounded w-[170px] pl-5 pr-5 pt-3 pb-3 space-x-3"
                    onClick={async () => {
                      await addToCart(
                        equipment_id.equipment_id,
                        detail.option[selectedOption].id,
                        quantity
                      );
                      setOpen(true);
                    }}
                  >
                    <img src={Cart} className="w-7 h-6" />
                    <span className="text-[14px]">Add To Cart</span>
                  </button>
                  <Modal
                    open={open}
                    closeIcon={false}
                    footer={
                      <button
                        className="text-white bg-[#555555] font-bold border-2 border-[#565656] rounded w-[100px] pl-2 pr-2 pt-2 pb-2"
                        onClick={handleOk}
                      >
                        <span className="text-[14px]">OK</span>
                      </button>
                    }
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <img src={RightMark} alt="" className="w-[80px]" />
                      <p className="text-[16px]">Item has been added to cart</p>
                    </div>
                  </Modal>
                  <button className="text-white bg-[#555555] font-bold border-2 border-[#565656] rounded w-[170px] pl-10 pr-10 pt-3 pb-3">
                    <span className="text-[14px]">Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[85vh] flex items-center justify-center">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}

export default Detail;
