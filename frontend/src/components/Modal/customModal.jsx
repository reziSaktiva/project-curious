import React from 'react'
import AppBar from '../AppBar'
import './style.css'

export default function CustomModal({children, click, title, setOpenModal}) {

    let classes = "modal-bg"
        if(click) {
            classes = "modal-bg bg-active"
        }
        const handleClose = () => setOpenModal(false)
        
    return (
        <>
        <div className={classes}>
            <div className="modal-legal">
            <div style={{ maxWidth: 560, width:"100%"}} onClick={handleClose}>
                <AppBar title={title} setOpenModal={setOpenModal}/>
            </div>
                <div style={{overflowY: "scroll", overflowX: 'hidden'}}>
                {children}
                </div>
            </div>
        </div>
        </>
    )
}