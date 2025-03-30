import {
    Button,
    Card,
    Form,
    Input,
    InputNumber,
    Tag,
    Tooltip,
    message, Skeleton,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useToggleEditing } from "../../hook/useToggleEditing.ts";
import { useFormAutoSync } from "../../hook/useFormAutoSync.ts";
import "./UserProfileForm.css";
import { UserGoal, UserTag } from "../../interfaces/UserProfile.ts";
import React, { useEffect, useState } from "react";
import { getChangedFields } from "../../helper/formHelper.ts";
import {checkUserEmailExist} from "../../api/user_profile/CheckUserEmailExists.ts";
import { motion, AnimatePresence } from "framer-motion";


interface UserProfileFormProps {
    initialValues: any;
    onSave: (values: any) => Promise<void>;
    availableTags: UserTag[];
    availableGoals: UserGoal[];
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({
                                                             initialValues,
                                                             onSave,
                                                             availableTags,
                                                             availableGoals,
                                                         }) => {

    const [form] = useForm();
    const { editing, toggleEditing, setEditingOff } = useToggleEditing();
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [selectedGender, setSelectedGender] = useState<string>(initialValues?.gender || 'Male');
    const [selectedExperience, setSelectedExperience] = useState<string>(initialValues?.experience || 'Beginner');

    const isLoading = !initialValues;

    useFormAutoSync(form, initialValues);


    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
            setSelectedPreferences(initialValues.preferences || []);
            setSelectedGoal(initialValues.goal_id || null);
            setSelectedGender(initialValues.gender || 'Male');
            setSelectedExperience(initialValues.experience || 'Beginner');
        }
    }, [initialValues, form]);

    const handleSubmit = async () => {
        const changedFields = getChangedFields(form, initialValues);
        if (Object.keys(changedFields).length === 0) {
            message.info("No changes made.");
            return;
        }
        await onSave(changedFields);
        setEditingOff();
    };

    if (isLoading) {
        return (
            <Card>
                <Skeleton active paragraph={{ rows: 6 }} />
            </Card>
        );
    }

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
            <AnimatePresence mode="wait">
                <motion.div
                    key={editing ? "edit" : "view"}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                        initialValues={initialValues}
                        disabled={!editing}
                    >
                        <Card title="Personal Information" className="mb-4 bg-gray-50">
                            {editing ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Form.Item name="email" label="Email" rules={[
                                        { required: true, message: "Email is required" },
                                        { type: "email", message: "Enter a valid email" },
                                        {
                                            validator: async (_, value) => {
                                                if (!value || value === initialValues.email) return Promise.resolve();
                                                const exists = await checkUserEmailExist(value);
                                                if (exists) return Promise.reject(new Error("This email address is already in use."));
                                                return Promise.resolve();
                                            }
                                        }
                                    ]} hasFeedback>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }]} hasFeedback>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item name="first_name" label="First Name" rules={[{ required: true }]} hasFeedback>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]} hasFeedback>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item name="address" label="Address" className="md:col-span-2" rules={[{ required: true }]} hasFeedback>
                                        <Input />
                                    </Form.Item>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-1 block">Email</label>
                                        <div className="text-gray-900">{initialValues.email}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-1 block">Phone Number</label>
                                        <div className="text-gray-900">{initialValues.phone_number}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-1 block">First Name</label>
                                        <div className="text-gray-900">{initialValues.first_name}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-900 mb-1 block">Last Name</label>
                                        <div className="text-gray-900">{initialValues.last_name}</div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-900 mb-1 block">Address</label>
                                        <div className="text-gray-900">{initialValues.address}</div>
                                    </div>
                                </div>
                            )}
                        </Card>

                        <Card title="Fitness Profile" className="mb-4 bg-gray-50">
                            {editing ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Form.Item name="age" label="Age" rules={[{ required: true }, { type: "number", min: 1, max: 120 }]} hasFeedback>
                                        <InputNumber className="w-full" min={1} />
                                    </Form.Item>
                                    <Form.Item name="height" label="Height (cm)" rules={[{ required: true }]} hasFeedback>
                                        <InputNumber className="w-full" min={1} />
                                    </Form.Item>
                                    <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true }]} hasFeedback>
                                        <InputNumber className="w-full" min={1} />
                                    </Form.Item>

                                    <Form.Item name="gender" label="Gender" className="md:col-span-3" rules={[{ required: true }]} hasFeedback>
                                        <div className="flex gap-2">
                                            {['Male', 'Female'].map((g) => (
                                                <Tag.CheckableTag
                                                    key={g}
                                                    checked={selectedGender === g}
                                                    onChange={() => {
                                                        setSelectedGender(g);
                                                        form.setFieldValue('gender', g);
                                                    }}
                                                    className={`custom-gender-tag ${g === 'Male' ? 'male' : 'female'}`}
                                                >
                                                    {g}
                                                </Tag.CheckableTag>
                                            ))}
                                        </div>
                                    </Form.Item>

                                    <Form.Item name="experience" label="Experience" className="md:col-span-3" rules={[{ required: true }]} hasFeedback>
                                        <div className="tag-grid">
                                            {['Beginner', 'Intermediate', 'Advanced', 'Athlete', 'Elderly'].map((exp) => (
                                                <Tag.CheckableTag
                                                    key={exp}
                                                    checked={selectedExperience === exp}
                                                    onChange={() => {
                                                        setSelectedExperience(exp);
                                                        form.setFieldValue('experience', exp);
                                                    }}
                                                >
                                                    {exp}
                                                </Tag.CheckableTag>
                                            ))}
                                        </div>
                                    </Form.Item>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 mb-1 block">Age</label>
                                            <div className="text-gray-900">{initialValues.age} years</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 mb-1 block">Height</label>
                                            <div className="text-gray-900">{initialValues.height} cm</div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 mb-1 block">Weight</label>
                                            <div className="text-gray-900">{initialValues.weight} kg</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 mb-1 block">Gender</label>
                                            <Tag color={selectedGender === "Female" ? "magenta" : "blue"}>{selectedGender}</Tag>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-900 mb-1 block">Experience</label>
                                            <Tag color="blue">{selectedExperience || "Not selected"}</Tag>
                                        </div>
                                    </div>
                                </>
                            )}
                        </Card>

                        <Card title="Goals & Preferences" className="mb-4 bg-gray-50">
                            <Form.Item label="Fitness Goal" required hasFeedback>
                                {editing ? (
                                    <div className="tag-grid mt-2">
                                        {availableGoals.map((goal) => (
                                            <Tag.CheckableTag
                                                key={goal.id}
                                                checked={selectedGoal === goal.id}
                                                onChange={() => {
                                                    setSelectedGoal(goal.id);
                                                    form.setFieldValue("goal_id", goal.id);
                                                }}
                                            >
                                                {goal.name}
                                            </Tag.CheckableTag>
                                        ))}
                                    </div>
                                ) : (
                                    <Tag color="blue">
                                        {availableGoals.find((g) => g.id === selectedGoal)?.name || 'Not selected'}
                                    </Tag>
                                )}
                            </Form.Item>

                            <Form.Item name="goal_id" hidden rules={[{ required: true, message: "Please select a goal" }]}  hasFeedback />

                            <Form.Item name="preferences" label="Exercise Preferences" rules={[{ required: true }]} hasFeedback>
                                {editing ? (
                                    <div className="tag-grid mt-2">
                                        {availableTags.map((tag) => {
                                            const selected = selectedPreferences.includes(tag.id);
                                            return (
                                                <Tag.CheckableTag
                                                    key={tag.id}
                                                    checked={selected}
                                                    onChange={(checked) => {
                                                        const updated = checked
                                                            ? [...selectedPreferences, tag.id]
                                                            : selectedPreferences.filter((id) => id !== tag.id);
                                                        setSelectedPreferences(updated);
                                                        form.setFieldValue("preferences", updated);
                                                    }}
                                                >
                                                    {tag.name}
                                                </Tag.CheckableTag>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {availableTags
                                            .filter((tag) => selectedPreferences.includes(tag.id))
                                            .map((tag) => (
                                                <Tag key={tag.id} color="blue">{tag.name}</Tag>
                                            ))}
                                    </div>
                                )}
                            </Form.Item>
                        </Card>

                        {editing && (
                            <div className="sticky bottom-0 bg-white py-3 flex justify-end border-t mt-6 shadow-md z-10">
                                <Button type="primary" htmlType="submit">
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </Form>

                </motion.div>
            </AnimatePresence>
        </>
    );
};

export default UserProfileForm;