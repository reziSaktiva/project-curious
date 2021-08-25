import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import AppStore from '../assets/buttonIphone.png';
import PlayStore from '../assets/buttonGoogle.png'
import Chat_img from '../assets/NoResults/No_notifications.png'
import AppBar from './AppBar';

export default function Chat() {
    const [device, setdevice] = useState(null)

    useEffect(() => {
        setdevice(window.navigator.userAgent.split(";")[0].split("(")[1])
    }, [])

    return (
        <div>
            <AppBar title="Chat" />
            <div className="centering-flex">
            <img src={Chat_img} style={{ width: 300}} />
            
                <h4 style={{textAlign: 'center'}}>Download our Mobile Version To Use This Features</h4>
                
                <div >
                    <a href="https://play.google.com/store/apps/details?id=com.ramadhan.curious">
                    <Button type="link" > <img src={device === 'iPhone' || device === 'iPad'? AppStore : PlayStore} style={{width: 150}} /></Button>
                    </a>
                </div>
                <h4 style={{textAlign: 'center', marginTop: 90}}> Click This Button Below To Download Mobile Version to get best experience</h4>
                </div>
            </div>
    )
}