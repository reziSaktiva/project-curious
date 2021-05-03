import React, { useContext } from 'react'
import { Card } from 'antd'
import { AuthContext } from '../context/auth'

export default function Notification() {
    const { notifications } = useContext(AuthContext)
    return (
        <div>
            <div style={{ position: 'fixed', zIndex: 1 }}>
                <Card title="Notification" extra={<a href="#"><i className="ellipsis horizontal icon" style={{ color: 'black' }}></i></a>} style={{ width: "100%" }}>
                    {notifications && notifications.map((notif, key) => {
                        let type = ''
                        let text = ''
                        switch (notif.type) {
                            case "LIKE":
                               type = 'liked'
                               text = 'iike' 
                                break;
                            case "COMMENT":
                                type = "commented"
                                text = 'comment'
                            default:
                                break;
                        }
                        return <p key={`notif${key}`} style={{ fontSize: 10, fontWeight: 'bold' }}>{notif.displayName} <span>{`${type}: this is a ${text} post.`}</span> </p>
                    })}
                </Card>
            </div>
        </div>
    )
}
