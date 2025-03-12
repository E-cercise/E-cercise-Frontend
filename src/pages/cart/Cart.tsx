import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { Link } from "react-router-dom";
import { getEquipmentsInCart } from "../../api/cart/GetEquipmentsInCart.ts";
import { modifyEquipmentInCart } from "../../api/cart/ModifyEquipmentInCart.ts";
import { deleteEquipmentInCart } from "../../api/cart/DeleteEquipmentInCart.ts";
import NavBar from "../../components/navbar/NavBar.tsx";
import { CartResponse } from "../../interfaces/Cart.ts";
import CrossMark from "../../assets/test/cart/image 36.png";

function Cart() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [cart, setCart] = useState<CartResponse>();
  const [modifyQuantity, setModifyQuantity] = useState<{
    lineEquipmentId: string;
    quantity: number;
  }>({ lineEquipmentId: "", quantity: 0 });

  const handleModifyItemQuantityOnCart = (
    lineEquipmentId: string,
    quantity: number
  ) => {
    setModifyQuantity({ lineEquipmentId: lineEquipmentId, quantity: quantity });
  };

  const splitString = (equipmentName: string) => {
    if (equipmentName.includes(" - ")) {
      return equipmentName.split(" - ");
    } else if (equipmentName.includes(", ")) {
      return equipmentName.split(", ");
    }
    return [equipmentName];
  };

  const totalQuantity =
    cart?.line_equipments !== null
      ? cart?.line_equipments.reduce(
          (accumulator, equipment) => accumulator + equipment.quantity,
          0
        )
      : 0;

  const getCart = async () => {
    try {
      const equipmentsInCart = await getEquipmentsInCart();
      console.log(equipmentsInCart);
      setCart(equipmentsInCart);
    } catch (err) {
      console.error(err);
    }
  };

  const modifyItemInCart = async (object: {
    lineEquipmentId: string;
    quantity: number;
  }) => {
    try {
      await modifyEquipmentInCart(object);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItemInCart = async (lineEquipmentId: string) => {
    try {
      await deleteEquipmentInCart(lineEquipmentId);
      getCart();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (modifyQuantity.lineEquipmentId) {
      modifyItemInCart(modifyQuantity).then(() => getCart());
    } else {
      getCart();
    }
  }, [modifyQuantity]);

  return (
    <div>
      <NavBar />
      <div className="pl-10 pr-10 pt-6 pb-6">
        {cart?.line_equipments !== null ? (
          <h1 className="text-[18px] font-bold mb-5">My Carts</h1>
        ) : (
          <React.Fragment></React.Fragment>
        )}
        <div className="w-full space-y-3">
          {cart?.line_equipments !== null ? (
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
          ) : (
            <React.Fragment></React.Fragment>
          )}
          <div className="space-y-3">
            {cart?.line_equipments !== null ? (
              <React.Fragment>
                {cart?.line_equipments.map((equipment) => (
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
                      <p className="text-[12px]">
                        {splitString(equipment.equipment_name)[0]}
                      </p>
                    </div>
                    <div className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                      ฿
                      {equipment.per_unit_price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                      <div className="flex">
                        <button
                          className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-s-md"
                          // onClick={() => handleQuantityChange(product.id, -1)}
                          onClick={() => {
                            handleModifyItemQuantityOnCart(
                              equipment.line_equipment_id,
                              equipment.quantity - 1
                            );
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
                            handleModifyItemQuantityOnCart(
                              equipment.line_equipment_id,
                              equipment.quantity + 1
                            );
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                      {/* ฿{product.price * product.quantity} */}฿
                      {equipment.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="flex items-center justify-center w-[150px] h-[60px] text-center">
                      <img
                        src={CrossMark}
                        // onClick={() => handleRemoveProductFromCart(product.id)}
                        onClick={async () =>
                          await deleteItemInCart(equipment.line_equipment_id)
                        }
                        alt=""
                        className="w-5"
                      />
                    </div>
                  </div>
                ))}
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
                    Select All ({cart?.line_equipments.length})
                  </div>
                  <div className="flex items-center w-[470px] h-[60px] pr-3">
                    <p className="w-full text-[14px] text-right">
                      Total ({totalQuantity} item
                      {totalQuantity !== undefined
                        ? totalQuantity > 1
                          ? "s"
                          : ""
                        : ""}
                      ): ฿
                      {cart?.total_price.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
              </React.Fragment>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-[81vh] space-y-3">
                <div>
                  Your shopping cart is empty
                </div>
                <Link to="/">
                  <button className="bg-green-500 hover:bg-green-600 text-[13px] text-white w-[160px] h-8 rounded-md px-5">
                    Go Shopping Now
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
