import React from 'react';

export default function BackDrop({ children, click }) {

    return (
    <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0, 0.3)',
        zIndex: 200,
        top:0,
        left:0
    }}
    onClick={click}
    >
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: "column", alignContent: 'center', height: "100%", color: "white"}}>
        {children}
            </div>
    </div>
    )
}