import { useLocation } from "react-router-dom";
import DashBoardBlackLogo from "../../assets/navbar/dashboard-black.svg";
import DashBoardWhiteLogo from "../../assets/navbar/dashboard-white.svg";
import AllProductBlackLogo from "../../assets/navbar/all-product-black.svg";
import AllProductWhiteLogo from "../../assets/navbar/all-product-white.svg";
import OrderListBlackLogo from "../../assets/navbar/document-black.svg";
import OrderListWhiteLogo from "../../assets/navbar/document-white.svg";
import ChevlonUpBlackLogo from "../../assets/navbar/chevron_up_black.svg";
import ChevlonUpWhiteLogo from "../../assets/navbar/chevron_up_white.svg";
import NavItem from "./NavItem.tsx";

function BottomNavBar() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    // Define navigation items
    const navItems = [
        {
            to: "/dashboard",
            label: "Dashboard",
            blackIcon: DashBoardBlackLogo,
            whiteIcon: DashBoardWhiteLogo,
        },
        {
            to: "/",
            label: "All Products",
            blackIcon: AllProductBlackLogo,
            whiteIcon: AllProductWhiteLogo,
        },
        {
            to: "/order-list",
            label: "Order List",
            blackIcon: OrderListBlackLogo,
            whiteIcon: OrderListWhiteLogo,
        },
        {
            to: "/categories",
            label: "Categories",
            blackIcon: ChevlonUpBlackLogo,
            whiteIcon: ChevlonUpWhiteLogo,
        },
    ];

    return (
        <div className="sticky top-[64px] bg-gray-300 p-3 shadow-md z-50">
            <div className="flex items-center space-x-4">
                {navItems.map((item) => (
                    <NavItem
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        blackIcon={item.blackIcon}
                        whiteIcon={item.whiteIcon}
                        isActive={isActive(item.to)}
                    />
                ))}
            </div>
        </div>
    );
}

export default BottomNavBar;