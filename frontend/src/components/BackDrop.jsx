import React from 'react';

export default function BackDrop(props) {
    
    return (
    <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        background: 'rgba(0,0,0, 0.3)',
        zIndex: 200,
        top:0
    }}
    onClick={props.click}
    />
    )
}