import React, {useEffect, useState} from "react";
import {Form, Tag } from "antd";
import { backAttributes, frontAttributes } from "../muscles/muscles";
import MuscleFrontImage from "../../assets/navbar/muscles-front-image.png";
import MuscleBackImage from "../../assets/navbar/muscles-back-image.png";

interface MuscleGroupFormProps {
    value?: string[]; // array of muscle IDs
    onChange?: (value: string[]) => void;
}

const MuscleGroupForm: React.FC<MuscleGroupFormProps> = ({   value = [],
                                                             onChange}) => {
    const [activePath, setActivePath] = useState<string>("");

    const selectedMuscles = value;

    const toggleMuscle = (id: string) => {
        let newSelected: string[];
        if (selectedMuscles.includes(id)) {
            newSelected = selectedMuscles.filter((m) => m !== id);
        } else {
            newSelected = [...selectedMuscles, id];
        }
        if (onChange) onChange(newSelected);
    };

    return (
        <div>
            <div style={{ marginBottom: "1rem" }}>
                <strong>Selected Muscles:</strong>
                <div style={{ marginTop: 8 }}>
                    {selectedMuscles.map((id) => {
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
                    })}
                </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
                <svg width="250px" height="400px" viewBox="0 0 600 980">
                    <image href={MuscleFrontImage} width="600" height="980" />
                    {frontAttributes.map((element) => {
                        const id = element.id;
                        const isSelected = selectedMuscles.includes(id);
                        return (
                            <path
                                key={id}
                                d={element.d}
                                fillOpacity={activePath === id || isSelected ? "0.8" : "0"}
                                strokeOpacity="1"
                                cursor="pointer"
                                onMouseEnter={() => setActivePath(id)}
                                onMouseLeave={() => setActivePath("")}
                                onClick={() => toggleMuscle(id)}
                                style={{
                                    fill:
                                        activePath === id || isSelected
                                            ? "rgba(231, 89, 99, 0.5)"
                                            : "rgb(253, 88, 88)",
                                }}
                            />
                        );
                    })}
                </svg>

                <svg width="250px" height="400px" viewBox="0 0 600 980">
                    <image href={MuscleBackImage} width="600" height="980" />
                    {backAttributes.map((element) => {
                        const id = element.id;
                        const isSelected = selectedMuscles.includes(id);
                        return (
                            <path
                                key={id}
                                d={element.d}
                                fillOpacity={activePath === id || isSelected ? "0.8" : "0"}
                                strokeOpacity="1"
                                cursor="pointer"
                                onMouseEnter={() => setActivePath(id)}
                                onMouseLeave={() => setActivePath("")}
                                onClick={() => toggleMuscle(id)}
                                style={{
                                    fill:
                                        activePath === id || isSelected
                                            ? "rgba(231, 89, 99, 0.5)"
                                            : "rgb(253, 88, 88)",
                                }}
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default MuscleGroupForm;
