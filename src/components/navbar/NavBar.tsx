import React, { useEffect, useState } from "react";
import { Input} from "antd";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ECerciseLogo from "/assets/navbar/E-Cercise-Logo.png";
import ComparisonLogo from "/assets/navbar/Comparison-Logo.png";
import Cart from "/assets/navbar/Cart.png";
import "./NavBar.css";
import { useAuth } from "../../hook/UseAuth.ts";
import BottomNavBar from "./BottomNavBar.tsx";
import { Role } from "../../enum/Role.ts";
import UserProfile from "./UserProfile.tsx";

function NavBar() {
  const [tempKeyword, setTempKeyword] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, name, role, logout } = useAuth();

  const handleKeywordOnChange = (keyword: string) => {
    setTempKeyword(keyword); // Store typed input but don't trigger search yet
  };

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

  const handleCartClick = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decode: { user_id: string; expires: string } = jwtDecode(token);
        if (new Date() >= new Date(decode.expires)) {
          localStorage.removeItem("accessToken");
          navigate("/login");
        } else {
          navigate("/cart");
          console.log("token is not expired");
        }
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  const sortParamsWithPageLast = (params: URLSearchParams): string => {
    const entries = Array.from(params.entries());
    const filtered = entries.filter(([key]) => key !== "page");
    const pageEntry = entries.find(([key]) => key === "page");

    const sorted = [...filtered];
    if (pageEntry) {
      sorted.push(pageEntry);
    }
    return new URLSearchParams(sorted).toString();
  };

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setTempKeyword(currentSearch);
  }, [searchParams]);

  return (
    <React.Fragment>
      <div className="flex items-center bg-[#2D2A32] p-2 space-x-10 sticky top-0 z-[999]">
        <div
          onClick={() => navigate("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center space-x-4 ml-4 cursor-pointer">
            <img
              src={ECerciseLogo}
              alt="E-Cercise Logo"
              className="h-14 ml-4"
            />
          </div>
        </div>
        <Input.Search
          allowClear
          value={tempKeyword}
          placeholder="Search"
          className="absolute left-[180px] w-[35vw] transition-shadow hover:shadow-md"
          onChange={(e) => handleKeywordOnChange(e.target.value)}
          onSearch={() => {
            handleSearchClick();
          }}
        />

        {role !== Role.Admin && (
          <>
            <Link
              to="/comparison"
              className="absolute right-[200px] hover:scale-105 transition-transform duration-150 cursor-pointer"
            >
              <img
                src={ComparisonLogo}
                alt="Comparison Logo"
                className="w-[60px] h-8"
              />
            </Link>

            <img
              src={Cart}
              alt="Cart Logo"
              className="absolute right-[120px] h-9 cursor-pointer hover:scale-105 transition-transform duration-150"
              onClick={handleCartClick}
            />
          </>
        )}

        <div className="absolute right-[40px] space-x-6">
          <UserProfile
            userId={userId}
            role={role}
            name={name}
            logout={logout}
          />
        </div>
      </div>
      {role === Role.Admin ? <BottomNavBar /> : <></>}
    </React.Fragment>
  );
}

export default NavBar;
