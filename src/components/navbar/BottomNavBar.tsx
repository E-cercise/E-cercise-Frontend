import {Link} from "react-router-dom";
import {Button} from "antd";

function BottomNavBar() {
    return (
        <div className="sticky top-[64px] bg-gray-300 p-3 shadow-md z-50">
            <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                    <Button className="text-sm font-bold">Dashboard</Button>
                </Link>

                <Link to="/all-products">
                    <Button className="text-sm font-bold">All Products</Button>
                </Link>

                <Link to="/order-list">
                    <Button className="text-sm font-bold">Order List</Button>
                </Link>

                <Link to="/categories">
                    <Button className="text-sm font-bold">Categories</Button>
                </Link>
            </div>

        </div>
    );
}

export default BottomNavBar;
