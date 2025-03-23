import { useEffect, useState } from "react";
import { Card, notification} from "antd";
import NavBar from "../../components/navbar/NavBar";
import HeaderRow from "../../components/headerRow/HeaderRow";
import { useAuth } from "../../hook/UseAuth";
import { getEquipmentCategory } from "../../api/equipment/EquipmentCategory";
import { addEquipment } from "../../api/equipment/AddEquipment";
import { useNavigate } from "react-router-dom";
import EquipmentForm from "../../components/form/EquipmentForm.tsx";
import {CategoryResponse} from "../../interfaces/equipment/EquipmentDetail.ts";

const AddEquipmentPage = () => {
    const { role } = useAuth();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [notificationApi, contextHolder] = notification.useNotification();
    const [searchCategory, setSearchCategory] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const res = await getEquipmentCategory();
            const mapped = res.categories.map((cat: any) => ({
                label: cat.label,
                value: cat.label,
            }));
            setCategories(mapped);
        } catch (err) {
            notificationApi.error({
                message: "Error",
                description: "Error fetching categories",
            });
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleCategorySearch = (value: string) => {
        setSearchCategory(value);
    };

    const handleAddNewCategory = () => {
        if (!searchCategory) return;
        const newCat = { label: searchCategory, value: searchCategory };
        setCategories((prev) => [...prev, newCat]);
        notificationApi.success({
            message: "Category Added",
            description: `New category "${searchCategory}" added successfully!`,
        });
    };

    const handleSubmit = async (values: any) => {
        const transformedPayload = {
            ...values,
            features: values.features.map((f) => f.description),
            options: values.options?.map((opt: any) => {
                const { primaryImage, galleryImages, ...rest } = opt;
                const mergedImages: any[] = [];
                if (primaryImage) {
                    mergedImages.push({
                        id: primaryImage.fileID,
                        is_primary: primaryImage.is_primary,
                    });
                }
                if (Array.isArray(galleryImages)) {
                    galleryImages.forEach((img: any) => {
                        mergedImages.push({
                            id: img.fileID,
                            is_primary: img.is_primary || false,
                        });
                    });
                }
                return { ...rest, images: mergedImages };
            }),
        };
        await addEquipment(transformedPayload);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {contextHolder}
            <NavBar />
            <HeaderRow role={role} title="Add Equipment" />
            <Card className="w-11/12 mx-auto mt-4">
                <EquipmentForm
                    mode="ADD"
                    loadingCategories={loadingCategories}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCategorySearch={handleCategorySearch}
                    onAddNewCategory={handleAddNewCategory}
                    searchCategory={searchCategory}
                />
            </Card>
        </div>
    );
};

export default AddEquipmentPage;
