import React, { useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import {
  UserOutlined,
  HomeOutlined,
  SearchOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { PostContext } from "../../context/posts";


import './style.css';
import { AuthContext } from '../../context/auth';

const BottomBar = () => {
  
  const { user } = useContext(AuthContext);
  const { toggleOpenNewPost } = useContext(PostContext);
  const history = useHistory();


  const handleOpenAddPost = () => {
    toggleOpenNewPost()
  }

  const currentPath = history.location.pathname.replace('/', '');

  return (
    <div className="bottom-bar">
      <div className="bottom-bar__wrapper">
        <div className="bottom-bar__items">
          <Link className={`${currentPath === '' ? 'active' : '' }`} to="/">
            <HomeOutlined style={{ fontSize: 20 }} />
          </Link>
        </div>
        <div className="bottom-bar__items">
          <Link className={`${currentPath === 'search' ? 'active' : '' }`} to="/search">
            <SearchOutlined style={{ fontSize: 20 }} />
          </Link>
        </div>
        <div className="bottom-bar__items">
          <div className="ui circular outlined icon button fixed"
            style={{ position: 'relative', backgroundColor: 'var(--primary-color)', borderRadius: '100%', margin: 0 }}
            onClick={handleOpenAddPost}>
            <i className="plus icon" style={{ color: 'white' }}></i>
          </div>
        </div>
        <div className="bottom-bar__items">
          <Link className={`${currentPath === 'chat' ? 'active' : '' }`} to="/chat">
          <MessageOutlined style={{ fontSize: 20 }} />
          </Link>
        </div>
        <div className="bottom-bar__items">
          <Link className={`${currentPath === `${user.newUsername ? user.newUsername : user.username}` ? 'active' : '' }`} to={`/${user.newUsername ? user.newUsername : user.username}`}>
            <UserOutlined style={{ fontSize: 20 }} />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BottomBar;
