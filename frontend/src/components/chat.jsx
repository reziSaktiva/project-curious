import { Button } from 'antd'
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import React from 'react'
import PlayStore from '../assets/buttonGoogle.png'
import Radius from '../assets/Radius.jpg'
import AppBar from './AppBar';
export default function Chat() {

    return (
        <div  style={{padding: 20}}>
            <AppBar title="Chat" />
            <div className="centeringImage">
            <img src={Radius} style={{ width: 300}} />
            </div>
                <h4 style={{textAlign: 'center'}}>Download our Mobile Version To Use This Features</h4>
                
                <div className="centeringButton">
                    <a href="https://play.google.com/store/apps/details?id=com.ramadhan.curious">
                    <Button type="link" style={{ width: 150}}> <img src={PlayStore} style={{width: 150}} /></Button>
                    </a>
                </div>

                <h4 style={{textAlign: 'center', marginTop: 90}}> Click This Button Below To Download Mobile Version to get best experience</h4>
            </div>
    )
}