import {Divider, Select} from "antd";
import NavBar from "../../components/navbar/NavBar.tsx";
import Dumbbells1 from "../../assets/test/comparison/image 16.png";
import Dumbbells2 from "../../assets/test/comparison/image 17.png";
import Dumbbells3 from "../../assets/test/comparison/image 18.png";
import { getEquipmentCategory } from "../../api/equipment/EquipmentCategory.ts";
import { useEffect, useState } from "react";

function Comparison() {
    const [categories, setCategories] = useState([]);

    console.log(categories);

    const handleCategoryChange = (value: string) => {
        console.log(value);
    };

    const equipmentCategory = async () => {
        getEquipmentCategory()
            .then((data) => {
                setCategories(data.categories);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    const get 

    useEffect(() => {
        equipmentCategory();
    }, [])

    return (
        <div>
            <NavBar/>
            <div className="flex flex-col items-center space-y-5">
                <p className="text-[22px] font-bold pt-5">Compare Equipments</p>
                <Select
                    defaultValue="dumbbell"
                    onChange={(value: any) => handleCategoryChange(value)}
                    className="w-[220px] h-[48px]"
                    options={categories}
                />
                <p className="text-[#0B8AE5]">Shop Equipments {">"}</p>
                <div className="flex justify-center space-x-[80px]">
                    <div className="flex flex-col items-center space-y-5">
                        <Select
                            defaultValue="Adjustable Weights Dumbbells Set, 20/30/40/60/80lbs Non-Rolling Adjustable Dumbbell Set, Free Weights Dumbbells Set Hexagon, Weights Set for Home Gym"
                            className="w-[220px] h-[48px]"
                            options={[
                                {
                                    value: 1,
                                    label: "Adjustable Weights Dumbbells Set, 20/30/40/60/80lbs Non-Rolling Adjustable Dumbbell Set, Free Weights Dumbbells Set Hexagon, Weights Set for Home Gym"
                                }
                            ]}
                        />
                        <div className="flex flex-col justify-center h-[200px]">
                            <img src={Dumbbells1} alt="" className="w-[200px]"/>
                        </div>
                        <Divider style={{borderColor: "#8C8C8C"}}/>
                        <button className="bg-[#0B8AE5] text-[15px] text-white w-[50px] rounded-xl">Buy</button>
                        <div className="text-[14px]">
                            Show equipment's details
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-5">
                        <Select
                            defaultValue="Bowflex SelectTech 552 Adjustable Dumbbells"
                            className="w-[220px] h-[48px]"
                            options={[
                                {value: 2, label: "Bowflex SelectTech 552 Adjustable Dumbbells"}
                            ]}
                        />
                        <div className="flex flex-col justify-center h-[200px]">
                            <img src={Dumbbells2} alt="" className="w-[200px]"/>
                        </div>
                        <Divider style={{borderColor: "#8C8C8C"}}/>
                        <button className="bg-[#0B8AE5] text-[15px] text-white w-[50px] rounded-xl">Buy</button>
                        <div className="text-[14px]">
                            Show equipment's details
                        </div>
                    </div>
                    <div className="flex flex-col items-center space-y-5">
                        <Select
                            defaultValue="Yes4All Old School Adjustable Dumbbell Set with Weight Plates, Star Lock Collars/Connector, 40lbs to 200lbs Adjustable Weight Plates Set"
                            className="w-[220px] h-[48px]"
                            options={[
                                {
                                    value: 3,
                                    label: "Yes4All Old School Adjustable Dumbbell Set with Weight Plates, Star Lock Collars/Connector, 40lbs to 200lbs Adjustable Weight Plates Set"
                                }
                            ]}
                        />
                        <div className="flex flex-col justify-center h-[200px]">
                            <img src={Dumbbells3} alt="" className="w-[200px]"/>
                        </div>
                        <Divider style={{borderColor: "#8C8C8C"}}/>
                        <button className="bg-[#0B8AE5] text-[15px] text-white w-[50px] rounded-xl">Buy</button>
                        <div className="text-[14px]">
                            Show equipment's details
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comparison;
