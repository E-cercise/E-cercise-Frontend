import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Button,
    InputNumber,
    Steps,
    Tag,
    Typography,
    Divider,
    Row,
    Col
} from 'antd';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { UserGoal, UserTag } from '../../interfaces/UserProfile.ts';
import './RegisterForm.css';

const { Step } = Steps;
const { Title, Text } = Typography;

const experienceOptions = ['Beginner', 'Intermediate', 'Advanced', 'Athlete', 'Elderly'];
const genderOptions = ['Male', 'Female'];

interface RegisterFormProps {
    onSubmit: (values: any) => void;
    loading: boolean;
    goals: UserGoal[];
    tags: UserTag[];
    errorFields?: Record<string, string>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading, goals, tags, errorFields }) => {
    const [form] = Form.useForm();
    const [current, setCurrent] = useState(0);
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<string>('Beginner');

    const stepFields = [
        ['email', 'password', 'confirm_password'],
        ['first_name', 'last_name', 'address', 'phone_number'],
        ['Age', 'height', 'weight', 'gender', 'experience'],
        ['goal_id', 'preferences']
    ];

    useEffect(() => {
        if (errorFields) {
            const fieldErrors = Object.entries(errorFields).map(([name, message]) => ({
                name: [name],
                errors: [message.replace(/'/g, '')]
            }));
            form.setFields(fieldErrors);
        }
    }, [errorFields]);

    const next = async () => {
        try {
            await form.validateFields(stepFields[current]);
            setCurrent(current + 1);
        } catch (err) {}
    };

    const prev = () => setCurrent(current - 1);

    const steps = [
        {
            title: 'Account Info',
            content: (
                <>
                    <Title level={4}>Create Your Account</Title>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Please enter a valid email address' },
                        ]}
                    >
                        <Input placeholder="example@email.com" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Password is required' }]}
                    >
                        <Input.Password placeholder="Choose a strong password" />
                    </Form.Item>
                    <Form.Item
                        name="confirm_password"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const password = getFieldValue('password');
                                    if (!value) return Promise.reject(new Error('Please confirm your password'));
                                    if (value !== password) return Promise.reject(new Error('Passwords do not match'));
                                    return Promise.resolve();
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Repeat your password" />
                    </Form.Item>
                </>
            )
        },
        {
            title: 'Personal Info',
            content: (
                <>
                    <Title level={4}>Tell Us About You</Title>
                    <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}> <Input /></Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}> <Input /></Form.Item>
                    <Form.Item name="address" label="Address" rules={[{ required: true }]}> <Input /></Form.Item>
                    <Form.Item name="phone_number" label="Phone Number" rules={[{ required: true }, { pattern: /^(\+6\d{8,}|[0-9]{10})$/, message: 'Enter a valid number (10 digits or start with +6X)' }]}> <Input placeholder="e.g., +60123456789 or 0123456789" /></Form.Item>
                </>
            )
        },
        {
            title: 'Fitness Profile',
            content: (
                <>
                    <Title level={4}>Your Fitness Profile</Title>
                    <Row gutter={16}>
                        <Col span={8}><Form.Item name="Age" label="Age" rules={[{ required: true }]}> <InputNumber className="w-full" min={0} /></Form.Item></Col>
                        <Col span={8}><Form.Item name="height" label="Height (cm)" rules={[{ required: true }]}> <InputNumber className="w-full" min={0} placeholder="e.g., 170" /></Form.Item></Col>
                        <Col span={8}><Form.Item name="weight" label="Weight (kg)" rules={[{ required: true }]}> <InputNumber className="w-full" min={0} placeholder="e.g., 65" /></Form.Item></Col>
                    </Row>
                    <Divider orientation="left">Gender</Divider>
                    <Text type="secondary">Select your gender</Text>
                    <Form.Item name="gender" rules={[{ required: true }]}> <div className="flex gap-2 mt-2"> {genderOptions.map((g) => (<Tag.CheckableTag key={g} checked={form.getFieldValue('gender') === g} onChange={() => form.setFieldValue('gender', g)} className={`custom-gender-tag ${g === 'Male' ? 'male' : 'female'}`}>{g}</Tag.CheckableTag>))} </div></Form.Item>
                    <Divider orientation="left">Experience</Divider>
                    <Text type="secondary">How would you describe your current experience?</Text>
                    <Form.Item name="experience" rules={[{ required: true }]}> <div className="tag-grid"> {experienceOptions.map((exp) => (<Tag.CheckableTag key={exp} checked={selectedExperience === exp} onChange={() => { setSelectedExperience(exp); form.setFieldValue('experience', exp); }}>{exp}</Tag.CheckableTag>))} </div></Form.Item>
                </>
            )
        },
        {
            title: 'Fitness Setup',
            content: (
                <>
                    <Divider orientation="left">Fitness Goal</Divider>
                    <Text type="secondary">What’s your main objective for exercising?</Text>
                    <Form.Item required>
                        <div className="tag-grid">{goals.map((g) => (<Tag.CheckableTag key={g.id} checked={selectedGoal === g.id} onChange={() => { setSelectedGoal(g.id); form.setFieldValue('goal_id', g.id); }}>{g.name}</Tag.CheckableTag>))}</div>
                    </Form.Item>
                    <Form.Item name="goal_id" hidden rules={[{ required: true, message: 'Please select a goal' }]} />

                    <Divider orientation="left">Exercise Preferences</Divider>
                    <Text type="secondary">Choose what kind of exercises or activities you enjoy.</Text>
                    <Form.Item required>
                        <div className="tag-grid">{tags.map((tag) => { const selected = selectedPreferences.includes(tag.id); return (<Tag.CheckableTag key={tag.id} checked={selected} onChange={(checked) => { const updated = checked ? [...selectedPreferences, tag.id] : selectedPreferences.filter((id) => id !== tag.id); setSelectedPreferences(updated); form.setFieldValue('preferences', updated); }}>{tag.name}</Tag.CheckableTag>); })}</div>
                    </Form.Item>
                    <Form.Item name="preferences" hidden rules={[{ required: true, message: 'Please select at least one preference' }]} />
                </>
            )
        }
    ];

    return (
        <>
            <Steps current={current} className="mb-6">{steps.map((item, index) => (<Step key={index} title={item.title} />))}</Steps>
            <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={{ gender: 'Male', experience: 'Beginner' }}>
                <TransitionGroup>
                    <CSSTransition key={current} classNames="fade" timeout={300}>
                        <div>{steps[current].content}</div>
                    </CSSTransition>
                </TransitionGroup>
                <div className="flex justify-between mt-8">
                    {current > 0 && <Button onClick={prev} size="large">Previous</Button>}
                    {current < steps.length - 1 && <Button type="primary" onClick={next} size="large">Next</Button>}
                    {current === steps.length - 1 && <Button type="primary" htmlType="submit" size="large" loading={loading}>Register</Button>}
                </div>
            </Form>
        </>
    );
};

export default RegisterForm;
