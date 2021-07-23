import React, { useState, useContext, useEffect } from 'react'
import { Form, Input, Alert } from 'antd';

import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../GraphQL/Mutations'

import { AuthContext } from '../context/auth'
import { Link } from 'react-router-dom';
import { auth } from '../util/Firebase';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

export default function ReserPasswordForm(props) {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({});

    

    const onFinish = (values) => {
        const { email } = values

        auth.sendPasswordResetEmail(email).then(
            console.log("email sent@")
        )
        .catch(error => {
            console.log(error)
        })
    };

    const onCloseErr = (e) => {
        console.log(e, 'I was closed.');
    };

    return (
        <div>
            <Link to='/'>
            <div className="curious" />
            </Link>
            <div className="ui card container" >
                <div className="content">
                    <h1>We Got Your Back!</h1>
                    <h3>Just type your new Password here!</h3>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            
                        >
                            <Input.Password style={{ width: '100%' }} placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <button className="ui facebook button" type="submit" style={{ backgroundColor: '#7F57FF', width: 359, height: 40 }}>
                                Set New Password
                            </button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            {Object.keys(errors).length > 0 && (
                <Alert
                    message={errors}
                    type="error"
                    closable
                    onClose={onCloseErr}
                />
            )}
        </div>
    );
};

