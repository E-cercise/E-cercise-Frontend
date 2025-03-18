import React, { useEffect, useState } from "react";
import NavBar from "../../components/navbar/NavBar";
import HeaderRow from "../../components/headerRow/HeaderRow";
import { useAuth } from "../../hook/UseAuth";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    notification,
    Row,
    Select,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { AddEquipmentRequest, CategoryResponse } from "../../interfaces/Equipment";
import { getEquipmentCategory } from "../../api/equipment/EquipmentCategory";
import PrimaryImageCard from "../../components/imageCard/PrimaryImageCard";
import GalleryImageCard from "../../components/imageCard/GallaryImageCard";
import MuscleGroupForm from "../../components/form/MuscleGroupForm";

function AddEquipmentPage() {
    const { role } = useAuth();
    const [categories, setCategories] = useState<CategoryResponse>({ categories: [] });
    const [loadingCategories, setLoadingCategories] = useState<boolean>(false);
    const [notificationAntd, contextHolder] = notification.useNotification();

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const category = await getEquipmentCategory();
            setCategories(category);
        } catch (err) {
            notificationAntd.error({
                message: "Error",
                description: "Error Fetching Categories",
            });
        } finally {
            setLoadingCategories(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onFinish = (values: AddEquipmentRequest) => {
        const transformedValues = {
            ...values,
            options: values.options?.map((opt) => {
                const { primaryImage, galleryImages, ...rest } = opt;
                const mergedImages = [];
                if (primaryImage) mergedImages.push(primaryImage);
                if (galleryImages?.length) mergedImages.push(...galleryImages);
                return { ...rest, images: mergedImages };
            }),
        };

        console.log("Transformed Values:", transformedValues);
        notificationAntd.success({
            message: "Success",
            description: "Equipment added successfully",
        });
    };

    const onFinishFailed = () => {
        notificationAntd.error({
            message: "Submission Error",
            description: "Please check the form for errors and try again",
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {contextHolder}
            <NavBar />
            <HeaderRow role={role} title="Add Equipment" />

            {/* Form Container */}
            <div className="max-w-3xl mx-auto bg-white rounded-md shadow p-6 mt-4">
                <Form
                    name="add_equipment_form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    // Constrain label & input widths:
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    // Ensure normal text (not bold) for inputs:
                    className="[&_.ant-input]:font-normal [&_.ant-input-number-input]:font-normal"
                >
                    {/* Category */}
                    <Form.Item
                        label={<span className="font-semibold">Category</span>}
                        name="category"
                        rules={[{ required: true }]}
                    >
                        <Select loading={loadingCategories} options={categories.categories} />
                    </Form.Item>

                    {/* Name */}
                    <Form.Item
                        label={<span className="font-semibold">Name</span>}
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Brand */}
                    <Form.Item
                        label={<span className="font-semibold">Brand</span>}
                        name="brand"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Model */}
                    <Form.Item
                        label={<span className="font-semibold">Model</span>}
                        name="model"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Main Color */}
                    <Form.Item
                        label={<span className="font-semibold">Main Color</span>}
                        name="color"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Material */}
                    <Form.Item
                        label={<span className="font-semibold">Material</span>}
                        name="material"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Description */}
                    <Form.Item
                        label={<span className="font-semibold">Description</span>}
                        name="description"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Divider />

                    {/* Options Section */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Options</h2>
                        <Form.List name="options">
                            {(fields, { add }) => (
                                <Button
                                    type="default"
                                    icon={<PlusOutlined />}
                                    className="border-gray-300 text-gray-700 hover:border-gray-400"
                                    onClick={() => add()}
                                >
                                    Add Option
                                </Button>
                            )}
                        </Form.List>
                    </div>

                    {/* Rendering Option Cards */}
                    <Form.List name="options">
                        {(fields, { remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card
                                        key={key}
                                        className="mb-4 border border-gray-200 p-4 bg-gray-50"
                                        bodyStyle={{ padding: 16 }}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold">Option #{name + 1}</h3>
                                            <MinusCircleOutlined
                                                className="text-red-500 cursor-pointer"
                                                onClick={() => remove(name)}
                                            />
                                        </div>

                                        <Form.Item
                                            {...restField}
                                            label={<span className="font-semibold">Option Name</span>}
                                            name={[name, "name"]}
                                            rules={[{ required: true, message: "Please enter a name" }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item
                                                    {...restField}
                                                    label={<span className="font-semibold">Price</span>}
                                                    name={[name, "price"]}
                                                    rules={[{ required: true, message: "Please enter a price" }]}
                                                >
                                                    <InputNumber style={{ width: "100%" }} step={0.01} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item
                                                    {...restField}
                                                    label={<span className="font-semibold">Weight</span>}
                                                    name={[name, "weight"]}
                                                    rules={[{ required: true, message: "Please enter a weight" }]}
                                                >
                                                    <InputNumber style={{ width: "100%" }} step={0.001} />
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            {...restField}
                                            label={<span className="font-semibold">Available</span>}
                                            name={[name, "available"]}
                                            rules={[{ required: true, message: "Please enter the availability" }]}
                                        >
                                            <InputNumber style={{ width: "100%" }} />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            label={<span className="font-semibold">Primary Image</span>}
                                            name={[name, "primaryImage"]}
                                            rules={[{ required: true, message: "Please upload the primary image" }]}
                                            valuePropName="value"
                                            getValueFromEvent={(e) => e}
                                        >
                                            <PrimaryImageCard />
                                        </Form.Item>

                                        <Form.Item
                                            {...restField}
                                            label={<span className="font-semibold">Gallery Images</span>}
                                            name={[name, "galleryImages"]}
                                            valuePropName="value"
                                            getValueFromEvent={(e) => e}
                                        >
                                            <GalleryImageCard />
                                        </Form.Item>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Form.List>

                    <Divider />

                    {/* Muscle Group */}
                    <Form.Item
                        label={<span className="text-lg font-bold">Muscle group used</span>}
                        name="muscle_group_used"
                        labelCol={{ span: 24 }} // Let the heading be full width
                        wrapperCol={{ span: 24 }}
                        rules={[{ required: true, message: "Please specify the muscle group used" }]}
                    >
                        <MuscleGroupForm />
                    </Form.Item>

                    <Divider />

                    {/* Features Section */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Features</h2>
                        <Form.List name="features">
                            {(fields, { add }) => (
                                <Button
                                    type="default"
                                    icon={<PlusOutlined />}
                                    className="border-gray-300 text-gray-700 hover:border-gray-400"
                                    onClick={() => add("")}
                                >
                                    Add Feature
                                </Button>
                            )}
                        </Form.List>
                    </div>

                    {/* Rendering Features */}
                    <Form.List name="features">
                        {(fields, { remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key} className="flex items-center gap-2 mb-2">
                                        <Form.Item
                                            {...restField}
                                            name={name}
                                            rules={[{ required: true, message: "Please enter a feature" }]}
                                            className="flex-1 mb-0"
                                        >
                                            <Input placeholder="Feature" />
                                        </Form.Item>
                                        <MinusCircleOutlined
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => remove(name)}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </Form.List>

                    <Divider />

                    {/* Additional Fields Section */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">Additional Fields</h2>
                        <Form.List name="additional_fields">
                            {(fields, { add }) => (
                                <Button
                                    type="default"
                                    icon={<PlusOutlined />}
                                    className="border-gray-300 text-gray-700 hover:border-gray-400"
                                    onClick={() => add({ key: "", value: "" })}
                                >
                                    Add Field
                                </Button>
                            )}
                        </Form.List>
                    </div>

                    {/* Rendering Additional Fields */}
                    <Form.List name="additional_fields">
                        {(fields, { remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Card key={key} className="mb-4 p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-semibold">Additional Field #{name + 1}</h3>
                                            <MinusCircleOutlined
                                                className="text-red-500 cursor-pointer"
                                                onClick={() => remove(name)}
                                            />
                                        </div>
                                        <Form.Item
                                            {...restField}
                                            label={<span className="font-semibold">Key</span>}
                                            name={[name, "key"]}
                                            rules={[{ required: true, message: "Please enter a key" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            label={<span className="font-semibold">Value</span>}
                                            name={[name, "value"]}
                                            rules={[{ required: true, message: "Please enter a value" }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Form.List>

                    <Divider />

                    <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default AddEquipmentPage;
