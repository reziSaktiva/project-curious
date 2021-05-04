import React from 'react'
import 'antd/dist/antd.css';
import '../App.css'
import { Card, Col, Row, Tabs } from 'antd';
import { RetweetOutlined, LeftOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons'



function Profile() {
    const { TabPane } = Tabs;

    const Demo = () => (
        <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Posts" key="1">
                Halaman Kesatu
            </TabPane>
            <TabPane tab="Liked" key="2">
                <h1>Halaman kedua</h1>
            </TabPane>

            <TabPane tab="Media" key="3">
                <h1>Halaman ketiga</h1>
            </TabPane>
        </Tabs>
    );
    return (
        <div>
            <Row>
                    <Col span={6}>
                    <button class="ui inverted basic button" type="text">
                            <i class="chevron left icon" style={{ color: 'black' }}></i>
                    </button>
                    </Col>
                    <Col span={12} style={{textAlign: "center"}}>
                    <h4>My profile</h4>
                    </Col>
                    <Col span={6} style={{textAlign: "right"}}>
                    <button class="ui inverted basic button" type="text">
                            <i class="ellipsis horizontal icon" style={{ color: 'black' }}></i>
                    </button>
                    </Col>
                </Row>
            <div style={{position:'fixed', width: "100%"}}>
                

                
                        
                        <div class="ui divider" style={{ marginLeft: -14 }}/>

                        </div>


                        <div style={{ marginLeft: 225, width: 60, marginTop: 50 }}>
                            <a href="/"><p className="gambar"></p></a>
                        </div>

                        <h4 style={{ marginTop: 5, marginLeft: 218, width: 80 }}>My Account</h4>
                        <div style={{ marginLeft: 180, marginTop: 10, width: 150 }}>
                        <a href="/"><p className="markericon" ><span style={{ marginLeft: 20, fontSize: 12 }}>Albert Park, Melbourne</span></p></a>
                        </div>

                        <div class="ui secondary menu">
                            <h5 class="item" style={{ marginLeft: 172 }}>
                                12
                            </h5>
                            <h5 class="item" style={{ marginLeft: 22 }}>
                                12
                            </h5>
                            <h5 class="item" style={{ marginLeft: 22 }}>
                                12
                            </h5>
                        </div>

                        <div class="ui secondary menu" style={{ fontSize: 10, marginTop: -25 }}>
                            <p class="item" style={{ marginLeft: 172 }}>Posts</p>
                            <p class="item" style={{ marginLeft: 20 }}>Repost</p>
                            <p class="item" style={{ marginLeft: 20 }}>Likes</p>
                        </div>

                        <div class="ui action input"
                            style={{ textAlign: 'center', marginLeft: 165, width: 150, height: 25, marginTop: -4 }}>
                            <input type="text" value="http://ww.short.url/c0opq" />
                            <button class="ui teal right icon button" style={{ backgroundColor: '#7F57FF', fontSize: 10 }}>
                                Copy
                </button>
                        </div>
                        {Demo()}
                    </div>
    )
}

export default Profile