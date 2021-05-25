import React, { useContext, useState } from 'react';
import {
    Form,
    Input,
    Tooltip,
    Cascader,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Alert
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@apollo/client'
import { REGISTER_USER_FACEBOOK } from '../GraphQL/Mutations'

import { AuthContext } from '../context/auth'


const { Option } = Select;
const gender = [
    {
        value: 'male',
        label: 'male',
    },
    {
        value: 'female',
        label: 'female',
    },
    {
        value: 'other',
        label: 'other',
    },
];
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const RegisterFacebook = (props) => {
    const context = useContext(AuthContext)
    const [form] = Form.useForm();
    const [errors, setErrors] = useState({});

    const [registerUserFacebook] = useMutation(REGISTER_USER_FACEBOOK, {
        update(_, { data: { registerUserWithFacebook: userData } }){
            context.login(userData)
            props.history.push('/')
        },
        onError(err) {
            console.log(err.message);
            setErrors(err.message)
        }
    })

    const onFinish = (values) => {
        const { birthday, gender, phone, phoneCode } = values
        const { email, username, imageUrl, token, id } = context.facebookData
        registerUserFacebook({ variables: { gender: gender[0], birthday: birthday._d, mobileNumber: `${phoneCode + phone}`, username, email, imageUrl, token, id } })
        console.log(context.facebookData, values);
    };
    const onCloseErr = (e) => {
        console.log(e, 'I was closed.');
    };
    const phoneCode = (
        <Form.Item name="phoneCode" noStyle>
            <Select
                style={{
                    width: 70,
                }}
            >
                <Option value="+62">+62</Option>
                <Option value="+87">+87</Option>
            </Select>
        </Form.Item>
    );

    return (
        <Form
            {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
                residence: ['zhejiang', 'hangzhou', 'xihu'],
                prefix: '86',
            }}
            scrollToFirstError
        >
            <Form.Item
                label="E-mail"
            >
                {context.facebookData.email}
            </Form.Item>

            <Form.Item
                label={
                    <span>
                        Nickname&nbsp;
            <Tooltip title="What do you want others to call you?">
                            <QuestionCircleOutlined />
                        </Tooltip>
                    </span>
                }
            >
                {context.facebookData.username}
            </Form.Item>

            <Form.Item
                name="gender"
                label="chose gender"
                rules={[
                    {
                        type: 'array',
                        required: true,
                        message: 'Please select your gender!',
                    },
                ]}
            >
                <Cascader options={gender} />
            </Form.Item>

            <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                    {
                        required: true,
                        message: 'Please input your phone number!',
                    },
                ]}
            >
                <Input
                    addonBefore={phoneCode}
                    style={{
                        width: '100%',
                    }}
                />
            </Form.Item>

            <Form.Item
                label="birthday"
                name="birthday"
                rules={[
                    {
                        required: true,
                        message: 'Please input your birthday!',
                    },
                ]}
            >
                <DatePicker />
            </Form.Item>

            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    {
                        validator: (_, value) =>
                            value ? Promise.resolve() : Promise.reject('Should accept agreement'),
                    },
                ]}
                {...tailFormItemLayout}
            >
                <Checkbox>
                    I have read the agreement
                </Checkbox>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">
                    Register
        </Button>
            </Form.Item>
            {Object.keys(errors).length > 0 && (
                <Alert
                    message={errors}
                    type="error"
                    closable
                    onClose={onCloseErr}
                />
            )}
        </Form>
    );
};

export default RegisterFacebook
