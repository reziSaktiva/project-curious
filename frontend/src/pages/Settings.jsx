import { List, message, Avatar, Spin } from 'antd';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import AppBar from "../components/AppBar";
import { RightOutlined, LoadingOutlined } from '@ant-design/icons'
import { useMutation } from '@apollo/client';
import { DELETE_ACCOUNT } from '../GraphQL/Mutations';
import { AuthContext } from '../context/auth'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Modal from '../components/Modal';
import BackDrop from '../components/BackDrop';

export default function Settings() {
  const [deleteModal, setDeleteModal] = useState(false)
  const [ModalSource, setModalSource] = useState("")
  const history = useHistory()
  const path = useHistory().location.pathname
  const { setPathname } = useContext(AuthContext)
  const { user, loginLoader, setLoginLoader } = useContext(AuthContext)
  const [deleteAccount] = useMutation(DELETE_ACCOUNT ,{
    update(){
      handleLogout()
      window.location.href = '/'
    },
    onError(err){
      console.log(err);
    }
  })
  useEffect(() => {
    setPathname(path)
}, [])

  const handleClickLogout = () => {
    setModalSource(true)
    setDeleteModal(true)
    console.log(ModalSource)
    
  }
  const handleClickDeleteAccount = () => {
    setModalSource(false)
    setDeleteModal(true)
    console.log(ModalSource)
    
  }
  
  const handleDeleteAccount = () => {
    if(user){
      deleteAccount({ variables: { id: user.id } })
    }
  }


  const handleLogout = () => {
    setLoginLoader(true)
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

          <List.Item onClick={handleClickLogout} key='4'>
            <List.Item.Meta
              title="Privacy Policy"
            />
            <div><RightOutlined /></div>
          </List.Item>

          <List.Item onClick={handleClickLogout} key='5'>
            <List.Item.Meta
              title="Logout"
            />
            
            <div><RightOutlined /></div>
          </List.Item>

        <Link onClick={handleClickDeleteAccount}>
          <List.Item key='6'>
            <List.Item.Meta
              title="Delete Account"
            />
            <div><RightOutlined /></div>
          </List.Item>
        </Link>
        <Modal title={ModalSource? "logout": "delete this account"} handleYes={ModalSource? handleLogout : handleDeleteAccount} deleteModal={deleteModal} setDeleteModal={setDeleteModal}/>
        {loginLoader && <BackDrop ><LoadingOutlined style={{fontSize: 80}} /></BackDrop> }
      </List>
    </div>
  )
}