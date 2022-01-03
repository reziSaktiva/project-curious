import { Button } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import AppStore from '../assets/buttonIphone.png';
import PlayStore from '../assets/buttonGoogle.png'
import AppBar from './AppBar';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/auth';

export default function Chat() {
    const [device, setdevice] = useState(null)
    const path = useHistory().location.pathname
    const { setPathname } = useContext(AuthContext)
      
      useEffect(() => {
          setPathname(path)
      }, [])
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
                    <Button type="link" style={{height:200}} > <img src={ AppStore } style={{width: 150}} /></Button>
                    </a>
                    ) : (
                        <a href="https://play.google.com/store/apps/details?id=com.ramadhan.curious">
                    <Button type="link" > <img src={PlayStore} style={{width: 150, height: 200}} /></Button>
                    </a>
                    )

                    }
                    
                    
                </div>
                <h4 style={{textAlign: 'center', marginTop: 90}}> Click This Button Below To Download Mobile Version to get best experience</h4>
                </div>
            </div>
    )
}