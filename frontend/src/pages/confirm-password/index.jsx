import React, { useState, useContext, useEffect } from 'react'
import { Form, Input, Alert } from 'antd';
import { useHistory } from 'react-router-dom'

import { useMutation } from '@apollo/client'
import { LOGIN_USER } from '../../GraphQL/Mutations'

import { AuthContext } from '../../context/auth'
import { Link } from 'react-router-dom';
import { auth } from '../../util/Firebase';

import '../reset-password/style.css';

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
  const history = useHistory();

  const search = history.location.search.substring(1);
  const querystring = search && JSON.parse(
    '{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
    function(key, value) { return key===""?value:decodeURIComponent(value)
  });

  const { oobCode } = querystring;

  // Local State
  const [alert, setAlert] = useState('');
  const [message, setMessage] = useState('');

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
    const { password } = values

    if (!oobCode) {
      setAlert('error');
      setMessage('Verify code is not valid or expired');
    }

    auth.confirmPasswordReset(oobCode, password).then(
      () => {
        setAlert('success');
        setMessage('Success reset your password, will redirect to login page in a few seconds');

        setTimeout(() => {
          history.replace('/login');
        }, 1500)
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

  const onCloseErr = () => {
    setAlert('');
    setMessage('');
  };
  
  return (
    <div style={{background: 'white'}}>
      <Link to='/' className="header-page">
        <div className="curious"/>
        </Link>
      <div className="body-page ui card container">
        <div className="body-page__wrapper content">
          <h1>Change Password</h1>
          <Form
            {...layout}
            name="basic"
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}>
              <Form.Item
                name="password"
                className="body-page__textfield"
                rules={[
                  {
                    required: true,
                    message: 'Please input your new password!',
                  },
                ]}
              >
                <Input placeholder="Input your new password" type="password" />
              </Form.Item>

              <Form.Item>
                <button className="ui facebook button body-page__btn-send" type="submit" >
                    Send
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

