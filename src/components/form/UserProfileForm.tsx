import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Tag,
    Tooltip,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useToggleEditing } from "../../hook/useToggleEditing.ts";
import { useFormAutoSync } from "../../hook/useFormAutoSync.ts";
import "./UserProfileForm.css";
import { UserGoal, UserTag } from "../../interfaces/UserProfile.ts";
import React, { useEffect, useState } from "react";
import {getChangedFields} from "../../helper/formHelper.ts";

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

                    <Form.Item name="age" label="Age" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>

                    <Form.Item name="height" label="Height (cm)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>

                    <Form.Item name="weight" label="Weight (kg)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" min={0} />
                    </Form.Item>

                    <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                        {editing ? (
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
                        ) : (
                            <Tag color={selectedGender === "Female" ? "magenta" : "blue"}>
                                {selectedGender}
                            </Tag>
                        )}
                    </Form.Item>

                    <Form.Item name="experience" label="Experience" rules={[{ required: true }]}>
                        {editing ? (
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
                        ) : (
                            <Tag color="blue">{selectedExperience || "Not selected"}</Tag>
                        )}
                    </Form.Item>

                    <Form.Item label="Fitness Goal" required>
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

                    <Form.Item name="goal_id" hidden rules={[{ required: true, message: "Please select a goal" }]} />

                    <Form.Item name="preferences" label="Exercise Preferences" rules={[{ required: true }]}>
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
