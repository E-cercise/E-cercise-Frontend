import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import {NavItemProps} from "../../interfaces/Navbar.ts";

const NavItem: React.FC<NavItemProps> = ({
                                             to,
                                             label,
                                             blackIcon,
                                             whiteIcon,
                                             isActive,
                                         }) => {
    return (
        <Link to={to}>
            <Button
                className={`text-sm font-bold flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black hover:bg-blue-100 hover:text-blue-500"
                }`}
            >
                <img
                    src={isActive ? whiteIcon : blackIcon}
                    alt={label}
                    className="w-5 h-5"
                />
                <span>{label}</span>
            </Button>
        </Link>
    );
};

export default NavItem;