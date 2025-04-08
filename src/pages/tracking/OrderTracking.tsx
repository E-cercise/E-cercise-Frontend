import { useEffect, useState } from "react";
import { Modal, message, Steps, StepProps } from "antd";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hook/UseAuth.ts";
import { RiFileList2Line, RiTruckLine } from "react-icons/ri";
import { MdOutlinePaid } from "react-icons/md";
import { TiDownload } from "react-icons/ti";
import { PiHandArrowDownBold } from "react-icons/pi";
import NavBar from "../../components/navbar/NavBar.tsx";
import { getOrderDetail } from "../../api/order/GetOrderDetail.ts";
import { updateOrderStatus } from "../../api/order/UpdateOrderStatus.ts";
import { Role } from "../../enum/Role.ts";
import { splitString } from "../../helper/splitStringHelper.ts";
import { OrderDetailResponse } from "../../interfaces/Order.ts";
import QRPromptpay from "/assets/tracking/image.png";
import "./OrderTracking.css";

const statusMap: Record<string, number> = {
  Placed: 0,
  Paid: 1,
  "Shipped out": 2,
  "To Receive": 3,
  Received: 4,
};

// A little helper to get a user-facing message depending on role and status
function getStatusMessage(role: string | null, status: string | undefined) {
  // Just a handful of examples you can adjust freely
  if (!role || !status) return "";

  if (role === Role.User) {
    switch (status) {
      case "Placed":
        return "Waiting for you to pay. Next status: Paid.";
      case "Paid":
        return "Payment received. Waiting for seller to ship your item.";
      case "Shipped out":
        return "Your order is on the way! Next status: To Receive.";
      case "To Receive":
        return "Package is close to delivery. You can confirm ‘Order Received’ once it arrives.";
      case "Received":
        return "Order complete. Thank you!";
      default:
        return "";
    }
  } else if (role === Role.Admin) {
    switch (status) {
      case "Placed":
        return "User placed an order. Waiting for user to pay.";
      case "Paid":
        return "User paid successfully. Ready to ship. Next status: Shipped out.";
      case "Shipped out":
        return "Item is out for delivery. Next status: To Receive.";
      case "To Receive":
        return "User can confirm they received the product.";
      case "Received":
        return "Order is finished.";
      default:
        return "";
    }
  }

  // fallback
  return "";
}

