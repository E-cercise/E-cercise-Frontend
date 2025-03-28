import {useLocation} from "react-router-dom";
import NavItem from "./NavItem.tsx";
import AllProductIcon from "../Icon/AllProductIcon.tsx";
import DocumentIcon from "../Icon/DocumentIcon.tsx";

function BottomNavBar() {
    const location = useLocation();

    const isActive = (paths: string[]) => paths.includes(location.pathname);

    const navItems = [
        {to: "/", label: "All Products", Icon: AllProductIcon, includePath: ["/", "/equipment/add"]},
        {to: "/orders/admin", label: "Order List", Icon: DocumentIcon, includePath: ["/orders"]},
    ];

    return (
        <div className="sticky top-[64px] bg-gray-300 px-4 py-2 shadow-md z-[999]">
            <div className="flex items-center space-x-6 text-sm">
                {navItems.map((item) => (
                    <NavItem
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        Icon={item.Icon}
                        isActive={isActive(item.includePath)}
                    />
                ))}
            </div>
        </div>
    );
}

export default BottomNavBar;