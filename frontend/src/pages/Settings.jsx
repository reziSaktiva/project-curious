import { List, message, Avatar, Spin } from 'antd';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import AppBar from "../components/AppBar";
import { RightOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client';
import { DELETE_ACCOUNT } from '../GraphQL/Mutations';
import { AuthContext } from '../context/auth'

export default function Settings() {
  const { user } = useContext(AuthContext)
  const [deleteAccount] = useMutation(DELETE_ACCOUNT ,{
    update(){
      handleLogout()
      window.location.href = '/'
    },
    onError(err){
      console.log(err);
    }
  })

  const handleDeleteAccount = () => {
    if(user){
      deleteAccount({ variables: { id: user.id } })
    }
  }

  const handleLogout = () => {
    localStorage.clear()
  }
  return (
    <div>
      <AppBar title="Settings" />

      <List
        size="large"
        bordered>
        <Link to="/">
          <List.Item key='1'>
            <List.Item.Meta
              title="Term of Use"
            />
            <div><RightOutlined /></div>
          </List.Item>
        </Link>
        <Link to="/">
          <List.Item key='2'>
            <List.Item.Meta
              title="Share Curious App"
            />
            <div><RightOutlined /></div>
          </List.Item>
        </Link>
        <Link to="/">
          <List.Item key='3'>
            <List.Item.Meta
              title="Community Guidelines"
            />
            <div><RightOutlined /></div>
          </List.Item>
        </Link>
        <Link to="/">
          <List.Item key='3'>
            <List.Item.Meta
              title="Privacy Policy"
            />
            <div><RightOutlined /></div>
          </List.Item>
        </Link>
        <a href="/" onClick={handleLogout}>
          <List.Item key='3'>
            <List.Item.Meta
              title="Logout"
            />
            <div><RightOutlined /></div>
          </List.Item>
        </a>
        <Link onClick={handleDeleteAccount}>
          <List.Item key='3'>
            <List.Item.Meta
              title="Delete Account"
            />
            <div><RightOutlined /></div>
          </List.Item>
        </Link>
      </List>
    </div>
  )
}