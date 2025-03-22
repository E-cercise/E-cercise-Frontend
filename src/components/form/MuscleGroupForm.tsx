import React, {useState} from "react";
import {Button, Popover, Tag} from "antd";
import {backAttributes, frontAttributes} from "../muscles/muscles";
import MuscleFrontImage from "../../assets/navbar/muscles-front-image.png";
import MuscleBackImage from "../../assets/navbar/muscles-back-image.png";

interface MuscleGroupFormProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

const MuscleGroupForm: React.FC<MuscleGroupFormProps> = ({value = [], onChange}) => {
    const [activePath, setActivePath] = useState<string>("");
    const [, setShowPopOver] = useState<boolean>(false);

    const toggleMuscle = (id: string) => {
        const newSelected = value.includes(id)
            ? value.filter((m) => m !== id)
            : [...value, id];
        onChange && onChange(newSelected);
    };

    const clearAllMuscles = () => {
        onChange && onChange([]);
    }

    const handleMouseEnter = (id: any) => {
        setActivePath(id);
    };

    const handleShowPopOver = (value: boolean) => {
        setShowPopOver(value);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="border border-blue-500 rounded">
                        <svg
                            width="220px"
                            height="350px"
                            viewBox="0 0 600 980"
                            className="cursor-pointer"
                        >
                            <image href={MuscleFrontImage} width="600" height="980"/>
                            {frontAttributes.map((element) => {
                                const isSelected = value.includes(element.id);
                                return (
                                    <>
                                        <Popover title={element.name} className="p-0">
                                            <path
                                                key={element.id}
                                                d={element.d}
                                                fillOpacity={activePath === element.id || isSelected ? "0.7" : "0"}
                                                stroke="#ef4444"
                                                strokeWidth={1}
                                                strokeOpacity="1"
                                                className="transition duration-150 ease-in-out"
                                                onMouseEnter={() => {
                                                    handleMouseEnter(element.id);
                                                    handleShowPopOver(true);
                                                }}
                                                onMouseLeave={() => {
                                                    setActivePath("")
                                                    handleShowPopOver(false)
                                                }}
                                                onClick={() => toggleMuscle(element.id)}
                                                style={{
                                                    fill: isSelected
                                                        ? "rgba(239, 68, 68, 0.7)"
                                                        : activePath === element.id
                                                            ? "rgba(239, 68, 68, 0.3)"
                                                            : "transparent",
                                                }}
                                            />
                                        </Popover>
                                    </>
                                );
                            })}
                        </svg>
                    </div>

                    <div className="border border-blue-500 rounded">
                        <svg
                            width="220px"
                            height="350px"
                            viewBox="0 0 600 980"
                            className="cursor-pointer"
                        >
                            <image href={MuscleBackImage} width="600" height="980"/>
                            {backAttributes.map((element) => {
                                    const isSelected = value.includes(element.id);
                                    return (
                                        <>
                                            <Popover title={element.name}>
                                                <path
                                                    key={element.id}
                                                    d={element.d}
                                                    fillOpacity={activePath === element.id || isSelected ? "0.7" : "0"}
                                                    stroke="#ef4444"
                                                    strokeWidth={1}
                                                    strokeOpacity="1"
                                                    className="transition duration-150 ease-in-out"
                                                    onMouseEnter={() => setActivePath(element.id)}
                                                    onMouseLeave={() => setActivePath("")}
                                                    onClick={() => toggleMuscle(element.id)}
                                                    style={{
                                                        fill: isSelected
                                                            ? "rgba(239, 68, 68, 0.7)"
                                                            : activePath === element.id
                                                                ? "rgba(239, 68, 68, 0.3)"
                                                                : "transparent",
                                                    }}
                                                />
                                            </Popover>
                                        </>
                                    );

                                }
                            )}
                        </svg>
                    </div>
                </div>

                <div className="flex-1 border border-gray-300 p-4 rounded bg-white relative">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Selected Muscles:
                    </label>
                    {value.length > 0 ? (
                        <>
                            {value.map((id) => {
                                const muscle =
                                    frontAttributes.find((m) => m.id === id) ||
                                    backAttributes.find((m) => m.id === id);
                                return (
                                    muscle && (
                                        <Tag key={id} closable onClose={() => toggleMuscle(id)}
                                             className="mt-2 first:mt-0">
                                            {muscle.name}
                                        </Tag>
                                    )
                                );
                            })}
                            <Button type="link" danger onClick={clearAllMuscles} className="absolute top-2 right-2">
                                Clear All
                            </Button>
                        </>
                    ) : (
                        <span className="text-gray-500">No muscle selected</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MuscleGroupForm;
