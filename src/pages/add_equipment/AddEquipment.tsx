import NavBar from "../../components/navbar/NavBar.tsx";
import HeaderRow from "../../components/HeaderRow/HeaderRow.tsx";
import {useAuth} from "../../hook/UseAuth.tsx";
import {Button, Card, Col, Divider, Form, Input, InputNumber, notification, Row, Select, Space, Upload} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {CategoryResponse} from "../../interfaces/Equipment.ts";
import {useEffect, useState} from "react";
import {getEquipmentCategory} from "../../api/equipment/EquipmentCategory.ts";
import {RcCustomRequestOptions, UploadFile} from "antd/es/upload/interface";
import {UploadEquipmentImage} from "../../api/image/UploadEquipmentImage.ts";
import UploadPictureCard from "../../components/imageCard/ImageCard.tsx";

function AddEquipmentPage() {
    const {role} = useAuth()
    const [categories, setCategories] = useState<CategoryResponse>({categories: []});
    const [notificationAntd, contextHolder] = notification.useNotification();

    const fetchCategories = async () => {
        try {
            const category = await getEquipmentCategory();
            setCategories(category);
        } catch (err) {
            notificationAntd.error({
                message: "Error",
                description: "Error Fetching Categories",
                showProgress: true,
                pauseOnHover: false,
            });
            console.error(err);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, []);


    return <div className="h-full pt-3 pb-3 pl-5 pr-5 mt-3">
        {contextHolder}
        <NavBar/>
        <HeaderRow role={role} title={"Add Equipment"}/>
        <div className="flex flex-col items-start justify-center w-full h-full bg-[#D9D9D9] rounded-md space-y-2">

            <Form
                layout="horizontal"
                name="add equipment form"
            >
                <Form.Item name="category" label="Category" rules={[{required: true}]}>
                    <Select options={categories.categories}>
                    </Select>
                </Form.Item>
                <Form.Item name="name" label="Name" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="brand" label="Brand" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="model" label="Model" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="color" label="Main Color" rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name="material" label="Material">
                    <Input/>
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea rows={3}/>
                </Form.Item>
                <Divider/>
                <Form.List name="options">
                    {(fields, { add, remove }) => (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-xl font-semibold">Options</h2>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                    className="flex items-center"
                                >
                                    Add Option
                                </Button>
                            </div>

                            {fields.map(({ key, name, ...restField }) => (
                                <Card key={key} className="mb-4 border border-gray-200 p-4">
                                    <div className="flex justify-between mb-2">
                                        <h3 className="font-semibold">Option #{name + 1}</h3>
                                        <MinusCircleOutlined
                                            className="text-red-500"
                                            onClick={() => remove(name)}
                                        />
                                    </div>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'name']}
                                        label="Option Name"
                                        rules={[{ required: true, message: 'Please enter a name' }]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'price']}
                                                label="Price"
                                                rules={[{ required: true, message: 'Please enter a price' }]}
                                            >
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    step={0.01}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'weight']}
                                                label="Weight"
                                            >
                                                <InputNumber
                                                    style={{ width: '100%' }}
                                                    step={0.001}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item
                                        {...restField}
                                        name={[name, 'available']}
                                        label="Available"
                                    >
                                        <InputNumber style={{ width: '100%' }} />
                                    </Form.Item>

                                    <Form.Item
                                        {...restField}
                                        name={[name, "images"]}
                                        label="Images"
                                        valuePropName="value"
                                        getValueFromEvent={(e) => e}
                                    >
                                        <UploadPictureCard />
                                    </Form.Item>                                </Card>
                            ))}
                        </div>
                    )}
                </Form.List>
                <Divider/>

            </Form>

            {/*      /!**/}
            {/*  2) MUSCLE_GROUP_USED (ARRAY OF STRINGS)*/}
            {/**!/*/}
            {/*      <Form.List name="muscle_group_used">*/}
            {/*          {(fields, { add, remove }) => (*/}
            {/*              <div className="mb-4">*/}
            {/*                  <div className="flex items-center justify-between mb-2">*/}
            {/*                      <h2 className="text-xl font-semibold">Muscle Group Used</h2>*/}
            {/*                      <Button*/}
            {/*                          type="dashed"*/}
            {/*                          icon={<PlusOutlined />}*/}
            {/*                          onClick={() => add('')}*/}
            {/*                      >*/}
            {/*                          Add Muscle*/}
            {/*                      </Button>*/}
            {/*                  </div>*/}
            {/*                  {fields.map(({ key, name, ...restField }) => (*/}
            {/*                      <div key={key} className="flex items-center gap-2 mb-2">*/}
            {/*                          <Form.Item*/}
            {/*                              {...restField}*/}
            {/*                              name={name}*/}
            {/*                              rules={[{ required: true, message: 'Please enter muscle group' }]}*/}
            {/*                              className="flex-1"*/}
            {/*                          >*/}
            {/*                              <Input placeholder="e.g. Abs" />*/}
            {/*                          </Form.Item>*/}
            {/*                          <MinusCircleOutlined*/}
            {/*                              className="text-red-500"*/}
            {/*                              onClick={() => remove(name)}*/}
            {/*                          />*/}
            {/*                      </div>*/}
            {/*                  ))}*/}
            {/*              </div>*/}
            {/*          )}*/}
            {/*      </Form.List>*/}

            {/*      <Divider />*/}

            {/*      /!**/}
            {/*  3) FEATURES (ARRAY OF STRINGS)*/}
            {/**!/*/}
            {/*      <Form.List name="features">*/}
            {/*          {(fields, { add, remove }) => (*/}
            {/*              <div className="mb-4">*/}
            {/*                  <div className="flex items-center justify-between mb-2">*/}
            {/*                      <h2 className="text-xl font-semibold">Features</h2>*/}
            {/*                      <Button*/}
            {/*                          type="dashed"*/}
            {/*                          icon={<PlusOutlined />}*/}
            {/*                          onClick={() => add('')}*/}
            {/*                      >*/}
            {/*                          Add Feature*/}
            {/*                      </Button>*/}
            {/*                  </div>*/}
            {/*                  {fields.map(({ key, name, ...restField }) => (*/}
            {/*                      <div key={key} className="flex items-center gap-2 mb-2">*/}
            {/*                          <Form.Item*/}
            {/*                              {...restField}*/}
            {/*                              name={name}*/}
            {/*                              rules={[{ required: true, message: 'Please enter a feature' }]}*/}
            {/*                              className="flex-1"*/}
            {/*                          >*/}
            {/*                              <Input placeholder="Feature" />*/}
            {/*                          </Form.Item>*/}
            {/*                          <MinusCircleOutlined*/}
            {/*                              className="text-red-500"*/}
            {/*                              onClick={() => remove(name)}*/}
            {/*                          />*/}
            {/*                      </div>*/}
            {/*                  ))}*/}
            {/*              </div>*/}
            {/*          )}*/}
            {/*      </Form.List>*/}

            {/*      <Divider />*/}

            {/*      /!**/}
            {/*  4) ADDITIONAL_FIELDS (ARRAY OF key-value pairs)*/}
            {/**!/*/}
            {/*      <Form.List name="additional_fields">*/}
            {/*          {(fields, { add, remove }) => (*/}
            {/*              <div>*/}
            {/*                  <div className="flex items-center justify-between mb-2">*/}
            {/*                      <h2 className="text-xl font-semibold">Additional Fields</h2>*/}
            {/*                      <Button*/}
            {/*                          type="dashed"*/}
            {/*                          onClick={() => add({ key: '', value: '' })}*/}
            {/*                          icon={<PlusOutlined />}*/}
            {/*                      >*/}
            {/*                          Add Field*/}
            {/*                      </Button>*/}
            {/*                  </div>*/}

            {/*                  {fields.map(({ key, name, ...restField }) => (*/}
            {/*                      <Card key={key} className="mb-4 p-4">*/}
            {/*                          <div className="flex justify-between mb-2">*/}
            {/*                              <h3 className="font-semibold">Additional Field #{name + 1}</h3>*/}
            {/*                              <MinusCircleOutlined*/}
            {/*                                  className="text-red-500"*/}
            {/*                                  onClick={() => remove(name)}*/}
            {/*                              />*/}
            {/*                          </div>*/}

            {/*                          <Form.Item*/}
            {/*                              {...restField}*/}
            {/*                              name={[name, 'key']}*/}
            {/*                              label="Key"*/}
            {/*                              rules={[{ required: true, message: 'Please enter a key' }]}*/}
            {/*                          >*/}
            {/*                              <Input />*/}
            {/*                          </Form.Item>*/}

            {/*                          <Form.Item*/}
            {/*                              {...restField}*/}
            {/*                              name={[name, 'value']}*/}
            {/*                              label="Value"*/}
            {/*                              rules={[{ required: true, message: 'Please enter a value' }]}*/}
            {/*                          >*/}
            {/*                              <Input />*/}
            {/*                          </Form.Item>*/}
            {/*                      </Card>*/}
            {/*                  ))}*/}
            {/*              </div>*/}
            {/*          )}*/}
            {/*      </Form.List>*/}

            {/*      <Divider />*/}

            {/*      <Form.Item>*/}
            {/*          <Button type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">*/}
            {/*              Submit*/}
            {/*          </Button>*/}
            {/*      </Form.Item>*/}
            {/*  </Form>*/}
        </div>
    </div>
};


export default AddEquipmentPage;