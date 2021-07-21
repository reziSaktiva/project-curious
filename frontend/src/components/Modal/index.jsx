import React, { useContext } from 'react'
import { PostContext } from '../../context/posts'
import './style.css'

export default function Modal({title, handleYes, deleteModal, setDeleteModal}) {
    const handleClose = () => setDeleteModal(false)

    let classes = "modal-bg"
        if(deleteModal) {
            classes = "modal-bg bg-active"
        }
        
    return (
        <>
        {/* <span onClick={handleOpen} className="modal-btn">{title}</span> */}

        <div className={classes}>
            <div className="modal">
                <h2>Are You Sure want to delete this post?</h2>
                <div className="btn-container">
                    <button
                     className="modal-btn__footer"
                      onClick={handleClose}
                     style={{borderRadius: "0px 0px 0px 15px"}}>
                         No
                    </button>
                    <button 
                    onClick={handleYes}
                    className="modal-btn__footer"
                    
                    style={{borderRadius: "0px 0px 15px 0px"}}>
                        Yes
                    </button>
                </div>
                
            </div>
        </div>
        </>
    )
}