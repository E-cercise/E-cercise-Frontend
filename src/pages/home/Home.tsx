// src/pages/home/Home.tsx
import React, { useState, useEffect } from "react"
import NavBar from "../../components/navbar/NavBar.tsx"
import { Pagination, Spin } from "antd"
import { filteredEquipment } from "../../api/equipment/FilteredEquipment.ts"
import { equipmentDetail } from "../../api/equipment/EquipmentDetail.ts"
import { addEquipmentToCart } from "../../api/cart/AddEquipmentToCart.ts"
import { EquipmentDetailResponse, FilteredEquipmentResponse } from "../../interfaces/Equipment.ts"
import { useAuth } from "../../hook/UseAuth.tsx"
import { Role } from "../../enum/Role.ts"
import SearchIcon from "../../assets/home/search.png"
import EquipmentCard from "../../components/home/EquipmentCard.tsx";
import {useNavigate} from "react-router-dom";
import HeaderRow from "../../components/HeaderRow/HeaderRow.tsx";

const Home: React.FC = () => {
    const [equipmentId, setEquipmentId] = useState<number>(-1)
    const [titleHover, setTitleHover] = useState<boolean>(false)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [searchKeyword, setSearchKeyword] = useState<string>("")
    const [muscleGroup, setMuscleGroup] = useState<string>("")
    const [filteredEquipments, setFilteredEquipments] = useState<FilteredEquipmentResponse>()
    const [tempState, setTempState] = useState<boolean>(false)
    const navigate = useNavigate()

    const { role } = useAuth()
    const pageSize = 50
    const headingText = role === Role.Admin ? "All Equipments" : "Sport Gym Equipment"

    const fetchEquipments = async () => {
        try {
            const res = await filteredEquipment(searchKeyword, muscleGroup, currentPage, pageSize)
            setFilteredEquipments(res)
            setTempState(true)
            console.log(res)
        } catch (err) {
            console.error(err)
        }
    }

    const getEquipmentDetail = async (id: string) => {
        try {
            return await equipmentDetail(id)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchEquipments()
    }, [searchKeyword, muscleGroup, currentPage])


    const renderEquipmentGrid = () => {
        if (!filteredEquipments?.equipments.equipments) return null

        const equipmentArray = filteredEquipments.equipments.equipments
        if (!Array.isArray(equipmentArray)) return null

        const displayed = equipmentArray.slice(0, pageSize)

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
                        onAddToCart={async (eqId) => {
                            const detail: EquipmentDetailResponse | undefined = await getEquipmentDetail(eqId)
                            if (detail?.option?.length) {
                                await addEquipmentToCart(eqId, detail.option[0].id, 1 , navigate)
                            }
                        }}
                    />
                ))}
            </div>
        )
    }

    const renderNoResultsOrLoading = () => {
        if (!tempState) {
            return (
                <div className="w-full h-[85vh] flex items-center justify-center">
                    <Spin size="large" />
                </div>
            )
        }
        return (
            <div className="flex flex-col items-center justify-center w-full h-[84.5vh] bg-[#D9D9D9] rounded-md space-y-2">
                <img src={SearchIcon} alt="Search icon" width={80} />
                <p className="text-lg font-semibold">No equipments match your search</p>
                <p className="text-md font-semibold">
                    Nothing found for &laquo;{searchKeyword}&raquo;
                </p>
            </div>
        )
    }

    return (
        <div>
            <NavBar
                setSearchKeyword={setSearchKeyword}
                setMuscleGroup={setMuscleGroup}
                setCurrentPage={setCurrentPage}
            />

            <div className="h-full pt-3 pb-3 pl-5 pr-5">
                <HeaderRow role={role} title={headingText} />

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
    )
}

export default Home
