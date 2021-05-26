import React, { useContext } from 'react';
import { PostContext } from "../../context/posts";

const ButtonAdd = () => {
  const { toggleOpenNewPost } = useContext(PostContext);

  const handleOpenAddPost = () => {
    toggleOpenNewPost()
  }
  
  return (
    <div className="ui circular outlined icon button fixed"
      style={{ position: 'fixed', backgroundColor: '#7958F5', borderRadius: '100%', right: '16%', bottom: '10%' }}
      onClick={handleOpenAddPost}>
      <i className="plus icon" style={{ color: 'white' }}></i>
    </div>
  )
};

export default ButtonAdd;
