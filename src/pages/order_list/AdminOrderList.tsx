import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hook/UseAuth.ts";
import { Table, Tag, Image, Typography, Space, Row, Col, Select } from "antd";
import NavBar from "../../components/navbar/NavBar.tsx";
import { getOrderList } from "../../api/order/GetOrderList.ts";
import { FirstLineEquipment, Order } from "../../interfaces/Order.ts";

const { Text } = Typography;

function AdminOrderList() {
  // const {role} = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderIDs, setOrderIDs] = useState<{ key: string, value: string }[]>([]);
  const [userIDs, setUserIDs] = useState<{ key: string, value: string }[]>([]);
  const [orderStatus, setOrderStatus] = useState("");
  const [tempOrderStatus, setTempOrderStatus] = useState("");
  const [userID, setUserID] = useState("");
  const [tempUserID, setTempUserID] = useState("");
  const [orderID, setOrderID] = useState("");
  const [tempOrderID, setTempOrderID] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [tempPaymentType, setTempPaymentType] = useState("");
  const navigate = useNavigate();

  const fetchOrders = (
    orderStatus: string,
    userId: string,
    orderId: string,
    paymentType: string
  ) => {
    getOrderList(orderStatus, userId, orderId, paymentType)
      .then((response) => {
        console.log(response.orders)
        setOrders(response.orders || []);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchUserIDs = () => {
    getOrderList("", "", "", "")
      .then((response) => {
        console.log(response.orders)
        const uniqueUserIDs = Array.from(
            new Set(orders.map((order: Order) => order.user_id))
          ).map((id) => ({ key: id, value: id }));
        setUserIDs(uniqueUserIDs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchOrderIDs = () => {
    getOrderList("", "", "", "")
      .then((response) => {
        console.log(response.orders)
        const orderIDs = response.orders.length != 0 ? response.orders.map((order: Order) => ({ key: order.id, value: order.id })) : []
        setOrderIDs(orderIDs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      width: 100,
      ellipsis: true,
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      width: 100,
      ellipsis: true,
    },
    {
      title: "Equipment",
      dataIndex: "first_line_equipment",
      key: "equipment",
      width: 280,
      render: (equipment: FirstLineEquipment) => (
        <Space size="small">
          <Image
            width={50}
            height={50}
            src={equipment?.img_url}
            alt={equipment?.name}
            style={{ objectFit: "cover", borderRadius: 8 }}
            preview={false}
          />
          <Text className="text-[12px]">{equipment?.name}</Text>
        </Space>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (price: number) =>
        <Text className="text-[12px]">฿ {price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>,
    },
    {
      title: "Payment Type",
      dataIndex: "payment_type",
      key: "payment_type",
      width: 150,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          Cash: "green",
          QRPromptPay: "geekblue",
          CreditOrDebitCard: "purple",
        };
        return <Tag color={colorMap[type] || "default"}>{type}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "order_status",
      key: "order_status",
      width: 100,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          Placed: "blue",
          Paid: "green",
          "Shipped Out": "geekblue",
          "To Receive": "orange",
          Received: "purple",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => {
        return <Text className="text-[12px]">{date}</Text>;
      },
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => {
        return <Text className="text-[12px]">{date}</Text>;
      },
    },
  ];

  useEffect(() => {
    fetchUserIDs();
    fetchOrderIDs();
    fetchOrders(orderStatus, userID, orderID, paymentType);
  }, [orderStatus, userID, orderID, paymentType]);

  return (
    <div>
      <NavBar />
      <div className="px-[2rem] py-[1rem]">
        <Typography.Title level={3}>Order List</Typography.Title>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Select
              allowClear
              placeholder="Filter by Order Status"
              style={{ width: 200 }}
              onChange={(value) => setTempOrderStatus(value)}
              options={[
                { key: "Placed", value: "Placed" },
                { key: "Paid", value: "Paid" },
                { key: "Shipped Out", value: "Shipped Out" },
                { key: "To Receive", value: "To Receive" },
                { key: "Received", value: "Received" },
              ]}
            />
          </Col>
          <Col>
            <Select
              allowClear
              placeholder="Filter by User ID"
              style={{ width: 200 }}
              onChange={(value) => setTempUserID(value)}
              options={userIDs}
            />
          </Col>
          <Col>
            <Select
              allowClear
              placeholder="Filter by Order ID"
              style={{ width: 200 }}
              onChange={(value) => setTempOrderID(value)}
              options={orderIDs}
            />
          </Col>
          <Col>
            <Select
              allowClear
              placeholder="Filter by Payment Type"
              style={{ width: 200 }}
              onChange={(value) => setTempPaymentType(value)}
              options={[
                { key: "QRPromptPay", value: "QRPromptPay" },
                { key: "Cash", value: "Cash" },
                { key: "CreditOrDebitCard", value: "CreditOrDebitCard" },
              ]}
            />
          </Col>
          <Col>
            <button
              className="flex items-center gap-2 px-4 py-[5.5px] rounded-md bg-[#2F2F2F] text-white font-semibold"
              onClick={() => {
                setOrderStatus(tempOrderStatus);
                setUserID(tempUserID);
                setOrderID(tempOrderID);
                setPaymentType(tempPaymentType);
              }}
            >
              <span>Filter</span>
            </button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => navigate(`/order-tracking/?order_id=${record.id}`),
            style: { cursor: "pointer" }
          })}
        />
      </div>
    </div>
  );
}

export default AdminOrderList;
