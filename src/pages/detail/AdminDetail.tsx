import { useParams} from "react-router-dom";
import {CategoryResponse, EquipmentDetailResponse} from "../../interfaces/equipment/EquipmentDetail.ts";
import {useEffect, useState} from "react";
import {useAuth} from "../../hook/UseAuth.tsx";
import {EquipmentFormValues} from "../../interfaces/equipment/EquipmentForm.ts";
import {Button, Card, notification} from "antd";
import {getEquipmentCategory} from "../../api/equipment/EquipmentCategory.ts";
import {equipmentDetail} from "../../api/equipment/EquipmentDetail.ts";
import {handleUpdateSubmitPartial} from "../../helper/updateEquipmentHelper.ts";
import NavBar from "../../components/navbar/NavBar.tsx";
import HeaderRow from "../../components/headerRow/HeaderRow.tsx";
import EquipmentForm from "../../components/form/EquipmentForm.tsx";

const AdminDetailPage: React.FC = () => {
    const { equipment_id } = useParams();
    const { role } = useAuth();

    const [originalData, setOriginalData] = useState<EquipmentDetailResponse>();
    const [initialFormValues, setInitialFormValues] = useState<EquipmentFormValues>();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [notificationApi, contextHolder] = notification.useNotification();
    const [searchCategory, setSearchCategory] = useState("");
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        if (equipment_id) {
            fetchEquipmentDetail(equipment_id);
        }
        fetchCategories();
    }, [equipment_id]);

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

    const fetchEquipmentDetail = async (id: string) => {
        try {
            const data = await equipmentDetail(id);
            setOriginalData(data);

            const formShape: EquipmentFormValues = {
                name: data.name,
                brand: data.brand,
                model: data.model,
                color: data.color,
                material: data.material,
                category: data.category,
                description: data.description,
                muscle_group_used: data.muscle_group_used || [],
                features: (data.feature || []).map((f) => ({
                    __id: f.id,
                    description: f.description,
                })),
                additional_fields: (data.additional_field || []).map((af) => ({
                    __id: af.id,
                    key: af.key,
                    value: af.value,
                })),
                options: (data.option || []).map((opt: { images: any[]; id: any; name: any; price: any; weight: any; available: any; }) => {
                    const primaryImg = opt.images.find((img: { is_primary: any; }) => img.is_primary);
                    const galleryImgs = opt.images.filter((img) => !img.is_primary);
                    return {
                        __id: opt.id,
                        name: opt.name,
                        price: opt.price,
                        weight: opt.weight,
                        available: opt.available,
                        primaryImage: primaryImg
                            ? { fileID: primaryImg.id, thumbnail: primaryImg.url, is_primary: true }
                            : undefined,
                        galleryImages: galleryImgs.map((g) => ({
                            fileID: g.id,
                            thumbnail: g.url,
                            is_primary: false,
                        })),
                    };
                }),
            };

            setInitialFormValues(formShape);
        } catch (err) {
            notificationApi.error({
                message: "Error",
                description: "Could not fetch equipment details",
            });
        }
    };

    const handleCategorySearch = (val: string) => {
        setSearchCategory(val);
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


    const handleCancelEdit = () => {
        setIsEditing(false);
        setInitialFormValues({ ...initialFormValues });
    };

    const handleUpdateSubmit = async (values: EquipmentFormValues) => {
        if (!originalData || !equipment_id) return;

        try {
            const result = await handleUpdateSubmitPartial(equipment_id, originalData, values);

            if (!result) {
                notificationApi.info({
                    message: "No Changes",
                    description: "No fields were changed, update skipped.",
                });
                return;
            }

            const categoryObj = categories.find(c => c.value === values.category);

            setOriginalData({
                ...originalData,
                ...values,
                category: categoryObj?.value || values.category,
                feature: values.features.map((f) => ({
                    id: f.__id ?? Math.random().toString(),
                    description: f.description,
                })),
                additional_field: values.additional_fields?.map((f) => ({
                    id: f.__id ?? Math.random().toString(),
                    key: f.key,
                    value: f.value,
                })),
                option: values.options?.map((opt) => ({
                    id: opt.__id ?? Math.random().toString(),
                    name: opt.name,
                    price: opt.price,
                    weight: opt.weight,
                    available: opt.available,
                    images: [
                        ...(opt.primaryImage ? [{
                            id: opt.primaryImage.fileID,
                            url: opt.primaryImage.thumbnail,
                            is_primary: true
                        }] : []),
                        ...(opt.galleryImages || []).map(g => ({
                            id: g.fileID,
                            url: g.thumbnail,
                            is_primary: false
                        }))
                    ]
                })),
                muscle_group_used: values.muscle_group_used,
            });

            setInitialFormValues(values);
            notificationApi.success({ message: "Success", description: "Equipment updated!" });
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            notificationApi.error({ message: "Error", description: "Update failed." });
        }
    };

    if (!initialFormValues) {
        return (
            <div>
                {contextHolder}
                <NavBar />
                <HeaderRow role={role} title="Edit Equipment" />
                <p className="text-center mt-4">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {contextHolder}
            <NavBar />
            <HeaderRow role={role} title={isEditing?"Edit Equipment":"Equipment Details"} />
            <Card className="w-11/12 mx-auto mt-4">
                {!isEditing ? (
                    <div className="flex justify-end mb-4">
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    </div>
                ) : (
                    <div className="flex justify-end mb-4">
                        <Button type="primary" onClick={() => document.getElementById("equipmentFormSubmitBtn")?.click()}>
                            Save
                        </Button>
                    </div>
                )}
                <EquipmentForm
                    mode="EDIT"
                    isEditing={isEditing}
                    loadingCategories={loadingCategories}
                    categories={categories}
                    onCategorySearch={handleCategorySearch}
                    onAddNewCategory={handleAddNewCategory}
                    searchCategory={searchCategory}
                    initialValues={initialFormValues}
                    onSubmit={(vals: EquipmentFormValues) => {
                        handleUpdateSubmit(vals);
                        setIsEditing(false);
                    }}
                    onCancelEdit={handleCancelEdit}
                />
            </Card>
        </div>
    );
};

export default AdminDetailPage;