import React from 'react'
import './style.css'

export default function LocationModal({locationAllow}) {
    let classes = "modal-bg"
        if(!locationAllow) {
            classes = "modal-bg bg-active"
        }
  
    return (
        <>
        <div className={classes}>
            <div className="modal">
                <p>Please Enable Location Setting<br />
                Our Post are based on your location Radius</p>
                <div className="btn-container">
                    <button 
                    onClick={() => window.open("chrome://settings/content/location")}
                    className="modal-btn__footer"
                    
                    style={{borderRadius: "0px 0px 15px 15px", width: "100%"}}>
                        Yes
                    </button>
                </div>
                
            </div>
        </div>
        </>
    )
}