function OrderTracking() {
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse>();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [received, setReceived] = useState<boolean>(true);
  const [adminReceived, setAdminReceived] = useState<boolean>(true);

  const { order_id } = useParams();
  const currentStatusIndex = statusMap[orderDetail?.order_status || ""] ?? -1;
  const { role } = useAuth();

  const stepItems: StepProps[] = [
    {
      title: "Order Placed",
      icon: <RiFileList2Line size={30} />,
      status:
          currentStatusIndex > 0
              ? "finish"
              : currentStatusIndex === 0
                  ? "process"
                  : "wait",
    },
    {
      title: "Order Paid",
      icon: <MdOutlinePaid size={30} />,
      status:
          currentStatusIndex > 1
              ? "finish"
              : currentStatusIndex === 1
                  ? "process"
                  : "wait",
    },
    {
      title: "Order Shipped Out",
      icon: <RiTruckLine size={30} />,
      status:
          currentStatusIndex > 2
              ? "finish"
              : currentStatusIndex === 2
                  ? "process"
                  : "wait",
    },
    {
      title: "To Receive",
      icon: <TiDownload size={30} />,
      status:
          currentStatusIndex > 3
              ? "finish"
              : currentStatusIndex === 3
                  ? "process"
                  : "wait",
    },
    {
      title: "Received",
      icon: <PiHandArrowDownBold size={30} />,
      status: currentStatusIndex === 4 ? "process" : "wait",
    },
  ];

  const detail = async (id: string) => {
    try {
      const response = await getOrderDetail(id);
      if (!response) return;
      const { order_status } = response;
      const isToReceive = order_status === "To Receive";
      const isPaidOrShipped =
          order_status === "Paid" || order_status === "Shipped out";
      setReceived(!isToReceive);
      setAdminReceived(!isPaidOrShipped);
      setOrderDetail(response);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const updateStatus = (id: string | undefined) => {
    updateOrderStatus(id)
        .then((response) => {
          setIsShowModal(false);
          message.success(response.message);
          setReceived(true);
          setAdminReceived(true);
        })
        .catch((error) => {
          console.error(error);
        });
  };

  useEffect(() => {
    if (order_id) {
      detail(order_id);
    }
  }, [adminReceived, received, isShowModal]);

  const messageToShow = getStatusMessage(role, orderDetail?.order_status);

  return (
      <div>
        <NavBar />
        <div className="w-full p-6 space-y-4">
          <div className="w-full bg-[#E7E7E7] rounded-md p-4 space-y-10">
            <div className="flex items-center space-x-2 bg-[#F2EFEF] rounded-md p-2">
              <div className="flex items-center text-[12px] space-x-2">
                <p className="font-bold">ORDER ID:</p>
                <p>{order_id}</p>
              </div>
              <div>|</div>
              <div className="flex items-center text-[12px] space-x-2">
                <p className="font-bold">ORDER STATUS:</p>
                <p className="font-bold text-[#00C331]">
                  {orderDetail?.order_status}
                </p>
              </div>
            </div>

            <Steps labelPlacement="vertical" items={stepItems} />

            {/* Message area for each role/status */}
            {messageToShow && (
                <div className="bg-[#FFF3F0] text-[#333] rounded-md py-2 px-4 my-2">
                  {messageToShow}
                </div>
            )}

            {/* Payment button, visible only for Users with 'Placed' */}
            {role === Role.User && orderDetail?.order_status === "Placed" && (
                <div className="h-[68px] bg-[#F2EFEF] rounded-md py-1 flex items-center justify-end">
                  <button
                      className="text-[14px] text-white bg-[#1890ff] rounded-md px-4 py-2 m-3"
                      onClick={() => setIsShowModal(true)}
                  >
                    Pay Now
                  </button>
                  <Modal
                      title="This is just a mock up of Promptpay"
                      open={isShowModal}
                      onOk={() => updateStatus(order_id)}
                      onCancel={() => setIsShowModal(false)}
                  >
                    <div className="flex items-center justify-center">
                      <img src={QRPromptpay} alt="" className="w-[250px]" />
                    </div>
                  </Modal>
                </div>
            )}

            {/* Admin confirm button, visible when Admin sees status 'Paid' or 'Shipped out' */}
            {role === Role.Admin &&
                (orderDetail?.order_status === "Paid" ||
                    orderDetail?.order_status === "Shipped out") && (
                    <div className="h-[68px] bg-[#F2EFEF] rounded-md py-1 flex items-center justify-end">
                      <button
                          className="text-[14px] text-white bg-[#53D94F] rounded-md px-4 py-2 m-3"
                          onClick={() => updateStatus(order_id)}
                      >
                        Confirm
                      </button>
                    </div>
                )}

            {/* 'Order Received' button for user */}
            {role === Role.User && (
                <div className="h-[68px] bg-[#F2EFEF] rounded-md py-1 flex items-center justify-end">
                  <button
                      className={`text-[14px] text-white ${
                          !received ? "bg-[#53D94F]" : "bg-[#E7E7E7]"
                      } rounded-md px-4 py-2 m-3`}
                      onClick={() => updateStatus(order_id)}
                      disabled={received}
                  >
                    Order Received
                  </button>
                </div>
            )}
          </div>

          <div className="w-full flex bg-[#E7E7E7] rounded-md px-6 py-4 space-x-[20px]">
            <div className="w-[28vw] h-[30vh] bg-white space-y-2 rounded-md p-5">
              <h3 className="text-[17px] font-semibold">Delivery Address</h3>
              <div className="space-y-1">
                <p className="text-[13px]">{orderDetail?.address.full_name}</p>
                <p className="text-[13px] text-[#767676]">
                  {orderDetail?.address.phone_number}
                </p>
                <p className="text-[13px] text-[#767676]">
                  {orderDetail?.address.address_line}
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
                      orderDetail?.orders?.length && orderDetail?.orders.length > 3
                          ? "overflow-y-scroll"
                          : ""
                  }`}
              >
                {orderDetail?.orders.map((product) => (
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
                        <p className="text-[12px]">
                          {splitString(product.equipment_name)[0]}
                        </p>
                      </div>
                      <div className="grow flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                        ฿
                        {product.per_unit_price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <div className="grow flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                        {product.quantity}
                      </div>
                      <div className="grow flex items-center justify-center w-[150px] h-[60px] text-[12px] text-center">
                        ฿
                        {(product.per_unit_price * product.quantity).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                        )}
                      </div>
                    </div>
                ))}
              </div>
              <div>
                <div className="flex items-center px-2 space-x-2 float-right">
                  <p className="text-[14px]">Net Total :</p>
                  <p className="text-[15px] font-semibold">
                    ฿
                    {orderDetail?.net_price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default OrderTracking;
