import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import { Divider, Input, message, Pagination, Spin } from "antd";
import NavBar from "../../components/navbar/NavBar.tsx";
import { filteredEquipment } from "../../api/equipment/FilteredEquipment.ts";
import { equipmentDetail } from "../../api/equipment/EquipmentDetail.ts";
import { addEquipmentToCart } from "../../api/cart/AddEquipmentToCart.ts";
import {
  EquipmentDetailResponse,
  FilteredEquipmentResponse,
} from "../../interfaces/equipment/EquipmentDetail.ts";
import { useAuth } from "../../hook/UseAuth.ts";
import { Role } from "../../enum/Role.ts";
import SearchIcon from "../../assets/home/search.png";
import EquipmentCard from "../../components/home/EquipmentCard.tsx";
import HeaderRow from "../../components/headerRow/HeaderRow.tsx";

const Home: React.FC = () => {
  const [equipmentId, setEquipmentId] = useState<number>(-1);
  const [titleHover, setTitleHover] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchKeyword = searchParams.get("search") || "";
  const muscleGroup = searchParams.get("muscles") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const [filteredEquipments, setFilteredEquipments] =
    useState<FilteredEquipmentResponse>();
  const [tempMinPrice, setTempMinPrice] = useState<string>("");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>("");
  const [tempState, setTempState] = useState<boolean>(false);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { role } = useAuth();
  const pageSize = 50;
  const headingText =
    role === Role.Admin ? "All Equipments" : "Sport Gym Equipment";
  const recommendationScrollRef = useRef<HTMLDivElement>(null);
  const scrollByAmount = (amount: number) => {
    if (recommendationScrollRef.current) {
      recommendationScrollRef.current.scrollBy({
        left: amount,
        behavior: "smooth",
      });
    }
  };

  const fetchEquipments = async () => {
    try {
      const res = await filteredEquipment(
        searchKeyword,
        muscleGroup,
        currentPage,
        pageSize,
        minPrice,
        maxPrice
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

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", String(newPage));
    setSearchParams(newParams);
  };

  const handlePriceChange = () => {
    const newParams = new URLSearchParams(searchParams);

    const hasMin = tempMinPrice.trim() !== "";
    const hasMax = tempMaxPrice.trim() !== "";

    if (hasMin) {
      newParams.set("min_price", tempMinPrice.trim());
    } else {
      newParams.delete("min_price");
    }

    if (hasMax) {
      newParams.set("max_price", tempMaxPrice.trim());
    } else {
      newParams.delete("max_price");
    }

    // Always reset pagination when filters are changed
    newParams.set("page", "1");
    const sortedQuery = sortParamsWithPageLast(newParams);
    setSearchParams(new URLSearchParams(sortedQuery));
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
    fetchEquipments();
  }, [searchKeyword, muscleGroup, currentPage, minPrice, maxPrice]);

  useEffect(() => {
    if (location.pathname === "/" && searchParams.toString() === "") {
      const newParams = new URLSearchParams();
      newParams.set("page", "1");
      navigate({
        pathname: "/",
        search: `?${newParams.toString()}`,
      }, { replace: true });
    }
  }, [location.pathname, searchParams, navigate]);

  const handleAddToCart = async (eqId: string) => {
    setAddingToCartId(eqId);
    try {
      const detail: EquipmentDetailResponse | undefined =
        await getEquipmentDetail(eqId);
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
          : err?.response?.data?.message ||
            err?.message ||
            "Failed to add item to cart.";
      message.error(msg);
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
      <div
        className={`grid grid-cols-5 gap-4 w-full bg-[#D9D9D9] pt-4 pb-4 pl-3 ${
          role === Role.Admin ? "" : "pr-3"
        } rounded-md`}
      >
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
          <Spin size="large" />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center w-full h-[84.5vh] bg-[#D9D9D9] rounded-md space-y-2">
        <img src={SearchIcon} alt="Search icon" width={80} />
        <p className="text-lg font-semibold">No equipments match your search</p>
        <p className="text-md font-semibold">
          Nothing found for &laquo;{searchKeyword}&raquo;
        </p>
      </div>
    );
  };

  return (
    <div>
      <NavBar />
      <div className="flex flex-grow">
        <div className="flex-shrink-0 w-[200px] h-screen bg-zinc-800">
          <div className="pt-3 px-3 space-y-3">
            <span className="text-white text-sm">Price Range</span>
            <div className="flex items-center w-full space-x-2">
              <Input
                placeholder="฿ MIN"
                value={tempMinPrice}
                onChange={(e) => setTempMinPrice(e.target.value)}
                className="w-[75px]"
              />
              <div className="w-10 text-white border border-solid"></div>
              <Input
                placeholder="฿ MAX"
                value={tempMaxPrice}
                onChange={(e) => setTempMaxPrice(e.target.value)}
                className="w-[75px]"
              />
            </div>
            <button
              onClick={() => {
                handlePriceChange();
              }}
              className="w-full h-[25px] bg-green-500 hover:bg-green-600 text-[12px] text-white rounded-md"
            >
              Apply
            </button>
          </div>
        </div>
        <div className={`w-full h-screen pt-1 pb-3 pl-3 pr-3 overflow-y-auto`}>
          <HeaderRow role={role} title={headingText} />
          {role === Role.User && (filteredEquipments?.recommendation_equipments?.equipments?.length ?? 0) > 0 && (
              <React.Fragment>
                <Divider orientation="left" orientationMargin={"left"}>🔥 Recommended For You</Divider>
                <div className="relative w-full">
                  <button
                      onClick={() => scrollByAmount(-300)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    <LeftOutlined />
                  </button>

                  <button
                      onClick={() => scrollByAmount(300)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border shadow-md rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-100"
                  >
                    <RightOutlined />
                  </button>
                    <div
                        ref={recommendationScrollRef}
                        className="overflow-x-auto scrollbar-hide w-full"
                    >
                        <div
                            className="flex gap-4 px-3 py-4 bg-[#FFFBEA] rounded-md border border-yellow-400 w-max min-w-full"
                        >
                            {(filteredEquipments?.recommendation_equipments?.equipments ?? []).map(
                                (equipment, index) => (
                                    <div
                                        key={equipment.ID}
                                        className="bg-[#F3F3F3] rounded-md w-[180px] h-[350px] flex-shrink-0 shadow"
                                    >
                                        <EquipmentCard
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
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
              </React.Fragment>
          )}
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
                  onChange={(page) => handlePageChange(page)}
                  className="m-auto"
                />
              </div>
            </>
          ) : (
            renderNoResultsOrLoading()
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
