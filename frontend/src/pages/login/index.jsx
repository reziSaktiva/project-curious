import React, { useState, useContext, useEffect } from 'react'
import { Form, Input, Alert } from 'antd';

import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../../GraphQL/Mutations'

import { AuthContext } from '../../context/auth'
import { Link } from 'react-router-dom';
import { LoadingOutlined } from "@ant-design/icons";

import '../reset-password/style.css';

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

  const [login, { loading }] = useMutation(LOGIN_USER, {
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
      <Link to='/' className="header-page">
        <div className="curious"/>
      </Link>
      <div className="body-page ui card container" style={{ width: 447, marginTop: 30, paddingTop: 30, padding: 30 }}>
        <div className="body-page__wrapper content">
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
              className="body-page__textfield"
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
              className="body-page__textfield"
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <button className="ui facebook button body-page__btn-send" type="submit" >
                {loading ? (<LoadingOutlined />): ("Sign in")} 
              </button>
            </Form.Item>
          </Form>
          <Link to='/resetPassword'>
            <p style={{ textAlign: 'center' }}>Forgot Password?</p>
          </Link>
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