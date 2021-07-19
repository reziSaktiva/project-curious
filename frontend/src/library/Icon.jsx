import React from 'react'
import './style.css'

export function DropIcon(...rest) {
    return (
        <button className="dropIcon" >
          <div className="dropIcon_dot"></div>
          <div className="dropIcon_dot"></div>
          <div className="dropIcon_dot"></div>
        </button>
    )
}