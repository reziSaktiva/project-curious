import { List, message, Avatar, Spin } from 'antd';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import AppBar from "../components/AppBar";
import { RightOutlined } from '@ant-design/icons'

export default function Settings() {


return(
 <div>
     <AppBar title="Settings"/>

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
        <Link to="/">
            <List.Item key='3'>
                <List.Item.Meta
                  title="Logout"
                />
                <div><RightOutlined /></div>
            </List.Item>
        </Link>
        <Link to="/">
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