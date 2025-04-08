import {useState, useEffect} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Input, Modal, message} from "antd";
import {FaLocationDot} from "react-icons/fa6";
import NavBar from "../../components/navbar/NavBar.tsx";
import {getUserProfile} from "../../api/user_profile/GetUserProfile.ts";
import {getEquipmentsInCart} from "../../api/cart/GetEquipmentsInCart.ts";
import {createOrder} from "../../api/order/PlaceOrder.ts";
import {CartResponse} from "../../interfaces/Cart.ts";
import {UserProfile} from "../../interfaces/UserProfile.ts";
import {splitString} from "../../helper/splitStringHelper.ts";

function Purchase() {
    const [user, setUser] = useState<UserProfile>();
    const [cart, setCart] = useState<CartResponse>();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("QRPromptPay");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();
    const selectedItems = location.state;

    const getUser = () => {
      getUserProfile()
          .then((user) => {
            setUser(user);
          })
          .catch((err) => {
              console.error(err);
          });
    };

    const getCart = () => {
      getEquipmentsInCart()
          .then((equipmentsInCart) => {
              setCart(equipmentsInCart);
          })
          .catch((err) => {
              // message.error("Failed to load cart items.");
              console.error(err);
          });
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

    const placeOrder = async (selectedItems: string[], paymentType: string, address: string | undefined) => {
        const request = {
            line_equipments: selectedItems,
            payment_type: paymentType,
            address: address, 
        }
        await createOrder(request)
        .then((response) => {
            message.info("order created successfully");
           navigate(`/order/${ response.order_id}`);
        })
        .catch((err) => {
          console.error("Order failed:", err);
        });
    };

    useEffect(() => {
      getUser();
      getCart();
    }, []);

    return (
        <div>
            <NavBar/>
            {cart?.line_equipments?.length ?? 0  > 0 ? (
                <div className="px-[75px] py-10 space-y-4">
                    <div className="w-full h-[120px] bg-[#E7E7E7] px-8 py-5 space-y-5 rounded-md">
                        <div className="flex items-center space-x-3">
                            <FaLocationDot/>
                            <p>Delivery Address</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-[200px] text-[12px] font-bold">
                                <p>{user?.first_name + " " + user?.last_name}</p>
                                <p>{user?.phone_number}</p>
                            </div>
                            <div className="grow">
                                <p className="text-[12px]">
                                    {user?.address}
                                </p>
                            </div>
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
                                    selectedItems.length > 4 ? "overflow-y-scroll" : ""
                                }`}
                            >
                                {cart?.line_equipments.map((product) => {
                                   if (selectedItems.includes(product.line_equipment_id)) {
                                    return (
                                      <div
                                          key={product.line_equipment_id}
                                          className="flex items-center bg-zinc-300 h-[60px] py-5 rounded-md"
                                      >
                                          <div className="grow flex items-center w-[600px] h-[60px] pl-4 space-x-3">
                                              <img
                                                  src={product.img_url}
                                                  alt=""
                                                  className="w-12 h-12 rounded-md"
                                              />
                                              <p className="text-[12px]">{splitString(product.equipment_name)[0]}</p>
                                          </div>
                                          <div
                                              className="grow flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                                              ฿{product.per_unit_price.toLocaleString("en-US", {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              })}
                                          </div>
                                          <div
                                              className="grow flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                                              {product.quantity}
                                          </div>
                                          <div
                                              className="grow flex items-center justify-center w-[150px] h-[60px] text-[13px] text-center">
                                              ฿{(product.per_unit_price * product.quantity).toLocaleString("en-US", {
                                                  minimumFractionDigits: 2,
                                                  maximumFractionDigits: 2,
                                              })}
                                          </div>
                                      </div>
                                    )
                                   }
                                })}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div
                                className="flex items-center justify-center w-[750px] h-[80px] border-y-2 border-dashed border-[#ACACAC] px-3 space-x-3">
                                <p className="text-[13px]">Message for Sellers: </p>
                                <Input
                                    placeholder="Please leave a message..."
                                    className="w-[250px] h-8"
                                    style={{fontWeight: "normal"}}
                                />
                            </div>
                            <div className="h-[80px] border-r-2 border-dashed border-[#ACACAC]"></div>
                            <div className="w-full h-[80px] border-y-2 border-dashed border-[#ACACAC] p-4">
                            </div>
                        </div>
                        <div className="flex items-center justify-end pb-4 pr-5 space-x-5">
                            <p className="text-[13px]">
                                Order Total ({selectedItems.length} Item
                                {selectedItems.length > 1 ? "s" : ""}):{" "}
                            </p>
                            <p className="font-semibold">
                                ฿{totalPrice(selectedItems).toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="w-full h-[270px] bg-[#E7E7E7] rounded-md">
                        <div className="flex items-center border-b-2 border-[#ACACAC] px-6 py-4 space-x-10">
                            <p className="text-[14px]">Payment Method</p>
                            <div className="space-x-10">
                                <button
                                    className={`text-[13px] border-2 ${
                                        selectedPaymentMethod === "QRPromptPay"
                                            ? "border-[#2BC517] text-[#2BC517]"
                                            : "border-[#B6B6B6]"
                                    } px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`}
                                    onClick={() => setSelectedPaymentMethod("QRPromptPay")}
                                >
                                    QR Promptpay
                                </button>
                                <button
                                    className={`text-[13px] border-2 ${
                                        selectedPaymentMethod === "Cash"
                                            ? "border-[#2BC517] text-[#2BC517]"
                                            : "border-[#B6B6B6]"
                                    } px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`}
                                    onClick={() => setSelectedPaymentMethod("Cash")}
                                >
                                    Cash on Delivery
                                </button>
                                <button
                                    className={`text-[13px] border-2 ${
                                        selectedPaymentMethod === "CreditOrDebitCard"
                                            ? "border-[#2BC517] text-[#2BC517]"
                                            : "border-[#B6B6B6]"
                                    } px-2 py-1 rounded-md hover:border-[#2BC517] hover:text-[#2BC517]`}
                                    onClick={() => setSelectedPaymentMethod("CreditOrDebitCard")}
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
                                    <p className="text-[13px] text-right">
                                      ฿{totalPrice(selectedItems).toLocaleString("en-US", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                      })}
                                    </p>
                                    <p className="text-[13px] text-[#767676]">Total Payment:</p>
                                    <p className="text-[17px] text-right font-semibold">
                                        ฿{totalPrice(selectedItems).toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center h-[55px] p-6 space-x-4">
                            <p className="grow text-[10px] text-[#767676]">
                                By clicking 'Place Order', you state acknowledgement and
                                acceptance of E-cercise's Return and Refund policy for this
                                transaction.
                            </p>
                            <button
                                className="bg-green-500 hover:bg-green-600 text-[13px] text-white w-[120px] h-8 rounded-md"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Place Order
                            </button>
                            <Modal
                              title="You are ordering this order"
                              open={isModalOpen}
                              onOk={async () => {
                                  await placeOrder(selectedItems, selectedPaymentMethod, user?.address);
                              }}
                              onCancel={() => setIsModalOpen(false)}
                              centered
                          >
                              Are you sure to place order?
                          </Modal>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-[500px] space-y-4">
                    <div>Your shopping cart is empty</div>
                    <Link to="/">
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
