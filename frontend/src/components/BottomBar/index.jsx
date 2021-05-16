import React, { useContext } from 'react';
import {
  UserOutlined,
  HomeOutlined,
  SearchOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import { PostContext } from "../../context/posts";


import './style.css';

const BottomBar = props => {
  const { toggleOpenNewPost } = useContext(PostContext);

  const handleOpenAddPost = () => {
    toggleOpenNewPost()
  }

  return (
    <div className="bottom-bar">
      <div className="bottom-bar__wrapper">
        <div className="bottom-bar__items">
          <HomeOutlined style={{ fontSize: 20 }} />
        </div>
        <div className="bottom-bar__items">
          <SearchOutlined style={{ fontSize: 20 }} />
        </div>
        <div className="bottom-bar__items">
          <div className="ui circular outlined icon button fixed"
            style={{ position: 'relative', backgroundColor: '#7958F5', borderRadius: '100%', margin: 0 }}
            onClick={handleOpenAddPost}>
            <i className="plus icon" style={{ color: 'white' }}></i>
          </div>
        </div>
        <div className="bottom-bar__items">
          <MessageOutlined style={{ fontSize: 20 }} />
        </div>
        <div className="bottom-bar__items">
          <UserOutlined style={{ fontSize: 20 }} />
        </div>
      </div>
    </div>
  )
}

export default BottomBar;
