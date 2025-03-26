import {EquipmentCardProps} from "../../interfaces/Home";
import React from "react";
import {Link} from "react-router-dom";
import {FaStar, FaStarHalfAlt} from "react-icons/fa";
import {IoIosArrowDown} from "react-icons/io";
import {Role} from "../../enum/Role.ts";

const EquipmentCard: React.FC<EquipmentCardProps> = ({
                                                         equipment,
                                                         index,
                                                         equipmentId,
                                                         titleHover,
                                                         setEquipmentId,
                                                         setTitleHover,
                                                         role,
                                                         onAddToCart,
                                                         isAddingToCart = false,
                                                     }) => {
    const handleMouseEnter = () => {
        setEquipmentId(index);
        setTitleHover(true);
    };

    const handleMouseOut = () => {
        setEquipmentId(-1);
        setTitleHover(false);
    };

    return (
        <div className="w-[200px] bg-[#F2EFEF] p-4 space-y-2 rounded-md">
            <img src={equipment.image_path} alt="" className="w-full rounded-md"/>

            <p
                className={`cursor-pointer text-sm ${
                    titleHover && equipmentId === index
                        ? "text-[#DC8900]"
                        : "text-[#000000]"
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseOut={handleMouseOut}
            >
                <Link to={`/equipment/${equipment.ID}`}>{equipment.name}</Link>
            </p>

            <div className="flex items-center space-x-2">
                <div className="cursor-pointer flex items-center space-x-1">
                    <div className="flex w-[100px] space-x-1">
                        <FaStar color="#FFAA1D"/>
                        <FaStar color="#FFAA1D"/>
                        <FaStar color="#FFAA1D"/>
                        <FaStar color="#FFAA1D"/>
                        <FaStarHalfAlt color="#FFAA1D"/>
                    </div>
                    <IoIosArrowDown/>
                </div>
                <p className="text-xs text-[#31A421]">(1,046)</p>
            </div>

            <p>฿{equipment.price}</p>

            {role === Role.Admin ? (
                <div
                    className="inline-flex items-center px-2 py-1 border border-gray-300 bg-gray-100 rounded-lg text-sm whitespace-nowrap">
                    <span className="mr-2">Remaining Products</span>
                    <span className="font-bold">{equipment.remaining_product}</span>
                </div>
            ) : (
                <button
                    className="text-[12px] bg-[#F2DF09] hover:bg-[#FDDA0D] pl-3 pr-3 pt-2 pb-2 rounded-lg disabled:opacity-50"
                    onClick={() => onAddToCart(equipment.ID)}
                    disabled={isAddingToCart}
                >
                    {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>
            )}
        </div>
    );
};

export default EquipmentCard;
