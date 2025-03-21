import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Button, Card, Row, Col, Divider } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import PrimaryImageCard from "../../components/imageCard/PrimaryImageCard";
import {EquipmentFormProps, EquipmentFormValues} from "../../interfaces/equipment/EquipmentForm.ts";
import GalleryImageCard from "../../components/imageCard/GallaryImageCard.tsx";
import MuscleGroupForm from "../../components/form/MuscleGroupForm.tsx";


const EquipmentForm: React.FC<EquipmentFormProps> = ({
                                                         mode,
                                                         initialValues,
                                                         isSubmitting = false,
                                                         loadingCategories = false,
                                                         categories = [],
                                                         onSubmit,
                                                     }) => {
    const readOnly = mode === "view";
    const [form] = Form.useForm<EquipmentFormValues>();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues as any);
        }
    }, [initialValues, form]);

    const handleFinish = (values: EquipmentFormValues) => {
        onSubmit(values);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            disabled={readOnly} // automatically disables form fields in "view" mode
        >
            <Divider>Basic Information</Divider>
            <Card>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="name" label="Name" rules={[{ required: true, message: "Equipment name required" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="brand" label="Brand" rules={[{ required: true, message: "Brand required" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="model" label="Model" rules={[{ required: true, message: "Model required" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="color" label="Color" rules={[{ required: true, message: "Color required" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="material" label="Material" rules={[{ required: true, message: "Material required" }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Select a category" }]}>
                            <Select loading={loadingCategories} options={categories} placeholder="Category" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3} />
                </Form.Item>
            </Card>

            <Divider>Options</Divider>
            <Form.List
                name="options"
                rules={[
                    {
                        validator: async (_: any, value: string | any[]) => {
                            if (!value || value.length < 1) {
                                return Promise.reject(new Error("Add at least 1 option"));
                            }
                        },
                    },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Form.ErrorList errors={errors} />
                        {!readOnly && (
                            <Button icon={<PlusOutlined />} onClick={() => add()} style={{ marginBottom: 16 }}>
                                Add Option
                            </Button>
                        )}

                        {fields.map(({ key, name }) => (
                            <Card key={key} style={{ marginBottom: 16 }}>
                                {!readOnly && (
                                    <MinusCircleOutlined
                                        onClick={() => remove(name)}
                                        style={{ float: "right", color: "red", cursor: "pointer" }}
                                    />
                                )}

                                <Form.Item
                                    name={[name, "name"]}
                                    label="Option Name"
                                    rules={[{ required: true, message: "Option name required" }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name={[name, "price"]}
                                            label="Price"
                                            rules={[
                                                { required: true, message: "Price is required" },
                                                { type: "number", min: 0, message: "Must be >= 0" },
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
                                                { required: true, message: "Weight is required" },
                                                { type: "number", min: 0, message: "Must be >= 0" },
                                            ]}
                                        >
                                            <InputNumber className="w-full" step={0.1} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item
                                    name={[name, "available"]}
                                    label="Available"
                                    rules={[
                                        { required: true, message: "Available quantity required" },
                                        { type: "number", min: 0, message: "Must be >= 0" },
                                    ]}
                                >
                                    <InputNumber className="w-full" />
                                </Form.Item>

                                <Form.Item
                                    name={[name, "primaryImage"]}
                                    label="Primary Image"
                                    rules={[{ required: true, message: "Upload primary image" }]}
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

            <Divider>Muscle Group</Divider>
            <Form.Item
                name="muscle_group_used"
                rules={[{ required: true, message: "Select at least one muscle group" }]}
            >
                <MuscleGroupForm />
            </Form.Item>
            <Divider>Features</Divider>
            <Form.List name="features">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                                <Col span={22}>
                                    <Form.Item name={name} rules={[{ required: true, message: "Feature required" }]}>
                                        <Input.TextArea placeholder="Feature description" autoSize={{ minRows: 2, maxRows: 6 }} />
                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    {!readOnly && (
                                        <MinusCircleOutlined style={{ color: "red", cursor: "pointer" }} onClick={() => remove(name)} />
                                    )}
                                </Col>
                            </Row>
                        ))}
                        {!readOnly && (
                            <Button icon={<PlusOutlined />} onClick={() => add()}>
                                Add Feature
                            </Button>
                        )}
                    </>
                )}
            </Form.List>

            <Divider>Additional Fields</Divider>
            <Form.List name="additional_fields">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Row key={key} gutter={16} style={{ marginBottom: 8 }}>
                                <Col span={10}>
                                    <Form.Item
                                        name={[name, "key"]}
                                        rules={[{ required: true, message: "Field key required" }]}
                                    >
                                        <Input placeholder="Key" />
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item
                                        name={[name, "value"]}
                                        rules={[{ required: true, message: "Field value required" }]}
                                    >
                                        <Input placeholder="Value" />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    {!readOnly && (
                                        <MinusCircleOutlined style={{ color: "red", cursor: "pointer" }} onClick={() => remove(name)} />
                                    )}
                                </Col>
                            </Row>
                        ))}
                        {!readOnly && (
                            <Button icon={<PlusOutlined />} onClick={() => add()}>
                                Add Field
                            </Button>
                        )}
                    </>
                )}
            </Form.List>

            {mode !== "view" && (
                <div style={{ textAlign: "right", marginTop: 24 }}>
                    <Button type="primary" htmlType="submit" loading={isSubmitting}>
                        {mode === "create" ? "Create" : "Update"}
                    </Button>
                </div>
            )}
        </Form>
    );
};

export default EquipmentForm;