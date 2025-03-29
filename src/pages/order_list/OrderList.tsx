import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../hook/UseAuth.ts";
import { Table, Tag, Image, Typography, Space, Row, Col, Select, Tabs, TabsProps } from "antd";
import NavBar from "../../components/navbar/NavBar.tsx";
import { getMyOrders } from "../../api/order/GetMyOrders.ts";
import { FirstLineEquipment, Order } from "../../interfaces/Order.ts";

const { Text } = Typography;

function OrderList() {
  // const {role} = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatus, setOrderStatus] = useState("Placed");
//   const [tempOrderStatus, setTempOrderStatus] = useState("");
  const navigate = useNavigate();

  const fetchMyOrders = (
    orderStatus: string,
  ) => {
    getMyOrders(orderStatus)
      .then((response) => {
        console.log(response.orders)
        setOrders(response.orders || []);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onChange = (key: string) => {
    console.log(key);
    setOrderStatus(key);
  };
  

  const items: TabsProps['items'] = [
    {
      key: 'Placed',
      label: 'Placed',
    },
    {
      key: 'Paid',
      label: 'Paid',
    },
    {
      key: 'Shipped out',
      label: 'Shipped out',
    },
    {
      key: 'To Receive',
      label: 'To Receive',
    },
    {
      key: 'Received',
      label: 'Received',
    },
  ];

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
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
    fetchMyOrders(orderStatus);
  }, [orderStatus]);

  return (
    <div>
      <NavBar />
      <div className="px-[2rem] py-[1rem]">
        <Typography.Title level={3}>Order List</Typography.Title>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Tabs items={items} onChange={onChange} />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
          onRow={(record) => ({
            onClick: () => navigate(`/order-tracking`, { state: record.id }),
            style: { cursor: "pointer" }
          })}
        />
      </div>
    </div>
  );
}

export default OrderList;
