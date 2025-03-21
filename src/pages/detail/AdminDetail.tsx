import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {EquipmentFormMode, EquipmentFormValues} from "../../interfaces/equipment/EquipmentForm.ts";
import {transformFormToPUT, transformGETtoForm} from "../../helper/transformHelpers.ts";
import {equipmentDetail} from "../../api/equipment/EquipmentDetail.ts";
import {getEquipmentCategory} from "../../api/equipment/EquipmentCategory.ts";
import {Button, Card, notification, Spin} from "antd";
import {updateEquipment} from "../../api/equipment/UpdateEquipmentDetail.ts";
import {EditOutlined} from "@ant-design/icons";
import EquipmentForm from "../equipment_form/EquipmentFormPage.tsx";

const EquipmentDetailAndUpdatePage: React.FC = () => {
    const { id } = useParams(); // equipment ID from URL param
    const [loading, setLoading] = useState(true);
    const [initialValues, setInitialValues] = useState<Partial<EquipmentFormValues>>({});
    const [mode, setMode] = useState<EquipmentFormMode>("view");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // We'll store the fetched categories in a state array
    const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // We'll also keep the "oldData" (the raw data from GET) if we need it for transformFormToPUT
    const [oldData, setOldData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1) Fetch categories for the select box
                setLoadingCategories(true);
                const categoriesResponse = await getEquipmentCategory();
                const mappedCategories = categoriesResponse.categories.map((cat: any) => ({
                    label: cat.label,
                    value: cat.label,
                }));
                setCategories(mappedCategories);
                setLoadingCategories(false);

                // 2) Fetch the existing equipment detail
                const detailData = await equipmentDetail(id!);
                setOldData(detailData);

                // Transform from the GET shape into the shape your EquipmentForm expects
                const formData = transformGETtoForm(detailData);
                setInitialValues(formData);
            } catch (error) {
                notification.error({ message: "Error fetching detail" });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    /**
     * Toggles between view/edit. If in "view", switch to "update".
     * If in "update", you could also switch back to "view" (cancel).
     */
    const handleEditClick = () => {
        setMode((prev) => (prev === "view" ? "update" : "view"));
    };

    /**
     * Called by the form on submit in "update" mode.
     * We transform the form data into your PUT shape, call the API, and if successful, revert to "view" mode.
     */
    const handleUpdateSubmit = async (values: EquipmentFormValues) => {
        setIsSubmitting(true);
        try {
            // transform the user-changed form data into your required PUT shape
            const payload = transformFormToPUT(values, oldData);

            // call your updateEquipment endpoint
            await updateEquipment(id!, payload);

            notification.success({ message: "Equipment updated!" });
            setMode("view"); // optional: go back to read-only mode after successful update
        } catch (err) {
            notification.error({ message: "Error updating equipment" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    return (
        <Card>
            {/*
         Show an Edit or Cancel button, depending on current mode.
         If mode="view", user sees an Edit button with a pen icon.
         If mode="update", user sees a Cancel button.
      */}
            {mode === "view" ? (
                <Button
                    icon={<EditOutlined />}
                    style={{ float: "right" }}
                    onClick={handleEditClick}
                >
                    Edit
                </Button>
            ) : (
                <Button style={{ float: "right" }} onClick={handleEditClick}>
                    Cancel
                </Button>
            )}

            {/* The single form that can be read-only (view) or editable (update) */}
            <EquipmentForm
                mode={mode}
                initialValues={initialValues}
                isSubmitting={isSubmitting}
                // If you have your create categories logic or category fetch:
                categories={categories}
                loadingCategories={loadingCategories}
                onSubmit={handleUpdateSubmit}
            />
        </Card>
    );
};

export default EquipmentDetailAndUpdatePage;