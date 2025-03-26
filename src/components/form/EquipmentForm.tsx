import React, {useState} from "react";
import {
    Form,
    Input,
    InputNumber,
    Select,
    Button,
    Card,
    Divider,
    Row,
    Modal,
    Col,
    notification,
} from "antd";
import {PlusOutlined, MinusCircleOutlined} from "@ant-design/icons";
import PrimaryImageCard, {UploadedImage} from "../imageCard/PrimaryImageCard";
import GalleryImageCard from "../imageCard/GallaryImageCard";
import MuscleGroupForm from "./MuscleGroupForm";
import {EquipmentFormProps, EquipmentFormValues} from "../../interfaces/equipment/EquipmentForm";
import "./EquipmentForm.css"
import {useUnsavedChangesWarning} from "../../hook/useUnsavedChangesWarning.ts";

const EquipmentForm: React.FC<EquipmentFormProps> = ({
                                                         mode,
                                                         form,
                                                         isEditing = false,
                                                         loadingCategories,
                                                         categories,
                                                         initialValues = {},
                                                         onSubmit,
                                                         onCategorySearch,
                                                         onAddNewCategory,
                                                         searchCategory,
                                                         submitting
                                                     }) => {
    const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
    const [notificationApi, contextHolder] = notification.useNotification();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const shouldWarn = form.isFieldsTouched(true);
    useUnsavedChangesWarning(
        shouldWarn,
        "You have unsaved changes. Are you sure you want to leave?"
    );

    const handleFinish = async (values: any) => {
        try {
            await onSubmit(values);
        } catch (error) {
            console.error(error);
            notificationApi.error({
                message: "Error",
                description:
                    mode === "ADD" ? "Error adding equipment" : "Error updating equipment",
            });
        }
    };

    const renderLabelValue = (label: string, value?: string) => (
        <Col span={8} className="mb-4">
            <label className="block font-medium">{label}</label>
            <div className="border rounded p-2 bg-white min-h-[38px]">{value || "-"}</div>
        </Col>
    );

    const handleImageClick = (url: string) => {
        setPreviewImage(url);
        setPreviewVisible(true);
    };

    return (
        <div>
            {contextHolder}
            <Form<EquipmentFormValues>
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                onFinishFailed={({ errorFields }) => {
                    if (errorFields.length) {
                        form.scrollToField(errorFields[0].name);
                    }
                }}
                disabled={!isEditing || submitting}
                initialValues={initialValues}
            >
                <Divider orientation="left" orientationMargin={0}>Basic Information</Divider>
                <Card className="bg-gray-50 p-4">
                    <Row gutter={16}>
                        {isEditing ? (
                            <>
                                <Col span={8}><Form.Item name="name" label="Name"
                                                         rules={[{required: true}]}><Input/></Form.Item></Col>
                                <Col span={8}><Form.Item name="brand" label="Brand" rules={[{required: true}]}><Input/></Form.Item></Col>
                                <Col span={8}><Form.Item name="model" label="Model" rules={[{required: true}]}><Input/></Form.Item></Col>
                            </>
                        ) : (
                            <>
                                {renderLabelValue("Name", initialValues.name)}
                                {renderLabelValue("Brand", initialValues.brand)}
                                {renderLabelValue("Model", initialValues.model)}
                            </>
                        )}
                    </Row>
                    <Row gutter={16}>
                        {isEditing ? (
                            <>
                                <Col span={8}><Form.Item name="color" label="Color" rules={[{required: true}]}><Input/></Form.Item></Col>
                                <Col span={8}><Form.Item name="material" label="Material"
                                                         rules={[{required: true}]}><Input/></Form.Item></Col>
                                <Col span={8}><Form.Item name="category"
                                                         label="Category"
                                                         rules={[{required: true}]}>
                                    <Select loading={loadingCategories}
                                            showSearch
                                            options={categories}
                                            onSearch={onCategorySearch}
                                            notFoundContent={
                                                <Button type="link"
                                                        onClick={onAddNewCategory}>Add "{searchCategory}"
                                                </Button>}/>
                                </Form.Item></Col>
                            </>
                        ) : (
                            <>
                                {renderLabelValue("Color", initialValues.color)}
                                {renderLabelValue("Material", initialValues.material)}
                                {renderLabelValue("Category", initialValues.category)}
                            </>
                        )}
                    </Row>

                    {isEditing ? (
                        <Form.Item name="description" label="Description"><Input.TextArea rows={3}/></Form.Item>
                    ) : (
                        <div className="mb-4">
                            <label className="block font-medium">Description</label>
                            <div
                                className="border rounded p-2 bg-white min-h-[38px] whitespace-pre-wrap">{initialValues.description || "-"}</div>
                        </div>
                    )}
                </Card>

                <Divider orientation="left" orientationMargin={0}>Options</Divider>
                {!isEditing ? (
                    <div className="space-y-4">
                        {initialValues?.options?.map((opt, idx) => (
                            <Card key={idx} title={`Option ${idx + 1}`} className="bg-gray-50 p-4 relative">
                                <p><strong>Name:</strong> {opt.name}</p>
                                <p><strong>Price:</strong> ${opt.price}</p>
                                <p><strong>Weight:</strong> {opt.weight} kg</p>
                                <p><strong>Available:</strong> {opt.available}</p>
                                {opt.primaryImage && (
                                    <div className="mt-2">
                                        <label className="block font-semibold text-lg mb-2">Primary Image</label>
                                        <img
                                            src={opt.primaryImage.thumbnail}
                                            alt="Primary"
                                            onClick={() => handleImageClick(opt.primaryImage.thumbnail || "")}
                                            className="w-40 h-40 object-cover rounded-lg border border-gray-300 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                        />
                                    </div>
                                )}
                                {opt.galleryImages?.length > 0 && (
                                    <div className="mt-4 bg-gray-50 p-4 relative">
                                        <label className="block font-semibold text-lg mb-2">Gallery Images</label>
                                        <div className="flex flex-wrap gap-3">
                                            {opt.galleryImages.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img.thumbnail}
                                                    alt={`Gallery ${idx + 1}`}
                                                    onClick={() => handleImageClick(img.thumbnail || "")}
                                                    className="w-28 h-28 object-cover rounded-lg border border-gray-300 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Form.List name="options" rules={[{
                        validator: async (_, options) => {
                            if (!options || options.length < 1) throw new Error("Please add at least 1 equipment option");
                        }
                    }]}>
                        {(fields, {add, remove}, {errors}) => (
                            <>
                                <Form.ErrorList errors={errors}/>
                                {isEditing && (
                                    <Button icon={<PlusOutlined/>} onClick={() => add()} className="mb-4">
                                        Add Option
                                    </Button>
                                )}
                                {fields.map(({key, name}) => (
                                    <Card key={key} className="mb-4 bg-gray-50 p-4 relative">
                                        {isEditing && (
                                            <MinusCircleOutlined
                                                onClick={() => remove(name)}
                                                className="absolute top-4 right-4 text-red-500 cursor-pointer"
                                            />
                                        )}
                                        <Form.Item name={[name, "name"]} label="Option Name" rules={[{required: true}]}><Input/></Form.Item>
                                        <Row gutter={16}>
                                            <Col span={12}><Form.Item name={[name, "price"]} label="Price"
                                                                      rules={[{required: true}, {
                                                                          type: "number",
                                                                          min: 0
                                                                      }]}><InputNumber className="w-full" step={0.01}/></Form.Item></Col>
                                            <Col span={12}><Form.Item name={[name, "weight"]} label="Weight"
                                                                      rules={[{required: true}, {
                                                                          type: "number",
                                                                          min: 0
                                                                      }]}><InputNumber className="w-full" step={0.001}/></Form.Item></Col>
                                        </Row>
                                        <Form.Item name={[name, "available"]} label="Available"
                                                   rules={[{required: true}, {type: "number", min: 0}]}><InputNumber
                                            className="w-full"/></Form.Item>
                                        <Form.Item name={[name, "primaryImage"]} label="Primary Image"
                                                   rules={[{required: true}]}><PrimaryImageCard/></Form.Item>
                                        <Form.Item name={[name, "galleryImages"]} label="Gallery Images">
                                            <GalleryImageCard value={galleryImages}
                                                              onChange={(newList) => setGalleryImages(newList)}/>
                                        </Form.Item>
                                    </Card>
                                ))}
                            </>
                        )}
                    </Form.List>
                )}

                <Divider orientation="left" orientationMargin={0}>Muscle Group</Divider>
                {!isEditing ? (
                    <MuscleGroupForm value={initialValues?.muscle_group_used} isEditing={false}/>
                ) : (
                    <Form.Item name="muscle_group_used" rules={[{required: true}]}>
                        <MuscleGroupForm isEditing/>
                    </Form.Item>
                )}

                <Divider orientation="left" orientationMargin={0}>Features</Divider>
                {!isEditing ? (
                    <div className="space-y-2">{initialValues?.features?.map((f, idx) => (
                        <p key={idx}>• {f.description}</p>))}</div>
                ) : (
                    <Form.List name="features">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name}) => (
                                    <Row key={key} gutter={16} className="mb-2">
                                        <Col span={22}><Form.Item name={[name, "__id"]} hidden><Input
                                            type="hidden"/></Form.Item><Form.Item name={[name, "description"]}
                                                                                  rules={[{required: true}]}><Input.TextArea
                                            autoSize={{minRows: 2, maxRows: 6}}/></Form.Item></Col>
                                        {isEditing && (<Col span={2} className="flex items-center"><MinusCircleOutlined
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => remove(name)}/></Col>)}
                                    </Row>
                                ))}
                                {isEditing && (
                                    <Button icon={<PlusOutlined/>} onClick={() => add()}>Add Feature</Button>)}
                            </>
                        )}
                    </Form.List>
                )}

                <Divider orientation="left" orientationMargin={0}>Additional Fields</Divider>
                {!isEditing ? (
                    <div className="space-y-2">{initialValues?.additional_fields?.map((f, idx) => (
                        <p key={idx}><strong>{f.key}:</strong> {f.value}</p>))}</div>
                ) : (
                    <Form.List name="additional_fields">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name}) => (
                                    <Row key={key} gutter={16} className="mb-2">
                                        <Col span={10}><Form.Item name={[name, "key"]} rules={[{required: true}]}><Input
                                            placeholder="Key"/></Form.Item></Col>
                                        <Col span={10}><Form.Item name={[name, "value"]}
                                                                  rules={[{required: true}]}><Input
                                            placeholder="Value"/></Form.Item></Col>
                                        {isEditing && (<Col span={4} className="flex items-center"><MinusCircleOutlined
                                            className="text-red-500 cursor-pointer"
                                            onClick={() => remove(name)}/></Col>)}
                                    </Row>
                                ))}
                                {isEditing && (<Button icon={<PlusOutlined/>} onClick={() => add()}>Add Field</Button>)}
                            </>
                        )}
                    </Form.List>
                )}

                {isEditing && (
                    <div className="flex justify-end mt-4 gap-2">
                        {mode === "EDIT" && (
                            <Button onClick={() => form.resetFields()}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            htmlType="submit"
                            type="primary"
                            id="equipmentFormSubmitBtn"
                            loading={submitting}
                        >
                            {mode === "ADD" ? "Create" : "Update"}
                        </Button>
                    </div>
                )}
                <Modal
                    open={previewVisible}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                    centered
                    width={600}
                    bodyStyle={{padding: 0, textAlign: 'center'}}
                >
                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Preview"
                            style={{maxWidth: '100%', maxHeight: '80vh'}}
                        />
                    )}
                </Modal>
            </Form>
        </div>
    );
};

export default EquipmentForm;