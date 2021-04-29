import React from 'react'
import { Card } from 'antd'

export default function Notification() {
    return (
        <div>
            <div style={{ position: 'fixed', zIndex: 1 }}>
                <Card title="Notification" extra={<a href="#"><i class="ellipsis horizontal icon" style={{ color: 'black' }}></i></a>} style={{ width: "100%" }}>
                    <p style={{ fontSize: 10, fontWeight: 'bold' }}>Tempe Kering <span>commented: this is a comment post</span> </p>
                    <p style={{ fontSize: 10, fontWeight: 'bold' }}>Tahu Kecap <span>commented: this is a comment post.</span> </p>
                    <p style={{ fontSize: 10, fontWeight: 'bold' }}>Tahu Bacem <span>commented: this is a comment post.</span> </p>
                    <p style={{ fontSize: 10, fontWeight: 'bold' }}>Tempe Kecap <span>commented: this is a comment post.</span> </p>
                    <p style={{ fontSize: 10, fontWeight: 'bold' }}>Tempe Bacem <span>commented: this is a comment post.</span> </p>
                    <p style={{ fontSize: 10, fontWeight: 'bold' }}>Tahu Kering <span>commented: this is a comment post.</span> </p>
                    <p style={{ fontSize: 10, fontWeight: 'bold' }}>Tahu Gejrot <span>commented: this is a comment post.</span> </p>
                    <p style={{ fontSize: 10, fontWeight: 'bold' }}>Banana <span>commented: this is a comment post.</span> </p>
                </Card>
            </div>
        </div>
    )
}
