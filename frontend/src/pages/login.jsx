import React, { useState, useContext, useEffect } from 'react'
import { Form, Input, Alert } from 'antd';

import { useMutation, useLazyQuery } from '@apollo/client'
import { LOGIN_USER } from '../GraphQL/Mutations'

import { AuthContext } from '../context/auth'
import { Link } from 'react-router-dom';
import { GET_USER_DATA } from '../GraphQL/Queries';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const Login = (props) => {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({});

    const [login] = useMutation(LOGIN_USER, {
        update(_, { data: { login } }) {
            
            context.login(login)
            props.history.push('/')
        },
        onError(err) {
            setErrors(err.message)
        }
    })

    const onFinish = (values) => {
        const { username, password } = values

        login({ variables: { username, password } })
    };

    const onCloseErr = (e) => {
        console.log(e, 'I was closed.');
    };

    return (
        <div>
            <div className="curious" style={{ marginLeft: 710, marginTop: 100 }} />
            <div className="ui card container" style={{ width: 447, marginTop: 30, paddingTop: 30, padding: 30 }}>
                <div className="content">
                    <h1>Sign in</h1>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email or username!',
                                },
                            ]}
                            style={{ width: 539 }}
                        >
                            <Input placeholder="Email / Username" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                            style={{ width: 539 }}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>

                        <Form.Item>
                            <button className="ui facebook button" type="submit" style={{ backgroundColor: '#7F57FF', width: 359, height: 40 }}>
                                Sign in
    </button>
                        </Form.Item>
                    </Form>
                    <a href="/" style={{ color: 'black' }}>
                        <p style={{ textAlign: 'center' }}>Forgot Password?</p>
                    </a>
                </div>
            </div>
            <p style={{ textAlign: 'center', marginTop: 30, fontSize: 14 }}>Don't have an account yet? <Link to="/register" style={{ fontWeight: 'bold' }}>Sign Up</Link> now</p>
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

export default Login;