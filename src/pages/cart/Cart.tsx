import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { getEquipmentsInCart } from "../../api/cart/GetEquipmentsInCart";
import { modifyEquipmentInCart } from "../../api/cart/ModifyEquipmentInCart";
import { deleteEquipmentInCart } from "../../api/cart/DeleteEquipmentInCart";
import NavBar from "../../components/navbar/NavBar";
import { CartResponse } from "../../interfaces/Cart";
import CrossMark from "../../assets/test/cart/image 36.png";

function Cart() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [lineEquipment, setLineEquipment] = useState<CartResponse>();
  const [modifyQuantity, setModifyQuantity] = useState<{ lineEquipmentId: string; quantity: number }>({ lineEquipmentId: "", quantity: 0 });
  // const [cartList, setCartList] = useState([
  //   {
  //     id: 1,
  //     isSelected: false,
  //     imageUrl: Test,
  //     name: "Bodybuilding Dumbbell Kit 10 kg",
  //     price: 120,
  //     quantity: 2,
  //   },
  //   {
  //     id: 2,
  //     isSelected: false,
  //     imageUrl: Dumbbells1,
  //     name: "Adjustable Weights Dumbbells Set, 20/30/40/60/80lbs Non-Rolling Adjustable Dumbbell Set, Free Weights Dumbbells Set Hexagon, Weights Set for Home Gym",
  //     price: 150,
  //     quantity: 1,
  //   },
  //   {
  //     id: 3,
  //     isSelected: false,
  //     imageUrl: Dumbbells3,
  //     name: "Yes4All Old School Adjustable Dumbbell Set with Weight Plates, Star Lock Collars/Connector, 40lbs to 200lbs Adjustable Weight Plates Set",
  //     price: 200,
  //     quantity: 1,
  //   },
  // ]);

  // const handleQuantityChange = (id: number, delta: number) => {
  //   setCartList((prevCartList) =>
  //     prevCartList.map((product) =>
  //       product.id === id
  //         ? { ...product, quantity: Math.max(1, product.quantity + delta) }
  //         : product
  //     )
  //   );
  // };

  const handleModifyItemQuantityOnCart = (lineEquipmentId: string, quantity: number) => {
    setModifyQuantity({lineEquipmentId: lineEquipmentId, quantity: quantity})
  }

  // const handleIsSelectedChange = (id: number) => {
  //   setCartList((prevCartList) =>
  //     prevCartList.map((product) =>
  //       product.id === id ? { ...product, isSelected: !product.isSelected } : product
  //     )
  //   );
  // };

  // const setIsSelected = () => {
  //   setCartList((prevCartList) =>
  //     prevCartList.map((product) => {
  //       if (totalIsSelected() != cartList.length) {
  //           return {
  //               ...product,
  //               isSelected: true,
  //             }
  //       } else {
  //           return {
  //               ...product,
  //               isSelected: false,
  //             }
  //       }
  //     })
  //   );
  // };

  // const totalIsSelected = () => {
  //   let total = 0;
  //   cartList.forEach((product) => {
  //     if (product.isSelected) {
  //       total += 1;
  //     }
  //   });
  //   return total;
  // };

  const splitString = (equipmentName: string) => {
    if (equipmentName.includes(" - ")) {
      return equipmentName.split(" - ");
    } else if (equipmentName.includes(", ")) {
      return equipmentName.split(", ");
    }
    return [equipmentName];
  }

  const totalQuantity = 
      lineEquipment?.line_equipments.reduce((accumulator, equipment) => accumulator + equipment.quantity,
      0,
    );

  const getLineEquipments = async () => {
    try {
      const equipmentsInCart = await getEquipmentsInCart();
      console.log(equipmentsInCart);
      setLineEquipment(equipmentsInCart);
    } catch (err) {
      console.error(err);
    }
  };

  const modifyItemInCart = async (object: { lineEquipmentId: string; quantity: number }) => {
    try {
      await modifyEquipmentInCart(object);
    } catch(err) {
      console.error(err);
    }
  }

  const deleteItemInCart = async (lineEquipmentId: string) => {
    try {
      await deleteEquipmentInCart(lineEquipmentId);
      getLineEquipments();
    } catch(err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (modifyQuantity.lineEquipmentId) {
      modifyItemInCart(modifyQuantity).then(() => getLineEquipments());
    } else {
      getLineEquipments();
    }
  }, [modifyQuantity]);

  return (
    <div>
      <NavBar />
      <div className="pl-10 pr-10 pt-6 pb-6">
        <h1 className="text-[18px] font-bold mb-5">My Carts</h1>
        <div className="w-full space-y-3">
          <div className="w-full flex h-[50px] bg-[#BFBFBF] rounded-lg">
            <div className="flex items-center justify-center w-[50px] rounded-s-lg">
              <input
                type="checkbox"
                // onClick={() => setIsSelected()}
                className="w-6"
                // checked={totalIsSelected() == cartList.length}
              />
            </div>
            <div className="flex items-center justify-center w-[500px] font-bold text-[14px]">
              Product
            </div>
            <div className="flex items-center justify-center w-[150px] text-[14px]">
              Unit Price
            </div>
            <div className="flex items-center justify-center w-[150px] text-[14px]">
              Quantity
            </div>
            <div className="flex items-center justify-center w-[150px] text-[14px]">
              Total Price
            </div>
            <div className="flex items-center justify-center w-[150px] text-[14px] rounded-e-lg">
              Action
            </div>
          </div>
          <div className="space-y-3">
            {/* {cartList.map((product) => (
              <div
                key={product.id}
                className="flex bg-[#E7E7E7] h-[60px] rounded-lg"
              >
                <div className="flex items-center justify-center w-[50px] h-[60px] text-center">
                  <input
                    type="checkbox"
                    onClick={() => handleIsSelectedChange(product.id)}
                    className="w-5"
                    checked={product.isSelected}
                  />
                </div>
                <div className="flex items-center w-[500px] h-[60px] pl-4 space-x-3">
                  <img
                    src={product.imageUrl}
                    alt=""
                    className="w-12 rounded-md"
                  />
                  <p className="text-[13px]">{product.name}</p>
                </div>
                <div className="flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                  ฿{product.price}
                </div>
                <div className="flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                  <div className="flex">
                    <button
                      className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-s-md"
                      onClick={() => handleQuantityChange(product.id, -1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={product.quantity}
                      className="w-10 text-center border-y-2 border-[#A5A5A5]"
                    />
                    <button
                      className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-e-md"
                      onClick={() => handleQuantityChange(product.id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                  ฿{product.price * product.quantity}
                </div>
                <div className="flex items-center justify-center w-[150px] h-[60px] text-center">
                  <img
                    src={CrossMark}
                    onClick={() => handleRemoveProductFromCart(product.id)}
                    alt=""
                    className="w-5"
                  />
                </div>
              </div>
            ))} */}
            {lineEquipment?.line_equipments !== null ? (
              lineEquipment?.line_equipments.map((equipment) => (
                <div
                  key={equipment.line_equipment_id}
                  className="flex bg-[#E7E7E7] h-[60px] rounded-lg"
                >
                  <div className="flex items-center justify-center w-[50px] h-[60px] text-center">
                    <input
                      type="checkbox"
                      // onClick={() => handleIsSelectedChange(product.id)}
                      className="w-5"
                      // checked={product.isSelected}
                    />
                  </div>
                  <div className="flex items-center w-[500px] h-[60px] pl-4 space-x-3">
                    <img
                      src={equipment.img_url}
                      alt=""
                      className="w-12 rounded-md"
                    />
                    <p className="text-[12px]">{splitString(equipment.equipment_name)[0]}</p>
                  </div>
                  <div className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                    ฿{equipment.per_unit_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                    <div className="flex">
                      <button
                        className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-s-md"
                        // onClick={() => handleQuantityChange(product.id, -1)}
                        onClick={() => {
                          handleModifyItemQuantityOnCart(equipment.line_equipment_id, equipment.quantity - 1);
                        }}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        value={equipment.quantity}
                        className="w-10 text-center border-y-2 border-[#A5A5A5]"
                      />
                      <button
                        className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-e-md"
                        // onClick={() => handleQuantityChange(product.id, 1)}
                        onClick={() => {
                          handleModifyItemQuantityOnCart(equipment.line_equipment_id, equipment.quantity + 1)
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                    {/* ฿{product.price * product.quantity} */}฿
                    {equipment.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center justify-center w-[150px] h-[60px] text-center">
                    <img
                      src={CrossMark}
                      // onClick={() => handleRemoveProductFromCart(product.id)}
                      onClick={async() => await deleteItemInCart(equipment.line_equipment_id)}
                      alt=""
                      className="w-5"
                    />
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>
        <h2 className="font-bold mt-6 mb-3">Summary</h2>
        <div className="w-full flex bg-[#C5CBD7] h-[60px] rounded-lg">
          <div className="flex items-center justify-center w-[50px] h-[60px] text-center">
            <input
              type="checkbox"
              // onClick={() => setIsSelected()}
              className="w-5"
              // checked={totalIsSelected() == cartList.length}
            />
          </div>
          <div className="flex items-center w-[400px] h-[60px] text-[14px] pl-3">
            Select All ({lineEquipment?.line_equipments.length})
          </div>
          <div className="flex items-center w-[470px] h-[60px] pr-3">
            <p className="w-full text-[14px] text-right">
              Total ({totalQuantity} item{totalQuantity !== undefined ? totalQuantity > 1 ? "s" : "" : ""}): ฿
              {lineEquipment?.total_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex items-center justify-center w-[150px] h-[60px]">
            <button
              // onClick={() => {
              //   if (!totalPrice()) {
              //     setIsModalOpen(true);
              //   }
              // }}
              className="bg-green-500 hover:bg-green-600 text-[13px] text-white w-[120px] h-8 rounded-md"
            >
              Check Out
            </button>
          </div>
        </div>
        <Modal
          title={"You have not selected any items for checkout"}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={[
            <button
              className="bg-green-500 hover:bg-green-600 text-white w-10 h-8 rounded-md"
              onClick={() => setIsModalOpen(false)}
            >
              OK
            </button>,
          ]}
          centered
        >
          Please select any items before checkout
        </Modal>
      </div>
    </div>
  );
}

export default Cart;
