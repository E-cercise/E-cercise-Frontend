
import React, { useEffect, useState } from "react";
import {getEquipmentCategory} from "../../api/equipment/EquipmentCategory.ts";
import {addEquipment} from "../../api/equipment/AddEquipment.ts";
import {transformFormToPUT} from "../../helper/transformHelpers.ts";
import {EquipmentFormValues} from "../../interfaces/equipment/EquipmentForm.ts";
import {Card, notification, Spin} from "antd";
import EquipmentForm from "../equipment_form/EquipmentFormPage.tsx";

const AddEquipmentPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);

    useEffect(() => {
        const fetchCats = async () => {
            setLoadingCategories(true);
            try {
                const catRes = await getEquipmentCategory();
                const mapped = catRes.categories.map((c: any) => ({
                    label: c.label,
                    value: c.label,
                }));
                setCategories(mapped);
            } catch (error) {
                notification.error({ message: "Error fetching categories" });
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCats();
    }, []);

    const handleSubmit = async (values: EquipmentFormValues) => {
        setIsSubmitting(true);
        try {
            // Possibly transform form => the shape needed for POST
            const payload = transformFormToPUT(values);
            await addEquipment(payload);
            notification.success({ message: "Equipment added successfully!" });
            // redirect somewhere
        } catch (error) {
            notification.error({ message: "Error adding equipment" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingCategories) return <Spin tip="Loading categories..." />;

    return (
        <Card>
            <EquipmentForm
                mode="create"
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                loadingCategories={loadingCategories}
                categories={categories}
            />
        </Card>
    );
};

export default AddEquipmentPage;