import React, {useEffect, useState} from "react";
import {Button, Card, Col, Divider, Form, Input, InputNumber, notification, Row, Select} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import NavBar from "../../components/navbar/NavBar";
import HeaderRow from "../../components/headerRow/HeaderRow";
import {useAuth} from "../../hook/UseAuth";
import {getEquipmentCategory} from "../../api/equipment/EquipmentCategory";
import PrimaryImageCard from "../../components/imageCard/PrimaryImageCard";
import GalleryImageCard from "../../components/imageCard/GallaryImageCard";
import MuscleGroupForm from "../../components/form/MuscleGroupForm";
import {AddEquipmentRequest} from "../../interfaces/Equipment.ts";
import {addEquipment} from "../../api/equipment/AddEquipment.ts";
import {useNavigate} from "react-router-dom";
import './AddEquipmentPage.css';

const AddEquipmentPage = () => {
    const {role} = useAuth();
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notificationAntd, contextHolder] = notification.useNotification();
    const [searchCategory, setSearchCategory] = useState("");
    const navigate = useNavigate();

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const categoryRes = await getEquipmentCategory();

            const mappedCategories = categoryRes.categories.map((cat: any) => ({
                label: cat.label,
                value: cat.label,
            }));
            console.log(mappedCategories);

            setCategories(mappedCategories);
        } catch (err) {
            notificationAntd.error({
                message: "Error",
                description: "Error fetching categories",
            });
        } finally {
            setLoadingCategories(false);
        }
    };

    const handleCategorySearch = (value) => {
        setSearchCategory(value);
    };

    const handleAddNewCategory = () => {
        const newCategory = {
            label: searchCategory,
            value: searchCategory,
        };

        setCategories((prevCategories) => [...prevCategories, newCategory]);
        notificationAntd.success({
            message: "Category Added",
            description: `New category "${searchCategory}" added successfully!`,
        });
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const onFinish = async (values: AddEquipmentRequest) => {
        setIsSubmitting(true);
        const transformedValues = {
            ...values,
            options: values.options?.map((opt) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const {primaryImage, galleryImages, ...rest} = opt;
                const mergedImages = [];
                if (primaryImage) mergedImages.push({
                    is_primary: primaryImage.is_primary,
                    id: primaryImage.fileID
                });
                if (galleryImages?.length) mergedImages.push({
                    is_primary: galleryImages.is_primary,
                    id: galleryImages.fileID,
                });
                return {...rest, images: mergedImages};
            }),
        };

        try{
            await addEquipment(transformedValues);
            notificationAntd.success({
                message: "Success",
                description: "Equipment added successfully!",
            });
            navigate('/')
        }catch (error) {
            console.error(error);
            notificationAntd.error({
                message: "Error",
                description: "Error adding equipment",
            })
        }finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {contextHolder}
            <NavBar/>
            <HeaderRow role={role} title="Add Equipment"/>

            <Card className="w-11/12 mx-auto mt-4">
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Divider orientation="left" orientationMargin={0}>Basic Information</Divider>
                    <Card className="mt-2 border border-gray-200 p-4 bg-gray-50">
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="name" label="Name"
                                           rules={[{required: true, message: "Please enter the equipment name"}]}>
                                    <Input placeholder="Name"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="brand" label="Brand"
                                           rules={[{required: true, message: "Please enter the brand name"}]}>
                                    <Input placeholder="Brand"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="model" label="Model"
                                           rules={[{required: true, message: "Please enter the model"}]}>
                                    <Input placeholder="Model"/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item name="color" label="Color"
                                           rules={[{required: true, message: "Please enter the color"}]}>
                                    <Input placeholder="Color"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="material" label="Material"
                                           rules={[{required: true, message: "Please enter the material"}]}>
                                    <Input placeholder="Material"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="category"
                                    label="Category"
                                    rules={[{required: true, message: "Please select a category"}]}
                                >
                                    <Select
                                        loading={loadingCategories}
                                        showSearch
                                        placeholder="Select or add category"
                                        options={categories}
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        onSearch={(value) => handleCategorySearch(value)}
                                        notFoundContent={
                                            <Button type="link" onClick={() => handleAddNewCategory()}>
                                                Add "{searchCategory}" as a new category
                                            </Button>
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item name="description" label="Description"
                                   rules={[{required: true, message: "Please enter a description"}]}>
                            <Input.TextArea rows={3}/>
                        </Form.Item>
                    </Card>
                    <Divider orientation="left" orientationMargin={0}>Options</Divider>
                    <Form.List name="options" rules={[
                        {
                            validator: async (_, options) => {
                                if (!options || options.length < 1) {
                                    return Promise.reject(new Error('Please add at least 1 equipment option'));
                                }
                            },
                        },
                    ]}>
                        {(fields, {add, remove}, {errors}) => (
                            <>
                                <Form.ErrorList errors={errors}/>
                                <Button icon={<PlusOutlined/>} onClick={() => add()} className="mb-4">Add Option</Button>

                                {fields.map(({key, name}) => (
                                    <Card key={key} className="mb-4 border border-gray-200 p-4 bg-gray-50">
                                        <MinusCircleOutlined onClick={() => remove(name)}
                                                             className="float-right text-red-500 cursor-pointer"/>
                                        <Form.Item name={[name, "name"]} label="Option Name" rules={[{
                                            required: true,
                                            message: "Please enter the option name"
                                        }]}><Input/></Form.Item>
                                        <Row gutter={16}>
                                            <Col span={12}><Form.Item name={[name, "price"]} label="Price" rules={[
                                                {required: true, message: "Please enter the price"},
                                                {type: 'number', min: 0, message: "Price must be a positive number"}
                                            ]}>
                                                <InputNumber className="w-full" step={0.01}/></Form.Item>
                                            </Col>
                                            <Col span={12}><Form.Item name={[name, "weight"]} label="Weight" rules={[
                                                {required: true, message: "Please enter the weight"},
                                                {type: 'number', min: 0, message: "Weight must be a positive number"}
                                            ]}>
                                                <InputNumber className="w-full" step={0.001}/></Form.Item>
                                            </Col>
                                        </Row>
                                        <Form.Item name={[name, "available"]} label="Available" rules={[
                                            {required: true, message: "Please enter the number of available products"},
                                            {type: 'number', min: 0, message: "Available products must be 0 or greater"}
                                        ]}><InputNumber className="w-full"/></Form.Item>
                                        <Form.Item name={[name, "primaryImage"]} label="Primary Image"
                                                   rules={[{required: true, message: "Please upload a primary image"}]}
                                        >
                                            <PrimaryImageCard/>
                                        </Form.Item>
                                        <Form.Item name={[name, "galleryImages"]} label="Gallery Images">
                                            <GalleryImageCard/>
                                        </Form.Item>
                                    </Card>
                                ))}

                            </>
                        )}
                    </Form.List>

                    <Divider orientation="left" orientationMargin={0}>Muscle Group</Divider>
                    <Form.Item name="muscle_group_used"
                               rules={[{required: true, message: "Please select at least one muscle group"}]}
                    >
                        <MuscleGroupForm/>
                    </Form.Item>

                    <Divider orientation="left" orientationMargin={0} className="mt-3">Features</Divider>
                    <Form.List name="features">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name}) => (
                                    <Row key={key} className="mb-2" gutter={16}>
                                        <Col span={22}>
                                            <Form.Item name={name} rules={[{
                                                required: true,
                                                message: "Please enter the feature description"
                                            }]}>
                                                <Input.TextArea placeholder="Feature Description"
                                                                autoSize={{minRows: 2, maxRows: 6}}/>
                                            </Form.Item>
                                        </Col>
                                        <Col span={2} className="flex items-center">
                                            <MinusCircleOutlined className="text-red-500 cursor-pointer"
                                                                 onClick={() => remove(name)}/>
                                        </Col>
                                    </Row>
                                ))}
                                <Button icon={<PlusOutlined/>} onClick={() => add()}>
                                    Add Feature
                                </Button>
                            </>
                        )}
                    </Form.List>

                    <Divider orientation="left" orientationMargin={0}>Additional Fields</Divider>
                    <Form.List name="additional_fields">
                        {(fields, {add, remove}) => (
                            <>
                                {fields.map(({key, name}) => (
                                    <Row gutter={16} key={key}>
                                        <Col span={10}>
                                            <Form.Item name={[name, "key"]} rules={[{
                                                required: true,
                                                message: "Please enter the attribute key"
                                            }]}>
                                                <Input placeholder="Key"/></Form.Item></Col><Col span={10}>
                                        <Form.Item name={[name, "value"]} rules={[{
                                            required: true,
                                            message: "Please enter the attribute value"
                                        }]}>
                                            <Input placeholder="Value"/></Form.Item>
                                    </Col>
                                        <MinusCircleOutlined className="text-red-500 cursor-pointer"
                                                             onClick={() => remove(name)}/>
                                    </Row>
                                ))}
                                <Button icon={<PlusOutlined/>} onClick={() => add()}>Add Field</Button>
                            </>
                        )}
                    </Form.List>

                    <div className="flex justify-end mt-4">
                        <Button htmlType="submit" type="primary" loading={isSubmitting}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default AddEquipmentPage;