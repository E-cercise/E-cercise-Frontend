import React, {useEffect, useState} from "react";
import NavBar from "../../components/navbar/NavBar.tsx";
import {message, Pagination, Spin} from "antd";
import {filteredEquipment} from "../../api/equipment/FilteredEquipment.ts";
import {equipmentDetail} from "../../api/equipment/EquipmentDetail.ts";
import {addEquipmentToCart} from "../../api/cart/AddEquipmentToCart.ts";
import {EquipmentDetailResponse, FilteredEquipmentResponse,} from "../../interfaces/equipment/EquipmentDetail.ts";
import {useAuth} from "../../hook/UseAuth.ts";
import {Role} from "../../enum/Role.ts";
import SearchIcon from "../../assets/home/search.png";
import EquipmentCard from "../../components/home/EquipmentCard.tsx";
import HeaderRow from "../../components/headerRow/HeaderRow.tsx";

const Home: React.FC = () => {
    const [equipmentId, setEquipmentId] = useState<number>(-1);
    const [titleHover, setTitleHover] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [muscleGroup, setMuscleGroup] = useState<string>("");
    const [filteredEquipments, setFilteredEquipments] =
        useState<FilteredEquipmentResponse>();
    const [tempState, setTempState] = useState<boolean>(false);
    const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

    const {role} = useAuth();
    const pageSize = 50;
    const headingText =
        role === Role.Admin ? "All Equipments" : "Sport Gym Equipment";

    const fetchEquipments = async () => {
        try {
            const res = await filteredEquipment(
                searchKeyword,
                muscleGroup,
                currentPage,
                pageSize
            );
            setFilteredEquipments(res);
            setTempState(true);
        } catch (err) {
            console.error(err);
            message.error("Failed to load equipment list.");
        }
    };

    const getEquipmentDetail = async (id: string) => {
        try {
            return await equipmentDetail(id);
        } catch (err) {
            console.error(err);
            message.error("Failed to fetch equipment details.");
        }
    };

    useEffect(() => {
        fetchEquipments();
    }, [searchKeyword, muscleGroup, currentPage]);

    const handleAddToCart = async (eqId: string) => {
        setAddingToCartId(eqId);
        try {
            const detail: EquipmentDetailResponse | undefined = await getEquipmentDetail(eqId);
            if (detail?.option?.length) {
                await addEquipmentToCart(eqId, detail.option[0].id, 1);
                message.success("Added to cart!");
            } else {
                message.warning("No options available for this equipment.");
            }
        } catch (err: any) {
            const status = err?.response?.status;
            const msg =
                status === 409
                    ? "This item is already in your cart."
                    : err?.response?.data?.message || err?.message || "Failed to add item to cart.";
            message.error(msg);
            console.error(err);
        } finally {
            setAddingToCartId(null);
        }
    };

    const renderEquipmentGrid = () => {
        if (!filteredEquipments?.equipments.equipments) return null;

        const equipmentArray = filteredEquipments.equipments.equipments;
        if (!Array.isArray(equipmentArray)) return null;

        const displayed = equipmentArray.slice(0, pageSize);

        return (
            <div className="grid grid-cols-5 gap-4 w-full h-full bg-[#D9D9D9] p-4 rounded-md">
                {displayed.map((equipment, index) => (
                    <EquipmentCard
                        key={equipment.ID}
                        equipment={equipment}
                        index={index}
                        equipmentId={equipmentId}
                        titleHover={titleHover}
                        setEquipmentId={setEquipmentId}
                        setTitleHover={setTitleHover}
                        role={role}
                        onAddToCart={(eqId) => handleAddToCart(eqId)}
                        isAddingToCart={addingToCartId === equipment.ID}
                    />
                ))}
            </div>
        );
    };

    const renderNoResultsOrLoading = () => {
        if (!tempState) {
            return (
                <div className="w-full h-[85vh] flex items-center justify-center">
                    <Spin size="large"/>
                </div>
            );
        }
        return (
            <div
                className="flex flex-col items-center justify-center w-full h-[84.5vh] bg-[#D9D9D9] rounded-md space-y-2">
                <img src={SearchIcon} alt="Search icon" width={80}/>
                <p className="text-lg font-semibold">No equipments match your search</p>
                <p className="text-md font-semibold">
                    Nothing found for &laquo;{searchKeyword}&raquo;
                </p>
            </div>
        );
    };

    return (
        <div>
            <NavBar
                setSearchKeyword={setSearchKeyword}
                setMuscleGroup={setMuscleGroup}
                setCurrentPage={setCurrentPage}
            />

            <div className="h-full pt-3 pb-3 pl-5 pr-5">
                <HeaderRow role={role} title={headingText}/>

                {filteredEquipments?.equipments.equipments?.length ? (
                    <>
                        {renderEquipmentGrid()}
                        <div className="flex items-center mt-3">
                            <Pagination
                                showSizeChanger={false}
                                defaultCurrent={1}
                                total={filteredEquipments?.total_rows || 0}
                                pageSize={pageSize}
                                current={currentPage}
                                onChange={(page) => setCurrentPage(page)}
                                className="m-auto"
                            />
                        </div>
                    </>
                ) : (
                    renderNoResultsOrLoading()
                )}
            </div>
        </div>
    );
};

export default Home;
