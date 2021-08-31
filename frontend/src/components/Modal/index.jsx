import React from 'react'
import './style.css'

export default function Modal({title, handleYes, deleteModal, setDeleteModal}) {
    const handleClose = () => setDeleteModal(false)
    let classes = "modal-bg"
        if(deleteModal) {
            classes = "modal-bg bg-active"
        }
        
    return (
        <>
        <div className={classes}>
            
            <div className="modal">
                <p>Are you sure want to {title}?</p>
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