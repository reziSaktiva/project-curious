import React, { useState, useContext, useEffect } from 'react'
import { Form, Input, Alert } from 'antd';

import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../../GraphQL/Mutations'

import { AuthContext } from '../../context/auth'
import { Link } from 'react-router-dom';
import { auth } from '../../util/Firebase';

import './style.css';

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

export default function ReserPassword(props) {
  const context = useContext(AuthContext);
  const [alert, setAlert] = useState('');
  const [message, setMessage] = useState();

  const [login] = useMutation(LOGIN_USER, {
    update(_, { data: { login } }) {
      
      context.login(login)
      props.history.push('/')
    },
    onError(err) {
      setMessage(err.message)
    }
  })

  const onFinish = (values) => {
    const { email } = values

    auth.sendPasswordResetEmail(email).then(
      (resp) => {
        console.log("email sent@: ", resp)
        setAlert('success');
        setMessage('Success send link reset passowrd to your email');
      }
    )
    .catch(error => {
      const { message, code } = error;
      setAlert('error');

      if (code === 'auth/user-not-found') {
          setMessage('Email atau Username tidak ditemukan');

          return;
      }

      setMessage(message);
    })
  };

  const onCloseErr = (e) => {
    console.log(e, 'I was closed.');
    setAlert('');
    setMessage('');
  };
  
  console.log('message: ', !!(message && alert));
  console.log('alert : ', alert)
  return (
    <div>
      <Link to='/' className="header-page">
        <div className="curious"/>
        </Link>
      <div className="body-page ui card container">
        <div className="body-page__wrapper content">
          <h1>Reset Password</h1>
          <Form
            {...layout}
            name="basic"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}>
              <Form.Item
                name="email"
                className="body-page__textfield"
                rules={[
                  {
                    required: true,
                    message: 'Please input your email!',
                  },
                ]}
              >
                <Input placeholder="Email / Username" />
              </Form.Item>

              <Form.Item>
                <button className="ui facebook button body-page__btn-send" type="submit" >
                    Send Verification Email
                </button>
              </Form.Item>
            </Form>
        </div>
      </div>
      {!!(message && alert) && (
        <Alert
          message={message}
          type={alert}
          className="message-response"
          closable
          onClose={onCloseErr}
        />
      )}
    </div>
  );
};

