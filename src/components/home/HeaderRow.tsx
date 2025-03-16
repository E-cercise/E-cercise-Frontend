import {HeaderRowProps} from "../../interfaces/Home.ts";
import {Role} from "../../enum/Role.ts";
import React from "react";
import {FaPlus} from "react-icons/fa";

const HeaderRow: React.FC<HeaderRowProps> = ({ role, title }) => {
    return (
        <div className="flex items-center justify-between mb-3 px-5">
            <p className="text-lg font-bold">
                {title}
            </p>

            {role === Role.Admin && (
                <button
                    className="
            flex items-center gap-2
            px-4 py-2
            rounded-md
            bg-[#2F2F2F]
            text-white
            font-semibold
          "
                >
          <span
              className="
              flex items-center justify-center
              w-5 h-5
              border border-white
              rounded-full
            "
          >
            <FaPlus className="w-3 h-3" />
          </span>
                    <span>ADD NEW PRODUCT</span>
                </button>
            )}
        </div>
    )
}

export default HeaderRow