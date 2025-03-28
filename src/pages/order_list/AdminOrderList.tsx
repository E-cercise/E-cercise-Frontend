import { useAuth } from "../../hook/UseAuth.ts";
import NavBar from "../../components/navbar/NavBar.tsx";
import { getOrderList } from "../../api/order/GetOrderList.ts";
import { useEffect } from "react";

function AdminOrderList() {
    const {role} = useAuth();


    const orders = (orderStatus?: string, userId?: string, orderId?: string, paymentType?: string) => {
        getOrderList(orderStatus, userId, orderId, paymentType)
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        orders()
    }, [])

    return <div>
        <NavBar/>
    </div>
}

export default AdminOrderList;