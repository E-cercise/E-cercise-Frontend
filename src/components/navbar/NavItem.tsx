import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./NavBar.css";


interface NavItemProps {
    to: string;
    label: string;
    blackIcon: string; // Black version of the SVG icon
    whiteIcon: string; // White version of the SVG icon (for active state)
    isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
                                             to,
                                             label,
                                             blackIcon,
                                             whiteIcon,
                                             isActive,
                                         }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Apply different classes based on state
    const iconClass = isActive
        ? "invert" // White icon for active state
        : isHovered
            ? "blue-icon" // Blue icon for hover state
            : ""; // Black icon for default state

    return (
        <Link to={to}>
            <Button
                className={`text-sm font-bold flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                        ? "bg-[#2D2A32] text-white"
                        : isHovered
                            ? "bg-blue-200 text-blue-500"
                            : "bg-white text-black hover:bg-blue-100 hover:text-blue-500"
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img src={isActive ? whiteIcon : blackIcon} alt={label} className={`w-5 h-5 ${iconClass}`} />
                <span>{label}</span>
            </Button>
        </Link>
    );
};

export default NavItem;