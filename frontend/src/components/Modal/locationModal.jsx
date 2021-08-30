import React from 'react'
import './style.css'

export default function LocationModal({title, handleYes, deleteModal, setDeleteModal}) {
    const handleClose = () => setDeleteModal(false)
console.log(deleteModal);
    let classes = "modal-bg"
        if(deleteModal) {
            classes = "modal-bg bg-active"
        }
        
    return (
        <>
        <div className={classes}>
            <div className="modal">
                <p>Please Enable Location Setting, for best exprerience</p>
                <div className="btn-container">
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