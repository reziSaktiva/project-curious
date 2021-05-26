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

export default function ReserPassword(props) {
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
            <div className="curious" style={{ marginLeft: 710, marginTop: 100 }} />
            </Link>
            <div className="ui card container" style={{ width: 447, marginTop: 30, paddingTop: 30, padding: 30 }}>
                <div className="content">
                    <h1>Reset Password</h1>
                    <Form
                        {...layout}
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                            style={{ width: 539 }}
                        >
                            <Input placeholder="Email / Username" />
                        </Form.Item>

                        <Form.Item>
                            <button className="ui facebook button" type="submit" style={{ backgroundColor: '#7F57FF', width: 359, height: 40 }}>
                                Send Verification Email
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

