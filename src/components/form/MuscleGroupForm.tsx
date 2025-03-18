import React, { useState } from "react";
import { Tag } from "antd";
import { backAttributes, frontAttributes } from "../muscles/muscles";
import MuscleFrontImage from "../../assets/navbar/muscles-front-image.png";
import MuscleBackImage from "../../assets/navbar/muscles-back-image.png";

interface MuscleGroupFormProps {
    value?: string[];
    onChange?: (value: string[]) => void;
}

const MuscleGroupForm: React.FC<MuscleGroupFormProps> = ({ value = [], onChange }) => {
    const [activePath, setActivePath] = useState<string>("");

    const toggleMuscle = (id: string) => {
        const newSelected = value.includes(id) ? value.filter((m) => m !== id) : [...value, id];
        onChange && onChange(newSelected);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex gap-4 items-start">
                <div className="border border-blue-500">
                    <svg width="220px" height="350px" viewBox="0 0 600 980" className="cursor-pointer">
                        <image href={MuscleFrontImage} width="600" height="980" />
                        {frontAttributes.map((element) => {
                            const isSelected = value.includes(element.id);
                            return (
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
                            );
                        })}
                    </svg>
                </div>

                <div>
                    <svg width="220px" height="350px" viewBox="0 0 600 980" className="cursor-pointer">
                        <image href={MuscleBackImage} width="600" height="980" />
                        {backAttributes.map((element) => {
                            const isSelected = value.includes(element.id);
                            return (
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
                            );
                        })}
                    </svg>
                </div>

                <div className="flex-1">
                    <label className="text-sm font-medium text-black">select muscle:</label>
                    <div className="border border-gray-300 p-2 rounded-md min-h-[100px] w-[400px] bg-white">
                        {value.length > 0 ? (
                            value.map((id) => {
                                const muscle =
                                    frontAttributes.find((m) => m.id === id) ||
                                    backAttributes.find((m) => m.id === id);
                                return (
                                    muscle && (
                                        <Tag key={id} closable onClose={() => toggleMuscle(id)}>
                                            {muscle.name}
                                        </Tag>
                                    )
                                );
                            })
                        ) : (
                            <span>No muscle selected</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MuscleGroupForm;