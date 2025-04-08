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
import "../../../public/assets/css/OrderTracking.css";

// Define how each status maps to step index
const statusMap: Record<string, number> = {
  Placed: 0,
  Paid: 1,
  "Shipped out": 2,
  "To Receive": 3,
  Received: 4,
};

function getInlineMessage(role: string | null, status: string | undefined) {
  if (!role || !status) return "";

  if (role === Role.User) {
    switch (status) {
      case "Placed":
        return "Please complete payment to proceed.";
      case "Paid":
        return "We have received your payment. Waiting for shipment.";
      case "Shipped out":
        return "Your order is currently in transit.";
      case "To Receive":
        return "Your package is close to arrival. Confirm once received.";
        // After “Received,” typically no button is shown
      default:
        return "";
    }
  } else if (role === Role.Admin) {
    switch (status) {
      case "Placed":
        return "User has placed an order. Waiting for payment.";
      case "Paid":
        return "Order paid successfully. Ready to ship.";
      case "Shipped out":
        return "Item is out for delivery.";
      case "To Receive":
        return "User should confirm receipt soon.";
        // After “Received,” typically no button is shown
      default:
        return "";
    }
  }

  return "";
}

function OrderTracking() {
  const [orderDetail, setOrderDetail] = useState<OrderDetailResponse>();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const [received, setReceived] = useState<boolean>(true);
  const [adminReceived, setAdminReceived] = useState<boolean>(true);

  const { order_id } = useParams();
  const { role } = useAuth();

  const currentStatusIndex = statusMap[orderDetail?.order_status || ""] ?? -1;

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
      const isPaidOrShipped = order_status === "Paid" || order_status === "Shipped out";

      setReceived(!isToReceive);
      setAdminReceived(!isPaidOrShipped);

      setOrderDetail(response);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };

  const updateStatusHandler = (id: string | undefined) => {
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
  }, [adminReceived, received, isShowModal, order_id]);

  return (
      <div>
        <NavBar />
        <div className="w-full p-6 space-y-4">
          <div className="w-full bg-[#E7E7E7] rounded-md p-4 space-y-10">
            {/* Order ID and Status up top */}
            <div className="flex items-center space-x-2 bg-[#F2EFEF] rounded-md p-2">
              <div className="flex items-center text-[12px] space-x-2">
                <p className="font-bold">ORDER ID:</p>
                <p>{order_id}</p>
              </div>
              <div>|</div>
              <div className="flex items-center text-[12px] space-x-2">
                <p className="font-bold">ORDER STATUS:</p>
                <p className="font-bold text-[#00C331]">{orderDetail?.order_status}</p>
              </div>
            </div>

            <Steps labelPlacement="vertical" items={stepItems} />

            {/* For each role & status, we show the relevant message and the button on the same line */}
            {/* 1) For user, 'Placed' => Pay Now */}
            {role === Role.User && orderDetail?.order_status === "Placed" && (
                <div className="h-[48px] bg-[#E7E7E7] rounded-md px-3 flex items-center justify-between">
              <span className="text-[14px] text-gray-700">
                {getInlineMessage(role, orderDetail?.order_status)}
              </span>
                  <button
                      className="text-[14px] text-white bg-[#1890ff] rounded-md px-4 py-2 m-1"
                      onClick={() => setIsShowModal(true)}
                  >
                    Pay Now
                  </button>
                  <Modal
                      title="Promptpay Demo"
                      open={isShowModal}
                      onOk={() => updateStatusHandler(order_id)}
                      onCancel={() => setIsShowModal(false)}
                  >
                    <div className="flex items-center justify-center">
                      <img src={QRPromptpay} alt="QR PromptPay" className="w-[250px]" />
                    </div>
                  </Modal>
                </div>
            )}

            {/* 2) For Admin, 'Paid' => Confirm shipping; 'Shipped out' => Confirm next step, etc. */}
            {role === Role.Admin && orderDetail?.order_status === "Paid" && (
                <div className="h-[48px] bg-[#E7E7E7] rounded-md px-3 flex items-center justify-between">
              <span className="text-[14px] text-gray-700">
                {getInlineMessage(role, orderDetail?.order_status)}
              </span>
                  <button
                      className="text-[14px] text-white bg-[#53D94F] rounded-md px-4 py-2 m-1"
                      onClick={() => updateStatusHandler(order_id)}
                  >
                    Confirm
                  </button>
                </div>
            )}

            {role === Role.Admin && orderDetail?.order_status === "Shipped out" && (
                <div className="h-[48px] bg-[#E7E7E7] rounded-md px-3 flex items-center justify-between">
              <span className="text-[14px] text-gray-700">
                {getInlineMessage(role, orderDetail?.order_status)}
              </span>
                  <button
                      className="text-[14px] text-white bg-[#53D94F] rounded-md px-4 py-2 m-1"
                      onClick={() => updateStatusHandler(order_id)}
                  >
                    Confirm
                  </button>
                </div>
            )}

            {role === Role.Admin && orderDetail?.order_status === "To Receive" && (
                <div className="h-[48px] bg-[#E7E7E7] rounded-md px-3 flex items-center justify-between">
              <span className="text-[14px] text-gray-700">
                {getInlineMessage(role, orderDetail?.order_status)}
              </span>
                  <button
                      className="text-[14px] text-white bg-[#53D94F] rounded-md px-4 py-2 m-1"
                      onClick={() => updateStatusHandler(order_id)}
                  >
                    Confirm
                  </button>
                </div>
            )}

            {/* 3) For User, 'Paid' => waiting, 'Shipped out' => waiting, 'To Receive' => show Order Received button */}
            {role === Role.User && orderDetail?.order_status === "Shipped out" && (
                <div className="h-[48px] bg-[#E7E7E7] rounded-md px-3 flex items-center justify-between">
              <span className="text-[14px] text-gray-700">
                {getInlineMessage(role, orderDetail?.order_status)}
              </span>
                  {/* No special button, just a status message */}
                </div>
            )}

            {role === Role.User && orderDetail?.order_status === "To Receive" && (
                <div className="h-[48px] bg-[#E7E7E7] rounded-md px-3 flex items-center justify-between">
              <span className="text-[14px] text-gray-700">
                {getInlineMessage(role, orderDetail?.order_status)}
              </span>
                  <button
                      className="text-[14px] text-white bg-[#53D94F] rounded-md px-4 py-2 m-1"
                      onClick={() => updateStatusHandler(order_id)}
                  >
                    Order Received
                  </button>
                </div>
            )}

            {/* After 'Received', generally no button for both roles, so no extra bar. */}

          </div>

          {/* Delivery Address + Product Ordered Section */}
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
