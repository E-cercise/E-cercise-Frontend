import React, { useState } from "react";
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Card,
    Divider,
    Row,
    Col,
    notification,
} from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import PrimaryImageCard from "../imageCard/PrimaryImageCard";
import GalleryImageCard from "../imageCard/GallaryImageCard";
import MuscleGroupForm from "../form/MuscleGroupForm";
import "./EquipmentForm.css";
import {EquipmentFormProps, EquipmentFormValues} from "../../interfaces/equipment/EquipmentForm.ts";


const EquipmentForm: React.FC<EquipmentFormProps> = ({
                                                         mode,
                                                         loadingCategories,
                                                         categories,
                                                         initialValues = {},
                                                         onSubmit,
                                                         onCategorySearch,
                                                         onAddNewCategory,
                                                         searchCategory,
                                                     }) => {
    const [form] = Form.useForm<EquipmentFormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notificationApi, contextHolder] = notification.useNotification();

    const handleFinish = async (values: any) => {
        try {
            setIsSubmitting(true);
            await onSubmit(values); // parent handles the transformation for ADD or EDIT
            notificationApi.success({
                message: "Success",
                description: mode === "ADD"
                    ? "Equipment added successfully!"
                    : "Equipment updated successfully!",
            });
        } catch (error) {
            console.error(error);
            notificationApi.error({
                message: "Error",
                description: mode === "ADD"
                    ? "Error adding equipment"
                    : "Error updating equipment",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            {contextHolder}
            <Form<EquipmentFormValues>
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={initialValues as EquipmentFormValues}
            >
                <Divider orientation="left" orientationMargin={0}>Basic Information</Divider>
                <Card className="bg-gray-50 p-4">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: "Please enter the equipment name" }]}
                            >
                                <Input placeholder="Name" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="brand"
                                label="Brand"
                                rules={[{ required: true, message: "Please enter the brand name" }]}
                            >
                                <Input placeholder="Brand" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="model"
                                label="Model"
                                rules={[{ required: true, message: "Please enter the model" }]}
                            >
                                <Input placeholder="Model" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="color"
                                label="Color"
                                rules={[{ required: true, message: "Please enter the color" }]}
                            >
                                <Input placeholder="Color" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="material"
                                label="Material"
                                rules={[{ required: true, message: "Please enter the material" }]}
                            >
                                <Input placeholder="Material" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[{ required: true, message: "Please select a category" }]}
                            >
                                <Select
                                    loading={loadingCategories}
                                    showSearch
                                    placeholder="Select or add category"
                                    options={categories}
                                    filterOption={(input, option) =>
                                        (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                    }
                                    onSearch={onCategorySearch}
                                    notFoundContent={
                                        <Button type="link" onClick={onAddNewCategory}>
                                            Add "{searchCategory}" as a new category
                                        </Button>
                                    }
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: "Please enter a description" , defaultField: "description" }]}
                    >
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Card>

                <Divider orientation="left" orientationMargin={0}>Options</Divider>
                <Form.List
                    name="options"
                    rules={[
                        {
                            validator: async (_, options) => {
                                if (!options || options.length < 1) {
                                    return Promise.reject(
                                        new Error("Please add at least 1 equipment option")
                                    );
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            <Form.ErrorList errors={errors} />
                            <Button icon={<PlusOutlined />} onClick={() => add()} className="mb-4">
                                Add Option
                            </Button>
                            {fields.map(({ key, name }) => (
                                <Card key={key} className="mb-4 bg-gray-50 p-4 relative">
                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                        className="absolute top-4 right-4 text-red-500 cursor-pointer"
                                    />
                                    <Form.Item
                                        name={[name, "name"]}
                                        label="Option Name"
                                        rules={[{ required: true, message: "Please enter the option name" }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                name={[name, "price"]}
                                                label="Price"
                                                rules={[
                                                    { required: true, message: "Please enter the price" },
                                                    {
                                                        type: "number",
                                                        min: 0,
                                                        message: "Price must be a positive number",
                                                    },
                                                ]}
                                            >
                                                <InputNumber className="w-full" step={0.01} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                name={[name, "weight"]}
                                                label="Weight"
                                                rules={[
                                                    { required: true, message: "Please enter the weight" },
                                                    {
                                                        type: "number",
                                                        min: 0,
                                                        message: "Weight must be a positive number",
                                                    },
                                                ]}
                                            >
                                                <InputNumber className="w-full" step={0.001} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item
                                        name={[name, "available"]}
                                        label="Available"
                                        rules={[
                                            {
                                                required: true,
                                                message: "Please enter the number of available products",
                                            },
                                            {
                                                type: "number",
                                                min: 0,
                                                message: "Available products must be 0 or greater",
                                            },
                                        ]}
                                    >
                                        <InputNumber className="w-full" />
                                    </Form.Item>

                                    {/* Image Fields */}
                                    <Form.Item
                                        name={[name, "primaryImage"]}
                                        label="Primary Image"
                                        rules={[
                                            { required: true, message: "Please upload a primary image" },
                                        ]}
                                    >
                                        <PrimaryImageCard />
                                    </Form.Item>
                                    <Form.Item name={[name, "galleryImages"]} label="Gallery Images">
                                        <GalleryImageCard />
                                    </Form.Item>
                                </Card>
                            ))}
                        </>
                    )}
                </Form.List>

                <Divider orientation="left" orientationMargin={0}>Muscle Group</Divider>
                <Form.Item
                    name="muscle_group_used"
                    rules={[{ required: true, message: "Please select at least one muscle group" }]}
                >
                    <MuscleGroupForm />
                </Form.Item>

                <Divider orientation="left" orientationMargin={0}>Features</Divider>
                <Form.List name="features">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name }) => (
                                <Row key={key} gutter={16} className="mb-2">
                                    <Col span={22}>
                                        <Form.Item name={[name, "__id"]} hidden>
                                            <Input type="hidden" />
                                        </Form.Item>

                                        <Form.Item
                                            name={[name, "description"]}
                                            rules={[{ required: true, message: "Please enter the feature" }]}
                                        >
                                            <Input.TextArea
                                                placeholder="Feature Description"
                                                autoSize={{ minRows: 2, maxRows: 6 }}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={2} className="flex items-center">
                                        <MinusCircleOutlined
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => remove(name)}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Button icon={<PlusOutlined />} onClick={() => add()}>
                                Add Feature
                            </Button>
                        </>
                    )}
                </Form.List>

                <Divider orientation="left" orientationMargin={0}>Additional Fields</Divider>
                <Form.List name="additional_fields">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name }) => (
                                <Row key={key} gutter={16} className="mb-2">
                                    <Col span={10}>
                                        <Form.Item
                                            name={[name, "key"]}
                                            rules={[{ required: true, message: "Please enter attribute key" }]}
                                        >
                                            <Input placeholder="Key" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={10}>
                                        <Form.Item
                                            name={[name, "value"]}
                                            rules={[{ required: true, message: "Please enter attribute value" }]}
                                        >
                                            <Input placeholder="Value" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={4} className="flex items-center">
                                        <MinusCircleOutlined
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => remove(name)}
                                        />
                                    </Col>
                                </Row>
                            ))}
                            <Button icon={<PlusOutlined />} onClick={() => add()}>
                                Add Field
                            </Button>
                        </>
                    )}
                </Form.List>

                <div className="flex justify-end mt-4">
                    <Button htmlType="submit" type="primary" loading={isSubmitting}>
                        {mode === "ADD" ? "Create" : "Update"}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default EquipmentForm;
