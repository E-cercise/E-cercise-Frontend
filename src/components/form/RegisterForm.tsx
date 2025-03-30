import React, {useEffect, useState} from 'react';
import {Button, Col, Divider, Form, Input, InputNumber, message, Row, Steps, Tag, Typography,} from 'antd';
import {UserGoal, UserTag} from '../../interfaces/UserProfile.ts';
import './RegisterForm.css';
import {checkUserEmailExist} from "../../api/user_profile/CheckUserEmailExists.ts";

const {Step} = Steps;
const {Title, Text} = Typography;

const experienceOptions = ['Beginner', 'Intermediate', 'Advanced', 'Athlete', 'Elderly'];
const genderOptions = ['Male', 'Female'];

interface RegisterFormProps {
    onSubmit: (values: any) => void;
    loading: boolean;
    goals: UserGoal[];
    tags: UserTag[];
    errorFields?: Record<string, string>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
                                                       onSubmit,
                                                       loading,
                                                       goals,
                                                       tags,
                                                       errorFields,
                                                   }) => {
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<string>('Beginner');
    const [genderValue, setGenderValue] = useState<string>('Male');

    const stepFields = [
        ['email', 'password', 'confirm_password'],
        ['first_name', 'last_name', 'address', 'phone_number'],
        ['Age', 'height', 'weight', 'gender', 'experience'],
        ['goal_id', 'preferences'],
    ];

    useEffect(() => {
        if (errorFields) {
            const fieldErrors = Object.entries(errorFields).map(([name, message]) => ({
                name,
                errors: [message],
            }));
            form.setFields(fieldErrors);
        }
    }, [errorFields]);

    const next = async () => {
        try {
            await form.validateFields(stepFields[current]);
            setCurrent(current + 1);
        } catch (err) {
            if (err instanceof Error) {
                message.error(err.message);
            } else {
                message.error("Validation failed. Please check the form.");
            }
        }
    };

    const prev = () => setCurrent(current - 1);

    const steps = [
        {
            title: 'Account Info',
            content: (
                <>
                    <Title level={4}>Create Your Account</Title>
                    <Form.Item name="email" label="Email"
                               rules={[{required: true, type: 'email'},
                                   {type: 'email', message: 'Enter a valid email'},
                                   {
                                       validator: async (_, value) => {
                                           if (!value) {
                                               return Promise.resolve();
                                           }
                                           const exists = await checkUserEmailExist(value);

                                           if (exists) {
                                               return Promise.reject(
                                                   new Error('This email address is already in use.')
                                               );
                                           }

                                           return Promise.resolve();
                                       },
                                   },
                               ]} hasFeedback>
                        <Input placeholder="example@email.com"/>
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{required: true}]} hasFeedback>
                        <Input.Password placeholder="Choose a strong password"/>
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            {required: true},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    return value === getFieldValue('password')
                                        ? Promise.resolve()
                                        : Promise.reject('Passwords do not match');
                                },
                            }),
                        ]}
                        hasFeedback>
                        <Input.Password placeholder="Repeat your password"/>
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Personal Info',
            content: (
                <>
                    <Title level={4}>Tell Us About You</Title>
                    <Form.Item name="first_name" label="First Name" rules={[{required: true}]} hasFeedback>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{required: true}]} hasFeedback>
                        <Input/>
                    </Form.Item>
                    <Form.Item name="address" label="Address" rules={[{required: true}]} hasFeedback>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="phone_number"
                        label="Phone Number"
                        rules={[
                            {required: true},
                            {
                                pattern: /^(\+6\d{8,}|[0-9]{10})$/,
                                message: 'Enter a valid number (10 digits or start with +6X)',
                            },
                        ]}
                        hasFeedback>
                        <Input placeholder="e.g., +60123456789 or 0123456789"/>
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Fitness Profile',
            content: (
                <>
                    <Title level={4}>Your Fitness Profile</Title>
                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item name="Age" label="Age" rules={[{required: true},
                                { type: "number", min: 1, max: 120, message: "Age must be between 1 and 120" }
                            ]}  hasFeedback>
                                <InputNumber className="w-full" min={0}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="height" label="Height (cm)" rules={[{required: true}]} hasFeedback>
                                <InputNumber className="w-full" min={0} placeholder="e.g., 170"/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="weight" label="Weight (kg)" rules={[{required: true}]} hasFeedback>
                                <InputNumber className="w-full" min={0} placeholder="e.g., 65"/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider orientation="left">Gender</Divider>
                    <Text type="secondary">Select your gender</Text>
                    <Form.Item name="gender" rules={[{required: true}]} hasFeedback>
                        <div className="flex gap-2 mt-2">
                            {genderOptions.map((g) => (
                                <Tag.CheckableTag
                                    key={g}
                                    checked={genderValue === g}
                                    onChange={() => {
                                        setGenderValue(g);
                                        form.setFieldValue('gender', g);
                                    }}
                                    className={`custom-gender-tag ${g === 'Male' ? 'male' : 'female'}`}
                                >
                                    {g}
                                </Tag.CheckableTag>
                            ))}
                        </div>
                    </Form.Item>

                    <Divider orientation="left">Experience</Divider>
                    <Text type="secondary">How would you describe your current experience?</Text>
                    <Form.Item name="experience" rules={[{required: true}]} hasFeedback>
                        <div className="tag-grid mt-2">
                            {experienceOptions.map((exp) => (
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
                </>
            ),
        },
        {
            title: 'Fitness Setup',
            content: (
                <>
                    <Divider orientation="left">Fitness Goal</Divider>
                    <Text type="secondary">What’s your main objective for exercising?</Text>
                    <Form.Item required hasFeedback>
                        <div className="tag-grid mt-2">
                            {goals.map((g) => (
                                <Tag.CheckableTag
                                    key={g.id}
                                    checked={selectedGoal === g.id}
                                    onChange={() => {
                                        setSelectedGoal(g.id);
                                        form.setFieldValue('goal_id', g.id);
                                    }}
                                >
                                    {g.name}
                                </Tag.CheckableTag>
                            ))}
                        </div>
                    </Form.Item>
                    <Form.Item name="goal_id" hidden rules={[{required: true, message: 'Please select a goal'}]} hasFeedback/>

                    <Divider orientation="left">Exercise Preferences</Divider>
                    <Text type="secondary">Choose what kind of exercises or activities you enjoy.</Text>
                    <Form.Item required hasFeedback>
                        <div className="tag-grid mt-2">
                            {tags.map((tag) => {
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
                                            form.setFieldValue('preferences', updated);
                                        }}
                                    >
                                        {tag.name}
                                    </Tag.CheckableTag>
                                );
                            })}
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="preferences"
                        hidden
                        rules={[{required: true, message: 'Please select at least one preference'}]}
                        hasFeedback
                    />
                </>
            ),
        },
    ];

    return (
        <>
            <Steps current={current} className="mb-6">
                {steps.map((item, index) => (
                    <Step key={index} title={item.title}/>
                ))}
            </Steps>

            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={{
                    gender: 'Male',
                    experience: 'Beginner',
                }}
            >
                {steps[current].content}

                <div className="flex justify-between mt-8">
                    {current > 0 && (
                        <Button onClick={prev} size="large">
                            Previous
                        </Button>
                    )}
                    {current < steps.length - 1 && (
                        <Button type="primary" onClick={next} size="large">
                            Next
                        </Button>
                    )}
                    {current === steps.length - 1 && (
                        <>
                            <Form.Item noStyle shouldUpdate>
                            {() => {
                                const allFields = form.getFieldsValue(true);
                                return (
                                    <>
                                        {Object.entries(allFields).map(([key]) => (
                                            <Form.Item key={key} name={key} hidden>
                                                <Input/>
                                            </Form.Item>
                                        ))}
                                    </>
                                );
                            }}
                        </Form.Item>
                            <Button type="primary" htmlType="submit" size="large" loading={loading}>
                                Register
                            </Button>
                        </>
                    )}
                </div>
            </Form>
        </>
    );
};

export default RegisterForm;
