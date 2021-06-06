import React, { useContext } from 'react'
import { PostContext } from "../../../context/posts";
import { RetweetOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import './style.css';

export default function RepostButton({ idPost }) {
  const { toggleOpenNewPost } = useContext(PostContext);

  const handleOpenAddPost = () => {
    toggleOpenNewPost(idPost);
  }

  return (
    <div className="ui labeled btn-repost" tabIndex="0" onClick={handleOpenAddPost}>
      <div className="btn-repost__icon">
        <Button shape="circle" className="likeButton"  icon={<RetweetOutlined />} />
      </div>
      
      <div className="btn-repost__wrapper">
        <div className="ui basic label float btn-repost__label">
          <p>12 repost</p>
        </div>
      </div>
    </div>
  )
};
