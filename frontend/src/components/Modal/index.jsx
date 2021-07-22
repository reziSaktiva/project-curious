import React, { useContext } from 'react'
import { PostContext } from '../../context/posts'
import './style.css'

export default function Modal({title, handleYes}) {
    const { setModal, isModalActive } = useContext(PostContext)

    const handleClose = () => setModal(false)
    const handleOpen = () => setModal(true)

    let classes = "modal-bg"
        if(isModalActive) {
            classes = "modal-bg bg-active"
        }
        
    return (
        <>
        {/* <span onClick={handleOpen} className="modal-btn">{title}</span> */}

        <div className={classes}>
            <div className="modal">
                <p>Are You Sure want to {title}?</p>
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