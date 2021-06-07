import React, { useContext } from 'react';
import { PostContext } from "../../context/posts";

const ButtonAdd = () => {
  const { toggleOpenNewPost } = useContext(PostContext);

  const handleOpenAddPost = () => {
    toggleOpenNewPost()
  }
  
  return (
    <div className="ui circular outlined icon button fixed"
      style={{ position: 'fixed', width:'60px', height:'60px', backgroundColor: '#7958F5', borderRadius: '100%', right: '16%', bottom: '10%' }}
      onClick={handleOpenAddPost}>
      <i className="big plus icon" style={{ color: 'white' }}></i>
    </div>
  )
};

export default ButtonAdd;
