import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Divider, Input, Modal, Radio } from "antd";
import { FaLocationDot } from "react-icons/fa6";
import NavBar from "../../components/navbar/NavBar";
import Plus from "../../assets/test/purchase/Group 119.png";
import Test from "../../assets/test/home/Group 32.png";
import Dumbbells1 from "../../assets/test/comparison/image 16.png";
import Dumbbells3 from "../../assets/test/comparison/image 18.png";

interface CartList {
  id: number;
  isSelected: boolean;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

function Purchase() {
  const [addressList, setAddressList] = useState([
    {
      id: 1,
      fullName: "Thanadol Udomsirinanchai",
      phoneNumber: "(+66) XXXXXXXXX",
      provinceDistrictSubDistrictPostalCode:
        "Bangkok, Nong Khaem, Nong Khang Phlu, 10160",
      streetNameBuldingHouseNo:
        "XX/XXX, XXXXXXX Petchkasem XX, Phet Kasem XX Road, Nong Khang Phlu",
    },
    // {
    //   id: 2,
    //   fullName: "Thanadol Udomsirinanchai",
    //   phoneNumber: "(+66) XXXXXXXXX",
    //   provinceDistrictSubDistrictPostalCode:
    //     "Bangkok, Bangkok Yai, Wat ThaPhra, 10600",
    //   streetNameBuldingHouseNo:
    //     "XX/XXX, XXXXXXX Petchkasem XX, Phet Kasem XX Road, Wat Thaphra",
    // },
  ]);
  const [cartList] = useState<CartList[]>([
    {
      id: 1,
      isSelected: false,
      imageUrl: Test,
      name: "Bodybuilding Dumbbell Kit 10 kg",
      price: 120,
      quantity: 2,
    },
    {
      id: 2,
      isSelected: false,
      imageUrl: Dumbbells1,
      name: "Adjustable Weights Dumbbells Set, 20/30/40/60/80lbs Non-Rolling Adjustable Dumbbell Set, Free Weights Dumbbells Set Hexagon, Weights Set for Home Gym",
      price: 150,
      quantity: 1,
    },
    {
      id: 3,
      isSelected: false,
      imageUrl: Dumbbells3,
      name: "Yes4All Old School Adjustable Dumbbell Set with Weight Plates, Star Lock Collars/Connector, 40lbs to 200lbs Adjustable Weight Plates Set",
      price: 200,
      quantity: 1,
    },
  ]);
  // const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  // const [isAddAddressModalOpen, setIsAddAddressModalOpen] =
    // useState<boolean>(false);
  // const [isEditAddressModalOpen, setIsEditAddressModalOpen] =
    // useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<number>(1);
  // const [selectedEditAddress, setSelectedEditAddress] = useState<number>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(1);
  // const [fullName, setFullName] = useState<string>("");
  // const [phoneNumber, setPhoneNumber] = useState<string>("");
  // const [streetNameBuldingHouseNo, setStreetNameBuldingHouseNo] =
  //   useState<string>("");
  // const [
  //   provinceDistrictSubDistrictPostalCode,
  //   setProvinceDistrictSubDistrictPostalCode,
  // ] = useState<string>("");
  // const [isModalShippingOptionOpen, setIsModalShippingOptionOpen] =
  //   useState<boolean>(false);
  // const [selectedShippingOption, setSelectedShippingOption] =
  //   useState<number>(29);
  // const [tempSelectedShippingOption, setTempSelectedShippingOption] =
  //   useState<number>(29);
  // const shippingOption = [
  //   { value: 29, label: "Standard Delivery - deliver inside the country" },
  //   { value: 100, label: "Standard Delivery Bulky - deliver big product" },
  // ];

  // const handleIsAddressModalOpen = (value: boolean) => {
  //   setIsAddressModalOpen(value);
  // };

  // const handleIsAddAddressModalOpen = (value: boolean) => {
  //   setIsAddAddressModalOpen(value);
  // };

  // const handleIsEditAddressModalOpen = (value: boolean) => {
  //   setIsEditAddressModalOpen(value);
  // };

  // const handleSetSelectedAddress = (value: number) => {
  //   setSelectedAddress(value);
  // };

  // const handleSetSelectedEditAddress = (value: number) => {
  //   setSelectedEditAddress(value);
  // };

  // const handleAddAddress = (adrObj: any) => {
  //   setAddressList((prevAddressList) => [...prevAddressList, adrObj]);
  // };

  // const handleEditAddress = () => {
  //   setAddressList((prevAddressList) =>
  //     prevAddressList.map((adrObj) =>
  //       selectedEditAddress === adrObj.id
  //         ? {
  //             ...adrObj,
  //             fullName,
  //             phoneNumber,
  //             streetNameBuldingHouseNo,
  //             provinceDistrictSubDistrictPostalCode,
  //           }
  //         : adrObj
  //     )
  //   );
  // };

  // const handleisModalShippingOptionOpen = (value: boolean) => {
  //   setIsModalShippingOptionOpen(value);
  // };

  const totalPrice = () => {
    let total = 0;
    cartList.forEach((product) => {
      total += product.price * product.quantity;
    });
    return total;
  };

  const totalQuantity = () => {
    let total = 0;
    cartList.forEach((product) => {
      total += product.quantity;
    });
    return total;
  };

  // useEffect(() => {
  //   const selectedAddressObj = addressList.find(
  //     (adr) => adr.id === selectedEditAddress
  //   );
  //   if (selectedAddressObj) {
  //     setFullName(selectedAddressObj.fullName);
  //     setPhoneNumber(selectedAddressObj.phoneNumber);
  //     setProvinceDistrictSubDistrictPostalCode(
  //       selectedAddressObj.provinceDistrictSubDistrictPostalCode
  //     );
  //     setStreetNameBuldingHouseNo(selectedAddressObj.streetNameBuldingHouseNo);
  //   }
  // }, [selectedEditAddress]);

  return (
    <div>
      <NavBar />
      {cartList.length > 0 ? (
        <div className="px-[75px] py-10 space-y-4">
          <div className="w-full h-[120px] bg-[#E7E7E7] px-8 py-5 space-y-5 rounded-md">
            <div className="flex items-center space-x-3">
              <FaLocationDot />
              <p>Delivery Address</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-[200px] text-[12px] font-bold">
                {/* <p>{addressList[selectedAddress - 1].fullName}</p>
                <p>{addressList[selectedAddress - 1].phoneNumber}</p> */}
                {addressList[0].fullName}
                {addressList[0].phoneNumber}
              </div>
              <div className="grow">
                <p className="text-[12px]">
                  {/* {addressList[selectedAddress - 1].streetNameBuldingHouseNo}{" "}
                  {
                    addressList[selectedAddress - 1]
                      .provinceDistrictSubDistrictPostalCode
                  } */}
                  {addressList[0].streetNameBuldingHouseNo}{" "}
                  {addressList[0].provinceDistrictSubDistrictPostalCode}
                </p>
              </div>
              {/* <button
                className="flex-none text-[12px] text-blue-500 hover:text-blue-600 px-3"
                // onClick={() => handleIsAddressModalOpen(true)}
              >
                Change
              </button> */}
              {/* <Modal
                title={
                  <div>
                    <h3>My Address</h3>
                    <Divider className="bg-gray-300"></Divider>
                  </div>
                }
                open={isAddressModalOpen}
                onOk={() => handleIsAddressModalOpen(false)}
                onCancel={() => handleIsAddressModalOpen(false)}
              >
                <Radio.Group value={selectedAddress} className="space-y-5">
                  {addressList.map((adrObj, index) => (
                    <Radio
                      value={adrObj.id}
                      onClick={() => handleSetSelectedAddress(adrObj.id)}
                      key={index}
                    >
                      <div className="flex items-center space-x-10 ml-4 text-[13px]">
                        <div className="w-[350px]">
                          <div className="flex items-center space-x-3">
                            <p className="font-bold">{adrObj.fullName}</p>
                            <p>|</p>
                            <p>{adrObj.phoneNumber}</p>
                          </div>
                          <div>{adrObj.streetNameBuldingHouseNo}</div>
                          <div>
                            {adrObj.provinceDistrictSubDistrictPostalCode}
                          </div>
                        </div>
                        <button
                          className="text-blue-500 hover:text-blue-600"
                          onClick={() => {
                            handleSetSelectedEditAddress(adrObj.id);
                            handleIsEditAddressModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <Modal
                          title={<h3>Edit Address</h3>}
                          open={isEditAddressModalOpen}
                          onOk={() => {
                            handleEditAddress();
                            handleIsEditAddressModalOpen(false);
                          }}
                          onCancel={() => handleIsEditAddressModalOpen(false)}
                        >
                          <div className="space-y-4 mt-3 mb-3">
                            <div className="flex items-center space-x-4">
                              <div className="w-full">
                                <p>Full Name</p>
                                <Input
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  style={{ fontWeight: "normal" }}
                                />
                              </div>
                              <div className="w-full">
                                <p>Phone Number</p>
                                <Input
                                  value={phoneNumber}
                                  onChange={(e) =>
                                    setPhoneNumber(e.target.value)
                                  }
                                  style={{ fontWeight: "normal" }}
                                />
                              </div>
                            </div>
                            <div className="w-full">
                              <p>
                                Province, District, Sub District, Postal Code
                              </p>
                              <Input
                                value={provinceDistrictSubDistrictPostalCode}
                                onChange={(e) =>
                                  setProvinceDistrictSubDistrictPostalCode(
                                    e.target.value
                                  )
                                }
                                style={{ fontWeight: "normal" }}
                              />
                            </div>
                            <div className="w-full">
                              <p>Street Name, Building, House No.</p>
                              <Input
                                value={streetNameBuldingHouseNo}
                                onChange={(e) =>
                                  setStreetNameBuldingHouseNo(e.target.value)
                                }
                                style={{ fontWeight: "normal" }}
                              />
                            </div>
                          </div>
                        </Modal>
                      </div>
                    </Radio>
                  ))}
                </Radio.Group>
                <button
                  className="flex items-center border-2 border-[#B6B6B6] mt-5 px-3 py-1 rounded-md space-x-2"
                  onClick={() => handleIsAddAddressModalOpen(true)}
                >
                  <img src={Plus} className="w-3 h-3" />
                  <p>Add New Address</p>
                </button>
                <Modal
                  title={<h3>Add Address</h3>}
                  open={isAddAddressModalOpen}
                  onOk={() => {
                    handleAddAddress({
                      id: addressList.length + 1,
                      fullName: fullName,
                      phoneNumber: phoneNumber,
                      provinceDistrictSubDistrictPostalCode:
                        provinceDistrictSubDistrictPostalCode,
                      streetNameBuldingHouseNo: streetNameBuldingHouseNo,
                    });
                    handleIsAddAddressModalOpen(false);
                  }}
                  onCancel={() => handleIsAddAddressModalOpen(false)}
                >
                  <div className="space-y-4 mt-3 mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-full">
                        <p>Full Name</p>
                        <Input
                          onChange={(e) => setFullName(e.target.value)}
                          style={{ fontWeight: "normal" }}
                        />
                      </div>
                      <div className="w-full">
                        <p>Phone Number</p>
                        <Input
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          style={{ fontWeight: "normal" }}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <p>Province, District, Sub District, Postal Code</p>
                      <Input
                        onChange={(e) =>
                          setProvinceDistrictSubDistrictPostalCode(
                            e.target.value
                          )
                        }
                        style={{ fontWeight: "normal" }}
                      />
                    </div>
                    <div className="w-full">
                      <p>Street Name, Building, House No.</p>
                      <Input
                        onChange={(e) =>
                          setStreetNameBuldingHouseNo(e.target.value)
                        }
                        style={{ fontWeight: "normal" }}
                      />
                    </div>
                  </div>
                </Modal>
              </Modal> */}
            </div>
          </div>
          <div className="w-full max-h-[82vh] bg-[#E7E7E7] space-y-3 rounded-md">
            <div className="p-3 space-y-3">
              <div className="flex w-full h-[60px] bg-gray-300 rounded-md">
                <div className="grow flex items-center justify-center w-[600px] font-bold text-[14px]">
                  Product Ordered
                </div>
                <div className="grow flex items-center justify-center w-[150px] text-[14px]">
                  Unit Price
                </div>
                <div className="grow flex items-center justify-center w-[150px] text-[14px]">
                  Quantity
                </div>
                <div className="grow flex items-center justify-center w-[150px] text-[14px]">
                  Subtotal Price
                </div>
              </div>
              <div
                className={`space-y-3 max-h-[44vh] ${
                  cartList.length > 4 ? "overflow-y-scroll" : ""
                }`}
              >
                {cartList.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center bg-zinc-300 h-[60px] py-5 rounded-md"
                  >
                    <div className="grow flex items-center w-[600px] h-[60px] pl-4 space-x-3">
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="w-12 rounded-md"
                      />
                      <p className="text-[13px]">{product.name}</p>
                    </div>
                    <div className="grow flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                      ฿{product.price}
                    </div>
                    <div className="grow flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                      {product.quantity}
                    </div>
                    <div className="grow flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                      ฿{product.price * product.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-[750px] h-[80px] border-y-2 border-dashed border-[#ACACAC] px-3 space-x-3">
                <p className="text-[13px]">Message for Sellers: </p>
                <Input
                  placeholder="Please leave a message..."
                  className="w-[250px] h-8"
                  style={{ fontWeight: "normal" }}
                />
              </div>
              <div className="h-[80px] border-r-2 border-dashed border-[#ACACAC]"></div>
              <div className="w-full h-[80px] border-y-2 border-dashed border-[#ACACAC] p-4">
                {/* <div className="w-full flex items-center space-x-4">
                  <label className="text-[13px]">Shipping Option:</label>
                  <p className="grow text-[13px]">
                    {
                      shippingOption.find(
                        (obj) => obj.value === selectedShippingOption
                      )?.label
                    }
                  </p>
                  <button
                    className="flex-none text-[13px] text-blue-500 hover:text-blue-600 px-3"
                    onClick={() => handleisModalShippingOptionOpen(true)}
                  >
                    Change
                  </button>
                  <Modal
                    title={"Select Shipping Option"}
                    open={isModalShippingOptionOpen}
                    onOk={() => {
                      setSelectedShippingOption(tempSelectedShippingOption);
                      handleisModalShippingOptionOpen(false);
                    }}
                    onCancel={() => handleisModalShippingOptionOpen(false)}
                  >
                    <Radio.Group
                      value={tempSelectedShippingOption}
                      onChange={(e) =>
                        setTempSelectedShippingOption(e.target.value)
                      }
                      options={shippingOption}
                    ></Radio.Group>
                  </Modal>
                  <p className="text-[13px]">฿{selectedShippingOption}</p>
                </div> */}
              </div>
            </div>
            <div className="flex items-center justify-end pb-4 pr-5 space-x-5">
              <p className="text-[13px]">
                Order Total ({totalQuantity()} Item
                {totalQuantity() > 1 ? "s" : ""}):{" "}
              </p>
              <p className="font-semibold">
                {/* ฿{totalPrice() + selectedShippingOption} */}
                ฿{totalPrice()}
              </p>
            </div>
          </div>
          <div className="w-full h-[270px] bg-[#E7E7E7] rounded-md">
            <div className="flex items-center border-b-2 border-[#ACACAC] px-6 py-4 space-x-10">
              <p className="text-[14px]">Payment Method</p>
              <div className="space-x-10">
                <button
                  className={`text-[13px] border-2 ${
                    selectedPaymentMethod === 0
                      ? "border-[#2BC517] text-[#2BC517]"
                      : "border-[#B6B6B6]"
                  } px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`}
                  onClick={() => setSelectedPaymentMethod(0)}
                >
                  QR Promptpay
                </button>
                <button
                  className={`text-[13px] border-2 ${
                    selectedPaymentMethod === 1
                      ? "border-[#2BC517] text-[#2BC517]"
                      : "border-[#B6B6B6]"
                  } px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`}
                  onClick={() => setSelectedPaymentMethod(1)}
                >
                  Cash on Delivery
                </button>
                <button
                  className={`text-[13px] border-2 ${
                    selectedPaymentMethod === 2
                      ? "border-[#2BC517] text-[#2BC517]"
                      : "border-[#B6B6B6]"
                  } px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`}
                  onClick={() => setSelectedPaymentMethod(2)}
                >
                  Credit/ Debit Card
                </button>
              </div>
            </div>
            <div className="h-[150px] border-b-2 border-dashed border-[#ACACAC] px-6 py-4">
              <div className="float-right space-y-5">
                <div className="grid grid-cols-2 gap-y-6">
                  <p className="text-[13px] text-[#767676]">
                    Merchandise Subtotal
                  </p>
                  <p className="text-[13px] text-right">฿{totalPrice()}</p>
                  {/* <p className="text-[13px] text-[#767676]">
                    Shipping Subtotal
                  </p> */}
                  {/* <p className="text-[13px] text-right">฿{selectedShippingOption}</p> */}
                  <p className="text-[13px] text-[#767676]">Total Payment:</p>
                  <p className="text-[17px] text-right font-semibold">
                    {/* ฿{totalPrice() + selectedShippingOption} */}
                    ฿{totalPrice()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center h-[55px] p-6 space-x-4">
              <p className="grow text-[10px] text-[#767676]">
                By clicking 'Place Order', you state acknowledgement and
                acceptance of E-cercise's Return and Refund policy for this
                transaction.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-[13px] text-white w-[120px] h-8 rounded-md">
                Place Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
          <div>Your shopping cart is empty</div>
          <Link to="/home">
            <button className="bg-[#EAEAEA] px-3 py-2 rounded-md">
              Go Shopping Now
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Purchase;
