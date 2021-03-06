import React, { useContext, useState } from 'react';
import {
    Form,
    Input,
    Cascader,
    Select,
    Checkbox,
    DatePicker,
    Alert
} from 'antd';
import { useMutation } from '@apollo/client'
import { REGISTER_USER } from '../GraphQL/Mutations'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'

import { LoadingOutlined } from "@ant-design/icons";

import {dial} from './Countries'
import CustomModal from '../components/Modal/customModal';
import TOU from './legal/TeromOfUse';
import { Helmet } from 'react-helmet';
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
    const [openModal, setOpenModal] = useState(false)
    const context = useContext(AuthContext)
    const [form] = Form.useForm();
    const [errors, setErrors] = useState({});

    const [registerUser, { loading, data }] = useMutation(REGISTER_USER, {
        update(_, { data: { registerUser: userData } }) {
            context.login(userData)
            props.history.push('/')
        },
        onError(err) {
            console.log(err.message);
            setErrors(err.message.split(":")[1] || err.message)
        }
    })

    const onFinish = (values) => {
        const { birthday, email, gender, username, password, phone, phoneCode } = values

        registerUser({ variables: { username, email, password, gender: gender[0], birthday: birthday._d, mobileNumber: `${(phoneCode || "+62") + phone}` } })
    };

   const dialData = dial.map(item => {
    return <Option key={item.code} value={item.dial_code}>{item.dial_code}</Option>
   })
    const phoneCode = (
        <Form.Item name="phoneCode" noStyle>
            <Select

                defaultValue='+62'

                style={{
                    width: 70,
                }}
            >
               {dialData}
            </Select>
        </Form.Item>
    );

    return (
        <div >
            <Helmet>
     <title>Sign Up Now!</title>
     <meta name="description" content="Join us and meet new people" />
    </Helmet>
            <CustomModal click={openModal} setOpenModal={setOpenModal} title={"Term Of Use"} ><TOU  setOpenModal={setOpenModal} /></CustomModal>
            <div >
                <Link to ='/'>
                <div className="centeringImage">
                <div className="curious centeringImage" style={{ marginTop: 50,marginBottom: 10 }} />
                </div>
                </Link>
                
                <div>

                </div>
                <div className="landing-card">
                    <div className="content">
                        <Form
                            form={form}
                            name="register"
                            onFinish={onFinish}
                            initialValues={{
                                prefix: '+62'
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

                                <Input placeholder="Email adress" style={{width:"100%"}} />
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
                                    style={{width: "100%"}}
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
                                    }
                                    ,
                                    {
                                        validator(_, value) {
                                        const regexlength = /^(?=.{5,20}$)/ 
                                        if ( !(value.match(regexlength)) )  return Promise.reject('Username should have 5-20 caracter');
                                        const regex = /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$/
                                        if ( !(value.match(regex)) )  return Promise.reject('Username cannot use "space" or any special character unless _ and .');
                                        else return Promise.resolve();
                                        }
                                    }
                                ]}
                            >
                                <Input placeholder="Username"  style={{width:"100%"}}/>
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    }
                                ]}
                                hasFeedback
                            >
                                <Input.Password style={{backgroundColor: '#FAFAFF', borderRadius: 10, paddingTop: 0, paddingBottom: 0, width: "100%"}} placeholder="Password" />
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
                                <DatePicker placeholder="When is your birthday?" style={{width:"100%"}}  />
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
                                <Cascader placeholder="please select your gender" style={{backgroundColor: '#FAFAFF', height:"100%"}} options={gender} />
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
                                <Checkbox  style={{width: 200}}>
                                    I have read the agreement
                                </Checkbox>
                            </Form.Item>

                            {Object.keys(errors).length > 0 && (
                                <Alert
                                    message={errors}
                                    type="error"
                                    closable
                                    style={{marginBottom: 10}}
                                />
                            )}

                            <Form.Item>
                            <button className="ui facebook button body-page__btn-send" type="submit" 
                                style={{ fontSize: '18px',padding: 0 }}>
                                    {loading ? (<LoadingOutlined />): ("Register")} 
                                </button>
                                <p style={{ fontSize: 12, textAlign: 'center', marginTop: 60 }}>By signing up, you agree to our <span onClick={ () => setOpenModal(true)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>Terms & Privacy Policy</span></p>
                            </Form.Item>
                            
                        </Form>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register