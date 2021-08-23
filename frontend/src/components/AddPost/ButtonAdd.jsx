import React, { useContext } from 'react';
import { PostContext } from "../../context/posts";

const ButtonAdd = () => {
  const { toggleOpenNewPost } = useContext(PostContext);

  const handleOpenAddPost = () => {
    toggleOpenNewPost()
  }
  
  return (
    <div className="ui circular outlined icon button fixed"
      style={{ position: 'fixed', width:'60px', height:'60px', backgroundColor: 'var(--primary-color)', borderRadius: '100%', right: '16%', bottom: '10%',zIndex: 110 }}
      onClick={handleOpenAddPost}>
        <div style={{ marginTop: 5, marginLeft: 2}}>
        <i className="big plus icon" style={{ color: 'white' }}></i>
        </div>
    </div>
  )
};

export default ButtonAdd;
