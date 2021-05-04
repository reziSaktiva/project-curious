import React, { useContext } from 'react'
import { Card, Menu, Dropdown  } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { AuthContext } from '../context/auth'

export default function Notification() {
    const { notifications } = useContext(AuthContext)
    return (
        <div>
            <div style={{ position: 'fixed', zIndex: 1 }}>
                <Card title="Notification" extra={
                <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="0">Read All</Menu.Item>
                    <Menu.Item key="3">Clear</Menu.Item>
                    
                    </Menu>
                    } 
                    trigger={['click']} placement="bottomRight">
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      <EllipsisOutlined />
                    </a>
                  </Dropdown>
                }>
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
