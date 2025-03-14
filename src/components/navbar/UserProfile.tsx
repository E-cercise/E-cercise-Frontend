import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Avatar, Dropdown} from "antd";
import {UserOutlined} from "@ant-design/icons";
import {UserProfileProps} from "../../interfaces/Navbar.ts";


const UserProfile: React.FC<UserProfileProps> = ({userId, name, logout}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const menuItems = [
        ...(userId === null
            ? [
                {label: "Sign Up", key: "signup"},
                {label: "Login", key: "login"},
            ]
            : [
                {
                    key: "user_info",
                    label: (
                        <div style={{ lineHeight: "1.2", pointerEvents: "none" }}>
                            <strong>{name || "Unknown User"}</strong>
                            <br />
                            <small>ID: {userId}</small>
                        </div>
                    ),
                    className: "noHoverItem",
                    onClick: (info: { domEvent: { stopPropagation: () => void; preventDefault: () => void; }; }) => {
                        info.domEvent.stopPropagation();
                        info.domEvent.preventDefault();
                    },
                },
                {type: "divider" as const},
                {label: "Profile", key: "profile"},
                {label: "Logout", key: "logout"},
            ]),
    ];

    const handleMenuClick = ({key}: { key: string }) => {
        switch (key) {
            case "profile":
                navigate("/profile");
                break;
            case "logout":
                logout();
                break;
            case "signup":
                navigate("/signup");
                break;
            case "login":
                navigate("/login");
                break;
            default:
                break;
        }
        setMenuOpen(false);
    };
    return (
        <Dropdown
            menu={{items: menuItems, onClick: handleMenuClick}}
            open={menuOpen}
            onOpenChange={setMenuOpen}
            arrow={false}
            trigger={["click"]}
        >
            <Avatar
                style={{backgroundColor: "#87d068", cursor: "pointer"}}
                icon={<UserOutlined/>}
            />
        </Dropdown>
    );
};

export default UserProfile;
