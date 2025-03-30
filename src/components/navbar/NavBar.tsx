import React, {useEffect, useState} from "react";
import {Button, Input, Popover, Tag} from "antd";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {FiFilter} from "react-icons/fi";
import {IoIosArrowDown} from "react-icons/io";
import ECerciseLogo from "../../assets/navbar/E-Cercise-Logo.png";
import ComparisonLogo from "../../assets/navbar/Comparison-Logo.png";
import Cart from "../../assets/navbar/Cart.png";
import {backAttributes, frontAttributes} from "../muscles/muscles";
import "./NavBar.css";
import {useAuth} from "../../hook/UseAuth.ts";
import BottomNavBar from "./BottomNavBar.tsx";
import {Role} from "../../enum/Role.ts";
import UserProfile from "./UserProfile.tsx";

function NavBar() {
    const [activePath, setActivePath] = useState<string>("");
    const [, setShowPopOver] = useState<boolean>(false);
    const [, setShowMusclesPopover] = useState<boolean>(false);
    const [tempKeyword, setTempKeyword] = useState<string>("");
    // const [clickedMuscles, setClickedMuscles] = useState<string[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [clickedMuscles, setClickedMuscles] = useState<string[]>(
        (searchParams.get("muscles") || "").split(",").filter(Boolean)
    );
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const {userId, name, role, logout} = useAuth()

    const handleMouseEnter = (id: any) => {
        setActivePath(id);
    };

    const handleMouseLeave = () => {
        setActivePath("");
    };

    const handleKeywordOnChange = (keyword: string) => {
        setTempKeyword(keyword); // Store typed input but don't trigger search yet
    };

    // const handleSearchClick = () => {
    //     // setSearchKeyword(tempKeyword);
    //     const newParams = new URLSearchParams(searchParams);
    //     if (tempKeyword.trim() === "") {
    //         newParams.delete("search");
    //         newParams.set("page", "1");
    //         setSearchParams(newParams);
    //     } else {
    //         newParams.set("search", tempKeyword);
    //         newParams.set("page", "1"); // reset page on new search
    //         // setSearchParams(newParams);
    //         if (location.pathname !== "/") {
    //             navigate({
    //                 pathname: "/",
    //                 search: `?${newParams.toString()}`,
    //             });
    //         } else {
    //             setSearchParams(newParams);
    //         }
    //     }
    // };

    const handleSearchClick = () => {
        const newParams = new URLSearchParams(searchParams);
        const keyword = tempKeyword.trim();
    
        if (keyword) {
            newParams.set("search", keyword);
        } else {
            newParams.delete("search");
        }
    
        newParams.set("page", "1");
    
        const sortedQuery = sortParamsWithPageLast(newParams);
    
        if (location.pathname !== "/") {
            navigate({
                pathname: "/",
                search: `?${sortedQuery}`,
            });
        } else {
            setSearchParams(new URLSearchParams(sortedQuery));
        }
    };

    const handleShowPopOver = (value: boolean) => {
        setShowPopOver(value);
    };

    const handleShowMusclesPopover = (value: boolean) => {
        setShowMusclesPopover(value);
    };

    const handleClickedMuscles = (id: string) => {
        // if (!clickedMuscles.includes(id)) {
        //     clickedMuscles.push(id);
        // } else {
        //     const index = clickedMuscles.indexOf(id, 0);
        //     clickedMuscles.splice(index, 1);
        // }
        const updated = clickedMuscles.includes(id)
            ? clickedMuscles.filter((m) => m !== id)
            : [...clickedMuscles, id];
        setClickedMuscles(updated);
    };

    const handleApplyMusclesFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set("muscles", clickedMuscles.join(","));
        newParams.set("page", "1");
        const sortedQuery = sortParamsWithPageLast(newParams);
        setSearchParams(new URLSearchParams(sortedQuery));
    };

    // const handleMuscleGroup = (value: string) => {
    //     setMuscleGroup(value);
    // };

    const clearAllClickedMuscles = () => {
        setClickedMuscles([]);
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("muscles");
        newParams.set("page", "1");
        setSearchParams(newParams);
    };

    // const handleCurrentPage = (value: number) => {
    //     setCurrentPage(value);
    // }

    const handleCartClick = () => {
        const token = localStorage.getItem("accessToken")
        if (token) {
            try {
                const decode: { user_id: string, expires: string } = jwtDecode(token);
                if (new Date() >= new Date(decode.expires)) {
                    localStorage.removeItem('accessToken');
                    navigate('/login');
                } else {
                    navigate("/cart")
                    console.log('token is not expired');
                }
            } catch (err) {
                console.error("Invalid token", err);
                localStorage.removeItem("accessToken");
                navigate("/login");
            }
        } else {
            navigate("/login")
        }
    }

    const sortParamsWithPageLast = (params: URLSearchParams): string => {
        const entries = Array.from(params.entries());
        const filtered = entries.filter(([key]) => key !== "page");
        const pageEntry = entries.find(([key]) => key === "page");
    
        const sorted = [...filtered];
        if (pageEntry) { 
            sorted.push(pageEntry)
        };
        return new URLSearchParams(sorted).toString();
    };

    useEffect(() => {
        const currentSearch = searchParams.get("search") || "";
        setTempKeyword(currentSearch);
    }, [searchParams]);

    return (
        <>
            <div className="flex items-center bg-[#2D2A32] p-2 space-x-10 sticky top-0 z-[999]">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <div className="flex items-center space-x-4 ml-4 cursor-pointer">
                        <img src={ECerciseLogo} alt="E-Cercise Logo" className="h-14 ml-4"/>
                    </div>
                </Link>
                <Input.Search
                    allowClear
                    value={tempKeyword}
                    placeholder="Search"
                    className="absolute left-[180px] w-[35vw] transition-shadow hover:shadow-md"
                    onChange={(e) => handleKeywordOnChange(e.target.value)}
                    onSearch={() => {
                        handleSearchClick();
                        // handleCurrentPage(1);
                    }}
                />
                {isHomePage && (
                    <Popover
                        onOpenChange={() => handleShowMusclesPopover(true)}
                        placement="bottom"
                        content={
                            <div className="">
                                <div className="flex items-center space-x-2">
                                    <span className="">Filtered Muscles:</span>
                                    <div className="flex items-center flex-wrap w-[400px] space-x-2">
                                        {clickedMuscles.map((id: string) => {
                                            const frontIndex = frontAttributes.findIndex(
                                                (obj) => obj.id === id
                                            );
                                            const backIndex = backAttributes.findIndex(
                                                (obj) => obj.id === id
                                            );

                                            if (frontIndex > -1) {
                                                return (
                                                    <Tag
                                                        key={id}
                                                        closable
                                                        onClose={() => handleClickedMuscles(id)}
                                                    >
                                                        {frontAttributes[frontIndex].name}
                                                    </Tag>
                                                );
                                            }

                                            if (backIndex > -1) {
                                                return (
                                                    <Tag
                                                        key={id}
                                                        closable
                                                        onClose={() => handleClickedMuscles(id)}
                                                    >
                                                        {backAttributes[backIndex].name}
                                                    </Tag>
                                                );
                                            }

                                            return null;
                                        })}
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="250px"
                                        height="400px"
                                        viewBox="0 0 600 980"
                                        xmlSpace="preserve"
                                    >
                                        <image
                                            href="src\assets\navbar\muscles-front-image.png"
                                            width="600"
                                            height="980"
                                        ></image>
                                        {frontAttributes.map((element, index) => {
                                            const id = `ft_${index + 1}`;
                                            return (
                                                <>
                                                    <Popover title={element.name}>
                                                        <path
                                                            key={id}
                                                            id={id}
                                                            fill="#FF0000"
                                                            stroke={"#ff8080"}
                                                            vectorEffect="non-scaling-stroke"
                                                            d={element.d}
                                                            fillOpacity={
                                                                activePath === id || clickedMuscles.includes(id)
                                                                    ? "1"
                                                                    : "0"
                                                            }
                                                            strokeOpacity="1"
                                                            cursor="pointer"
                                                            onMouseEnter={() => {
                                                                handleMouseEnter(id);
                                                                handleShowPopOver(true);
                                                            }}
                                                            onClick={() => {
                                                                handleClickedMuscles(id);
                                                            }}
                                                            style={{
                                                                fill:
                                                                    activePath === id || clickedMuscles.includes(id)
                                                                        ? "rgba(231, 89, 99, 0.5)"
                                                                        : "rgb(253, 88, 88)",
                                                            }}
                                                        />
                                                    </Popover>
                                                </>
                                            );
                                        })}
                                    </svg>
                                    <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="250px"
                                        height="400px"
                                        viewBox="0 0 600 980"
                                        xmlSpace="preserve"
                                    >
                                        <image
                                            href="src\assets\navbar\muscles-back-image.png"
                                            width="600"
                                            height="980"
                                        ></image>
                                        {backAttributes.map((element, index) => {
                                            const id = `bk_${index + 1}`;
                                            return (
                                                <>
                                                    <Popover title={element.name}>
                                                        <path
                                                            key={id}
                                                            id={id}
                                                            fill="#FF0000"
                                                            stroke={"#ff8080"}
                                                            vectorEffect="non-scaling-stroke"
                                                            d={element.d}
                                                            fillOpacity={
                                                                activePath === id || clickedMuscles.includes(id)
                                                                    ? "1"
                                                                    : "0"
                                                            }
                                                            strokeOpacity="1"
                                                            cursor="pointer"
                                                            onMouseEnter={() => {
                                                                handleMouseEnter(id);
                                                                handleShowPopOver(true);
                                                            }}
                                                            onMouseLeave={() => {
                                                                handleMouseLeave();
                                                                handleShowPopOver(false);
                                                            }}
                                                            onClick={() => {
                                                                handleClickedMuscles(id);
                                                            }}
                                                            style={{
                                                                fill:
                                                                    activePath === id || clickedMuscles.includes(id)
                                                                        ? "rgba(231, 89, 99, 0.5)"
                                                                        : "rgb(253, 88, 88)",
                                                            }}
                                                        />
                                                    </Popover>
                                                </>
                                            );
                                        })}
                                    </svg>
                                </div>
                                <div className="flow-root w-full">
                                    <div className="float-right space-x-3">
                                        <Button onClick={() => clearAllClickedMuscles()}>
                                            Clear All
                                        </Button>
                                        <Button
                                            // onClick={() => handleMuscleGroup(clickedMuscles.join(","))}
                                            onClick={() => handleApplyMusclesFilter()}
                                        >
                                            Filter
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <button
                            className="flex items-center space-x-[3px] absolute right-[420px] text-[13px] font-bold bg-[#EAEAEA] rounded-md pl-3 w-[93px] h-8
             hover:bg-[#d4d4d4] transition-colors duration-200 cursor-pointer"
                            onMouseEnter={() => handleShowMusclesPopover(true)}
                            onMouseLeave={() => handleShowMusclesPopover(false)}
                        >
                            <div className="flex items-center space-x-[3px]">
                                <span>Filter</span>
                                <FiFilter/>
                            </div>
                            <div
                                className="flex items-center justify-center bg-[#878787] rounded-md w-[28px] h-[28px] ">
                                <IoIosArrowDown size={15}/>
                            </div>
                        </button>
                    </Popover>
                )}
                {role !== Role.Admin && <>
                    <Link
                        to="/comparison"
                        className="absolute right-[200px] hover:scale-105 transition-transform duration-150 cursor-pointer"
                    >
                        <img src={ComparisonLogo} alt="Comparison Logo" className="w-[60px] h-8"/>
                    </Link>

                    <img
                        src={Cart}
                        alt="Cart Logo"
                        className="absolute right-[120px] h-9 cursor-pointer hover:scale-105 transition-transform duration-150"
                        onClick={handleCartClick}
                    />
                </>
                }

                <div className="absolute right-[40px] space-x-6">
                    <UserProfile userId={userId} name={name} logout={logout}/>
                </div>
            </div>
            {role === Role.Admin ? <BottomNavBar/> : <></>}
        </>
    );
}

export default NavBar;
