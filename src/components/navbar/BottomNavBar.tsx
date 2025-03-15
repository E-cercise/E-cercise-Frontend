import { useLocation } from "react-router-dom";
import NavItem from "./NavItem.tsx";
import DashboardIcon from "../Icon/DashboardIcon.tsx";
import AllProductIcon from "../Icon/AllProductIcon.tsx";
import DocumentIcon from "../Icon/DocumentIcon.tsx";
import ChevlonUpIcon from "../Icon/ChevlonUpIcon.tsx";

function BottomNavBar() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { to: "/dashboard", label: "Dashboard", Icon: DashboardIcon },
        { to: "/", label: "All Products", Icon: AllProductIcon },
        { to: "/orders", label: "Order List", Icon: DocumentIcon },
        { to: "/categories", label: "Categories", Icon: ChevlonUpIcon },
    ];

    return (
        <div className="sticky top-[64px] bg-gray-300 px-4 py-2 shadow-md z-50">
            <div className="flex items-center space-x-6 text-sm">
                {navItems.map((item) => (
                    <NavItem
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        Icon={item.Icon}
                        isActive={isActive(item.to)}
                    />
                ))}
            </div>
        </div>
    );
}

export default BottomNavBar;