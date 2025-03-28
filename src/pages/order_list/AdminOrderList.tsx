import { useEffect, useState } from "react";
import { useAuth } from "../../hook/UseAuth.ts";
import { Table, Tag, Image, Typography, Space } from "antd";
import NavBar from "../../components/navbar/NavBar.tsx";
import { getOrderList } from "../../api/order/GetOrderList.ts";

const { Text } = Typography;

function AdminOrderList() {
    const {role} = useAuth();

    const [orders, setOrders] = useState([]);

    const fetchOrders = (orderStatus?: string, userId?: string, orderId?: string, paymentType?: string) => {
        getOrderList(orderStatus, userId, orderId, paymentType)
          .then((response) => {
            setOrders(response.orders || []);
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
          title: "Equipment",
          dataIndex: "first_line_equipment",
          key: "equipment",
          width: 280,
          render: (equipment: any) => (
            <Space size="small">
              <Image
                width={60}
                height={60}
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
          render: (price: number) => `฿ ${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
        },
        {
          title: "Payment Type",
          dataIndex: "payment_type",
          key: "payment_type",
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
              Received: "purple"
            };
            return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
          },
        },
        {
          title: "Created At",
          dataIndex: "created_at",
          key: "created_at",
          render: (date: any) => {
            return <Text className="text-[12px]">{date}</Text>
          },
        },
        {
          title: "Updated At",
          dataIndex: "updated_at",
          key: "updated_at",
          render: (date: any) => {
            return <Text className="text-[12px]">{date}</Text>
          },
        },
      ];

    useEffect(() => {
        fetchOrders()
    }, [])

    return <div>
        <NavBar/>
        <div style={{ padding: "2rem" }}>
        <Typography.Title level={3}>Order List</Typography.Title>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      </div>

    </div>
}

export default AdminOrderList;