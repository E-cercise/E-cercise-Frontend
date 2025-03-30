import React, {useEffect, useState} from "react";
import {message, Modal} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {getEquipmentsInCart} from "../../api/cart/GetEquipmentsInCart.ts";
import {modifyEquipmentInCart} from "../../api/cart/ModifyEquipmentInCart.ts";
import {deleteEquipmentInCart} from "../../api/cart/DeleteEquipmentInCart.ts";
import {splitString} from "../../helper/splitStringHelper.ts";
import {CartResponse} from "../../interfaces/Cart.ts";
import NavBar from "../../components/navbar/NavBar.tsx";
import CrossMark from "../../assets/test/cart/image 36.png";

function Cart() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [cart, setCart] = useState<CartResponse>();
    const [modifyQuantity, setModifyQuantity] = useState<{
        lineEquipmentId: string;
        quantity: number;
    }>({lineEquipmentId: "", quantity: 0});
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const navigate = useNavigate();

    const allItemIds = cart?.line_equipments?.map(e => e.line_equipment_id) || [];
    const isAllSelected = allItemIds.length > 0 && selectedItems.length === allItemIds.length;

    const handleSelectAllChange = (checked: boolean) => {
        setSelectedItems(checked ? allItemIds : []);
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setSelectedItems(prev =>
            checked ? [...prev, id] : prev.filter(itemId => itemId !== id)
        );
    };

    const handleModifyItemQuantityOnCart = (
        lineEquipmentId: string,
        quantity: number
    ) => {
        if (quantity >= 1) {
            setModifyQuantity({lineEquipmentId, quantity});
        }
    };


    const totalPrice = (selectedItems: string[] | undefined) => {
      if (selectedItems !== undefined) {
        let total = 0;
        cart?.line_equipments.forEach((equipment) => {
          if (selectedItems.includes(equipment.line_equipment_id)) {
            total += equipment.per_unit_price * equipment.quantity;
          }
        });
        return total;
      } else {
        return 0;
      }
    };    

    const getCart = () => {
        getEquipmentsInCart()
            .then((equipmentsInCart) => {
                setCart(equipmentsInCart);
            })
            .catch((err) => {
                message.error("Failed to load cart items.");
                console.error(err);
            });
    };

    const deleteItemInCart = (lineEquipmentId: string) => {
        deleteEquipmentInCart(lineEquipmentId)
            .then(() => {
                message.success("Item removed from cart.");
                return getEquipmentsInCart();
            })
            .then((equipmentsInCart) => {
                setCart(equipmentsInCart);
            })
            .catch((err) => {
                message.error("Failed to remove item from cart.");
                console.error(err);
            });
    };

    const modifyItemInCart = (object: {
        lineEquipmentId: string;
        quantity: number;
    }) => {
        modifyEquipmentInCart(object)
            .then(() => {
                message.success("Cart updated successfully.");
                return getEquipmentsInCart();
            })
            .then((equipmentsInCart) => {
                setCart(equipmentsInCart);
            })
            .catch((err) => {
                const msg =
                    err?.response?.data?.message || err?.message || "An unexpected error occurred.";
                message.error("Failed to update cart: " + msg);
                console.error(err);
            });
    };

    console.log(selectedItems);

    useEffect(() => {
        if (modifyQuantity.lineEquipmentId) {
            modifyItemInCart(modifyQuantity);
        } else {
            getCart();
        }
    }, [modifyQuantity]);

    return (
        <div>
            <NavBar/>
            <div className="pl-10 pr-10 pt-6 pb-6">
                {cart?.line_equipments?.length ? (
                    <h1 className="text-[18px] font-bold mb-5">My Carts</h1>
                ) : null}
                <div className="w-full space-y-3">
                    {cart?.line_equipments?.length ? (
                        <div className="w-full flex h-[50px] bg-[#BFBFBF] rounded-lg">
                            <div className="flex items-center justify-center w-[50px] rounded-s-lg">
                                {/* <input type="checkbox" className="w-6"/> */}
                                <input
                                  type="checkbox"
                                  className="w-6"
                                  checked={isAllSelected}
                                  onChange={(e) => handleSelectAllChange(e.target.checked)}
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
                    ) : null}
                    <div className="space-y-3">
                        {cart?.line_equipments?.length ? (
                            <>
                                {cart.line_equipments.map((equipment) => (
                                    <div
                                        key={equipment.line_equipment_id}
                                        className="flex bg-[#E7E7E7] h-[60px] rounded-lg"
                                    >
                                        <div className="flex items-center justify-center w-[50px] h-[60px] text-center">
                                          <input type="checkbox" className="w-5" 
                                            checked={selectedItems.includes(equipment.line_equipment_id)}
                                            onChange={(e) =>
                                              handleCheckboxChange(equipment.line_equipment_id, e.target.checked)
                                            }
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
                                        <div
                                            className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                                            ฿
                                            {equipment.per_unit_price.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>
                                        <div
                                            className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                                            <div className="flex">
                                                <button
                                                    className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-s-md"
                                                    onClick={() =>
                                                        handleModifyItemQuantityOnCart(
                                                            equipment.line_equipment_id,
                                                            equipment.quantity - 1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="text"
                                                    value={equipment.quantity}
                                                    className="w-10 text-center border-y-2 border-[#A5A5A5]"
                                                    readOnly
                                                />
                                                <button
                                                    className="w-6 hover:bg-gray-300 border-2 border-[#A5A5A5] rounded-e-md"
                                                    onClick={() =>
                                                        handleModifyItemQuantityOnCart(
                                                            equipment.line_equipment_id,
                                                            equipment.quantity + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            className="flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                                            ฿
                                            {equipment.total.toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </div>
                                        <div
                                            className="flex items-center justify-center w-[150px] h-[60px] text-center">
                                            <img
                                                src={CrossMark}
                                                onClick={() =>
                                                    deleteItemInCart(equipment.line_equipment_id)
                                                }
                                                alt=""
                                                className="w-5 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                ))}
                                <h2 className="font-bold mt-6 mb-3">Summary</h2>
                                <div className="w-full flex bg-[#C5CBD7] h-[60px] rounded-lg">
                                    <div className="flex items-center justify-center w-[50px] h-[60px] text-center">
                                        <input type="checkbox" className="w-5" checked={isAllSelected} onChange={(e) => handleSelectAllChange(e.target.checked)}/>
                                    </div>
                                    <div className="flex items-center w-[400px] h-[60px] text-[14px] pl-3">
                                        Select All ({selectedItems.length})
                                    </div>
                                    <div className="flex items-center w-[470px] h-[60px] pr-3">
                                        <p className="w-full text-[14px] text-right">
                                            Total ({selectedItems.length} item
                                            {selectedItems.length > 1 ? "s" : ""}): ฿
                                            {totalPrice(selectedItems).toLocaleString("en-US", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center w-[150px] h-[60px]">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-[13px] text-white w-[120px] h-8 rounded-md"
                                            onClick={() => {
                                                if (selectedItems.length === 0) {
                                                    setIsModalOpen(true);
                                                } else {
                                                    navigate("/purchase", { state: selectedItems })
                                                }
                                            }}
                                        >
                                            Check Out
                                        </button>
                                    </div>
                                </div>
                                <Modal
                                    title="You have not selected any items for checkout"
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
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-[81vh] space-y-3">
                                <div>Your shopping cart is empty</div>
                                <Link to="/">
                                    <button
                                        className="bg-green-500 hover:bg-green-600 text-[13px] text-white w-[160px] h-8 rounded-md px-5">
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
