import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./NavBar.css";
import {NavItemProps} from "../../interfaces/Navbar.ts";
const NavItem: React.FC<NavItemProps> = ({ to, label, Icon, isActive }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link to={to}>
            <Button
                className={`h-7 text-sm font-bold flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                        ? "bg-blue-500 text-white"
                        : isHovered
                            ? "bg-blue-100 text-blue-500"
                            : "bg-white text-black hover:bg-blue-100 hover:text-blue-500"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Icon
                    className={`w-5 h-5 ${
                        isActive
                            ? "fill-white stroke-white"
                            : isHovered
                                ? "fill-blue-500 stroke-blue-500"
                                : "fill-black stroke-black"
                    }`}
                />
                <span className="text-[13px]">{label}</span>
            </Button>
        </Link>
    );
};

export default NavItem;