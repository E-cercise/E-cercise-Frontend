import {HeaderRowProps} from "../../interfaces/Home.ts";
import {Role} from "../../enum/Role.ts";
import React from "react";
import {FaPlus} from "react-icons/fa";
import {useLocation, useNavigate} from "react-router-dom";

const HeaderRow: React.FC<HeaderRowProps> = ({role, title}) => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between mb-3 mt-3 px-5">
            <p className="text-lg font-bold">
                {title}
            </p>

            {role === Role.Admin && isHomePage && (
                <button
                    className="
            flex items-center gap-2
            px-4 py-2
            rounded-md
            bg-[#2F2F2F]
            text-white
            font-semibold
          " onClick={() => navigate("/equipment/add")}
                >
          <span
              className="
              flex items-center justify-center
              w-5 h-5
              border border-white
              rounded-full
            "
          >
            <FaPlus className="w-3 h-3"/>
          </span>
                    <span>Add new equipment</span>
                </button>
            )}
        </div>
    )
}

export default HeaderRow