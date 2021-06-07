import React, { useContext, useState } from 'react';
import {
    Form,
    Input,
    Cascader,
    Select,
    Checkbox,
    Button,
    DatePicker,
    Alert
} from 'antd';
import { useMutation } from '@apollo/client'
import { REGISTER_USER } from '../GraphQL/Mutations'

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

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 24,
            offset: 0,
        },
    },
};

const Register = (props) => {
    const context = useContext(AuthContext)
    const [form] = Form.useForm();
    const [errors, setErrors] = useState({});
    console.log(context.facebookData);

    const [registerUser, { loading, data }] = useMutation(REGISTER_USER, {
        update(_, { data: { registerUser: userData } }) {
            context.login(userData)
            props.history.push('/')
        },
        onError(err) {
            console.log(err.message);
            setErrors(err.message)
        }
    })

    const onFinish = (values) => {
        const { birthday, email, gender, username, password, phone, phoneCode } = values

        registerUser({ variables: { username, email, password, gender: gender[0], birthday: birthday._d, mobileNumber: `${phoneCode + phone}` } })
        console.log('Received values of form: ', values);
    };
    const onCloseErr = (e) => {
        console.log(e, 'I was closed.');
    };

    console.log(loading, data);
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
        <div>
            <div>
                <div className="centeringImage">
                <div className="curious centeringImage" style={{ marginTop: 50, }} />
                </div>
                <div>

                </div>
                <div class="ui card container centeringImage" style={{ width: 447, marginTop: 30, paddingTop: 30, padding: 30 }}>
                    <div class="content">
                        <Form
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
                                name="email"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                ]}
                            >

                                <Input placeholder="Email adress" />
                            </Form.Item>
                            <Form.Item

                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your phone number!',
                                    },
                                ]}


                            >
                                <Input
                                    addonBefore={phoneCode}
                                    placeholder="Phone number"
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                className="radius"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your nickname!',
                                        whitespace: true,
                                    },
                                ]}
                            >
                                <Input placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                                hasFeedback
                            >
                                <Input.Password placeholder="Password" />
                            </Form.Item>
                            <Form.Item
                                name="birthday"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your birthday!'
                                    },
                                ]}
                            >
                                <DatePicker placeholder="birthday" style={{ width: 359 }} />
                            </Form.Item>

                            <Form.Item
                                name="gender"
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
                                name="agreement"
                                valuePropName="checked"
                                rules={[
                                    {
                                        validator: (_, value) =>
                                            value ? Promise.resolve() : Promise.reject('Should accept agreement'),
                                    },
                                ]}
                                {...tailFormItemLayout}
                                style={{ marginRight: 160 }}
                            >
                                <Checkbox >
                                    I have read the agreement
                </Checkbox>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='centeringButton' style={{ marginTop: 10, backgroundColor: '#7f57ff' }}>
                                    Register
                                </Button>
                                <p style={{ fontSize: 12, textAlign: 'center', marginTop: 60 }}>By signing up, you agree to our <span style={{ fontWeight: 'bold' }}>Terms & Privacy Policy</span></p>
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

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register