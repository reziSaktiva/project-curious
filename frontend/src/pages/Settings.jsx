import { List, message, Avatar, Spin } from 'antd';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import AppBar from "../components/AppBar";
import { RightOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client';
import { DELETE_ACCOUNT } from '../GraphQL/Mutations';
import { AuthContext } from '../context/auth'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Modal from '../components/Modal';
import { PostContext } from '../context/posts';

export default function Settings() {
  const [deleteModal, setDeleteModal] = useState(false)
  const { setModal } = useContext(PostContext);
  const history = useHistory()
  const path = useHistory().location.pathname

  const { setPathname } = useContext(AuthContext)

    useEffect(() => {
        setPathname(path)
    }, [])

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
    history.go('/')
    
  }
  return (
    <div>
      <AppBar title="Settings" />

      <List
      style={{marginTop: -15}}
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
        {/* <a href="/" onClick={handleLogout}> */}
          <List.Item onClick={() => setDeleteModal(true)} key='3'>
            <List.Item.Meta
              title="Logout"
            />
            
            <div><RightOutlined /></div>
          </List.Item>
        {/* </a> */}
        <Link onClick={handleDeleteAccount}>
          <List.Item key='3'>
            <List.Item.Meta
              title="Delete Account"
            />
            <div><RightOutlined /></div>
          </List.Item>
        </Link>
        <Modal title="logout" handleYes={handleLogout} deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
      </List>
    </div>
  )
}