import {Form, Input, Button, Tooltip, message} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import {useToggleEditing} from "../../hook/useToggleEditing.ts";
import {useFormAutoSync} from "../../hook/useFormAutoSync.ts";
import "./UserProfileForm.css"

const UserProfileForm = ({
                             initialValues,
                             onSave,
                         }: {
    initialValues: any;
    onSave: (values: any) => Promise<void>;
}) => {
    const [form] = useForm();
    const { editing, toggleEditing, setEditingOff } = useToggleEditing();
    useFormAutoSync(form, initialValues);

    const handleSubmit = async () => {
        const values = form.getFieldsValue();
        const changedFields = Object.fromEntries(
            Object.entries(values).filter(([key, value]) => value !== initialValues?.[key])
        );

        if (Object.keys(changedFields).length === 0) {
            message.info("No changes made.");
            return;
        }

        await onSave(changedFields);
        setEditingOff();
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Profile Details</h2>
                {!editing && (
                    <Tooltip title="Edit Profile">
                        <Button icon={<EditOutlined />} shape="circle" onClick={toggleEditing} />
                    </Tooltip>
                )}
            </div>

            <Form
                layout="vertical"
                form={form}
                onFinish={handleSubmit}
                initialValues={initialValues}
                disabled={!editing}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="address" label="Address" className="md:col-span-2" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </div>

                {editing && (
                    <div className="sticky bottom-0 bg-white py-3 flex justify-end border-t mt-6">
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </div>
                )}
            </Form>
        </>
    );
};

export default UserProfileForm;
