import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import AppStore from '../assets/buttonIphone.png';
import PlayStore from '../assets/buttonGoogle.png'
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
                <div className="chat_img" />
            
                <h4 style={{textAlign: 'center'}}>Download our Mobile Version To Use This Features</h4>
                
                <div >
                    {device === 'iPhone' || device === 'iPad'? (
                        <a href="https://www.apple.com/app-store/">
                    <Button type="link" > <img src={ AppStore } style={{width: 150}} /></Button>
                    </a>
                    ) : (
                        <a href="https://play.google.com/store/apps/details?id=com.ramadhan.curious">
                    <Button type="link" > <img src={PlayStore} style={{width: 150}} /></Button>
                    </a>
                    )

                    }
                    
                    
                </div>
                <h4 style={{textAlign: 'center', marginTop: 90}}> Click This Button Below To Download Mobile Version to get best experience</h4>
                </div>
            </div>
    )
}