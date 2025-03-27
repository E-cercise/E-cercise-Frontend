import React, {useState} from "react";
import NavBar from "../../components/navbar/NavBar.tsx";
import {Steps} from "antd";
import {RiFileList2Line, RiTruckLine} from "react-icons/ri";
import {MdOutlinePaid} from "react-icons/md";
import {TiDownload} from "react-icons/ti";
import Test from "../../assets/test/home/Group 32.png";
import Dumbbells1 from "../../assets/test/comparison/image 16.png";
import Dumbbells3 from "../../assets/test/comparison/image 18.png";
import "./OrderTracking.css";
import { useLocation } from "react-router-dom";

interface CartList {
    id: number;
    isSelected: boolean;
    imageUrl: string;
    name: string;
    price: number;
    quantity: number;
}

function OrderTracking() {
    const [addressList] = useState([
        {
            id: 1,
            fullName: "Thanadol Udomsirinanchai",
            phoneNumber: "(+66) XXXXXXXXX",
            provinceDistrictSubDistrictPostalCode:
                "Bangkok, Nong Khaem, Nong Khang Phlu, 10160",
            streetNameBuldingHouseNo:
                "XX/XXX, XXXXXXX Petchkasem XX, Phet Kasem XX Road, Nong Khang Phlu",
        },
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
    const location = useLocation();
    const orderID = location.state;

    console.log(orderID);

    const totalPrice = () => {
        let total = 0;
        cartList.forEach((product) => {
            total += product.price * product.quantity;
        });
        return total;
    };

    return (
        <div>
            <NavBar/>
            <div className="w-full p-6 space-y-4">
                <div className="w-full bg-[#E7E7E7] rounded-md p-4 space-y-10">
                    <div className="flex items-center space-x-2 bg-[#F2EFEF] rounded-md p-2">
                        <div className="flex items-center text-[12px] space-x-2">
                            <p className="font-bold">ORDER ID:</p>
                            <p>09554440-dee1-444a-b148-f67da77d4f8c</p>
                        </div>
                        <div>|</div>
                        <div className="flex items-center text-[12px] space-x-2">
                            <p className="font-bold">ORDER STATUS:</p>
                            <p className="font-bold text-[#00C331]">DELIVERED</p>
                        </div>
                    </div>
                    <Steps
                        labelPlacement="vertical"
                        items={[
                            {
                                title: "Order Placed",
                                status: "finish",
                                icon: <RiFileList2Line size={30}/>,
                            },
                            {
                                title: "Order Paid",
                                status: "finish",
                                icon: <MdOutlinePaid size={30}/>,
                            },
                            {
                                title: "Order Shipped Out",
                                status: "wait",
                                icon: <RiTruckLine size={30}/>,
                            },
                            {
                                title: "To Receive",
                                status: "wait",
                                icon: <TiDownload size={30}/>,
                            },
                        ]}
                    />
                    <div className="h-[68px] bg-[#F2EFEF] rounded-md py-1">
                        <button className="text-[14px] text-white bg-[#53D94F] rounded-md px-4 py-2 m-3 float-right">
                            Order Received
                        </button>
                        {/* <Divider></Divider> */}
                        {/* <button></button> */}
                    </div>
                </div>
                <div className="w-full flex bg-[#E7E7E7] rounded-md px-6 py-4 space-x-[20px]">
                    <div className="w-[28vw] h-[30vh] bg-white space-y-2 rounded-md p-5">
                        <h3 className="text-[17px] font-semibold">Delivery Address</h3>
                        <div className="space-y-1">
                            <p className="text-[13px]">{addressList[0].fullName}</p>
                            <p className="text-[13px] text-[#767676]">{addressList[0].phoneNumber}</p>
                            <p className="text-[13px] text-[#767676]">
                                {addressList[0].streetNameBuldingHouseNo},{" "}
                                {addressList[0].provinceDistrictSubDistrictPostalCode}
                            </p>
                        </div>
                    </div>
                    <div className="grow w-[500px] bg-white p-3 rounded-md space-y-2">
                        <div className="flex h-[60px] bg-gray-300 rounded-md">
                            <div className="grow flex items-center justify-center w-[600px] font-bold text-[13px]">
                                Product Ordered
                            </div>
                            <div className="grow flex items-center justify-center w-[150px] text-[13px]">
                                Unit Price
                            </div>
                            <div className="grow flex items-center justify-center w-[150px] text-[13px]">
                                Quantity
                            </div>
                            <div className="grow flex items-center justify-center w-[150px] text-[13px]">
                                Subtotal Price
                            </div>
                        </div>
                        <div
                            className={`space-y-2 max-h-[33vh] ${
                                cartList.length > 3 ? "overflow-y-scroll" : ""
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
                                        <p className="text-[12px]">{product.name}</p>
                                    </div>
                                    <div
                                        className="grow flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                                        ฿{product.price}
                                    </div>
                                    <div
                                        className="grow flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                                        {product.quantity}
                                    </div>
                                    <div
                                        className="grow flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                                        ฿{product.price * product.quantity}
                                    </div>
                                </div>
                            ))}
                            <div>
                                <div className="flex items-center px-2 space-x-2 float-right">
                                    <p className="text-[14px]">Net Total :</p>
                                    <p className="text-[15px] font-semibold">
                                        ฿{totalPrice()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderTracking;
