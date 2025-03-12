import {Link} from "react-router-dom";
import {Button} from "antd";

function BottomNavBar() {
    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-gray-300 p-3 shadow-md
      "
        >
            {/* Left side or main navigation items */}
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

            {/* Right side or user-related actions */}
            <div className="flex space-x-3">
                <Link to="/signup">
                    <Button className="text-sm font-bold">Sign Up</Button>
                </Link>
                <Link to="/login">
                    <Button className="text-sm font-bold">Login</Button>
                </Link>
            </div>
        </div>
    );
}

export default BottomNavBar;
