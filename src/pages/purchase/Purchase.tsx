import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";
import NavBar from "../../components/navbar/NavBar";
import Test from "../../assets/test/home/Group 32.png";
import Dumbbells1 from "../../assets/test/comparison/image 16.png";
import Dumbbells3 from "../../assets/test/comparison/image 18.png";
import { Input } from "antd";

function Purchase() {
  const [cartList, setCartList] = useState([
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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(1);

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

  return (
    <div>
      <NavBar />
      {
        cartList.length > 0 ?
        <div className="px-[75px] py-10 space-y-4">
        <div className="w-full h-[120px] bg-[#E7E7E7] px-8 py-5 space-y-5 rounded-md">
          <div className="flex items-center space-x-3">
            <FaLocationDot />
            <p>Delivery Address</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-[200px] text-[12px] font-bold">
              <p>Thanadol Udomsirinanchai (+66)</p>
              <p>XXXXXXXXX</p>
            </div>
            <div className="grow">
              <p className="text-[12px]">
                99/104, Grandio Petchkasem 81, Phet Kasem 81 Road, Nong Khang
                Phlu, Nong Khang Phlu, Nong Khaem, Bangkok, 10160
              </p>
            </div>
            <button className="flex-none text-[12px] text-blue-500 hover:text-blue-600 px-3">
              Change
            </button>
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
            <div className={`space-y-3 max-h-[44vh] ${cartList.length > 4 ? "overflow-y-scroll" : ""}`}>
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
              />
            </div>
            <div className="h-[80px] border-r-2 border-dashed border-[#ACACAC]"></div>
            <div className="w-full h-[80px] border-y-2 border-dashed border-[#ACACAC] p-4">
              <div className="w-full flex items-center space-x-4">
                <label className="text-[13px]">Shipping Option:</label>
                <p className="grow text-[13px]">
                  Standard Delivery - deliver inside the country
                </p>
                <button className="flex-none text-[13px] text-blue-500 hover:text-blue-600 px-3">
                  Change
                </button>
                <p className="text-[13px]">฿29</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end pb-4 pr-5 space-x-5">
            <p className="text-[13px]">
              Order Total ({totalQuantity()} Item
              {totalQuantity() > 1 ? "s" : ""}):{" "}
            </p>
            <p className="font-semibold">฿{totalPrice() + 29}</p>
          </div>
        </div>
        <div className="w-full h-[270px] bg-[#E7E7E7] rounded-md">
          <div className="flex items-center border-b-2 border-[#ACACAC] px-6 py-4 space-x-10">
            <p className="text-[14px]">Payment Method</p>
            <div className="space-x-10">
              <button className={`text-[13px] border-2 ${selectedPaymentMethod === 0 ? "border-[#2BC517] text-[#2BC517]" : "border-[#B6B6B6]"} px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`} onClick={() => setSelectedPaymentMethod(0)}>QR Promptpay</button>
              <button className={`text-[13px] border-2 ${selectedPaymentMethod === 1 ? "border-[#2BC517] text-[#2BC517]" : "border-[#B6B6B6]"} px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`} onClick={() => setSelectedPaymentMethod(1)}>Cash on Delivery</button>
              <button className={`text-[13px] border-2 ${selectedPaymentMethod === 2 ? "border-[#2BC517] text-[#2BC517]" : "border-[#B6B6B6]"} px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`} onClick={() => setSelectedPaymentMethod(2)}>Credit/ Debit Card</button>
            </div>
          </div>
          <div className="h-[150px] border-b-2 border-dashed border-[#ACACAC] px-6 py-4">
            <div className="float-right space-y-5">
              <div className="grid grid-cols-2 gap-y-6">
                <p className="text-[13px] text-[#767676]">Merchandise Subtotal</p>
                <p className="text-[13px] text-right">฿{totalPrice()}</p>
                <p className="text-[13px] text-[#767676]">Shipping Subtotal</p>
                <p className="text-[13px] text-right">฿29</p>
                <p className="text-[13px] text-[#767676]">Total Payment:</p>
                <p className="text-[17px] text-right font-semibold">
                  ฿{totalPrice() + 29}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center h-[55px] p-6 space-x-4">
            <p className="grow text-[10px] text-[#767676]">By clicking 'Place Order', you state acknowledgement and acceptance of E-cercise's Return and Refund policy for this transaction.</p>
            <button className="bg-green-500 hover:bg-green-600 text-[13px] text-white w-[120px] h-8 rounded-md">
              Place Order
            </button>
          </div>
        </div>
      </div>
      :
      <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
        <div>Your shopping cart is empty</div>
        <Link to="/home">
          <button className="bg-[#EAEAEA] px-3 py-2 rounded-md">Go Shopping Now</button>
        </Link>
      </div>
      }
    </div>
  );
}

export default Purchase;
