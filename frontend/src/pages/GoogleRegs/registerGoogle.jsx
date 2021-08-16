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
import {dial} from '../Countries'
import { useMutation } from '@apollo/client'
import { REGISTER_USER_GOOGLE } from '../../GraphQL/Mutations'

import { LoadingOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/auth'
import './style.css'


const { Option } = Select;
const gender = [
    {
        value: 'Male',
        label: 'Male',
    },
    {
        value: 'Female',
        label: 'Female',
    },
    {
        value: 'Other',
        label: 'Other',
    },
];



const RegisterGoogle = (props) => {
    const context = useContext(AuthContext)
    const [form] = Form.useForm();
    const [errors, setErrors] = useState({});

    const [registerUserGoogle, { loading }] = useMutation(REGISTER_USER_GOOGLE, {
        update(_, { data: { registerUserWithGoogle } }){
            context.login(registerUserWithGoogle)
            props.history.push('/')
        },
        onError(err) {
            setErrors(err.message)
        }
    })

    const onFinish = (values) => {
        const { birthday, gender, phone, phoneCode } = values

        console.log(phone, "value", values);
        const { email, username, imageUrl, token, id } = context.googleData
        registerUserGoogle({ variables: { gender: gender[0], birthday: birthday._d, mobileNumber: `${phoneCode ? phoneCode : '+62'  + phone}`, username, email, imageUrl, token, id } })
    };
    const onCloseErr = (e) => {
        console.log(e, 'I was closed.');
    };
    
    const dialData = dial.map(item => {
        return <Option key={item.code} value={item.dial_code}>{item.dial_code}</Option>
       })
        const phoneForm = (
            <Form.Item name="phoneCode" noStyle>
                <Select
                defaultValue="+62"
                    style={{
                        width: 70,
                    }}>
                   {dialData}
                </Select>
            </Form.Item>
        );

    return (
            <div>
                <Link to='/' className="header-page">
                <div className="curious centeringImage" style={{ marginTop: 50 }} />
                </Link>
                
                <div className="landing-card">
                    <div className="content">

                        <Form
                            form={form}
                            name="register"
                            onFinish={onFinish}
                            initialValues={{
                                prefix: '86',
                            }}
                            scrollToFirstError
                        >
            <h3>Hello, {context.googleData.username}</h3>
            <p>isi data data di bawah untuk menyelesaikan pendaftaran anda</p>
            <Form.Item
            rules={[
              {
                  required: true,
                  message: 'Please Enter Your Username',
              },
              {
                validator(_, value) {
                  const regexlength = /^(?=.{8,20}$)/
                  if ( !(value.match(regexlength)) )  return Promise.reject('Username should have 8-20 caracter');
                  const regex_ = /^(?![_.])/
                  if ( !(value.match(regex_)) )  return Promise.reject('cant use "_" or "." at the begining ');
                  const regex = /^(?=.{8,20}$)(?![_.])[a-zA-Z0-9._]+(?<![])$/
                  if ( !(value.match(regex)) )  return Promise.reject('Username cant use "space" or any special caracter');
                  else return Promise.resolve();
                }
              }
          ]}
              name="username"
              className="edit-profile__textfield"
            >
              <Input
                placeholder="Username" />
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
                <Cascader  placeholder="Chose gender" options={gender} />
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
                placeholder="Your Phone Number Here"
                    addonBefore={phoneForm}
                    style={{
                        width: '100%',
                    }}
                />
            </Form.Item>

            <Form.Item
            style={{width: '100%'}}
                name="birthday"
                rules={[
                    {
                        required: true,
                        message: 'Please input your birthday!',
                    },
                ]}
            >
                <DatePicker style={{width:"100%"}} />
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
            >
                <Checkbox>
                    I have read the agreement
                </Checkbox>
            </Form.Item>

            <Form.Item>
              <button className="ui  facebook button body-page__btn-send" type="submit" 
              style={{ fontSize: '18px',padding: 0 }}>
                {loading ? (<LoadingOutlined />): ("Sign in")} 
              </button>
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
    );
};

export default RegisterGoogle
