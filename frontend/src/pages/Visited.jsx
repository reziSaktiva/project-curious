import React from 'react'
import 'antd/dist/antd.css';
import './Visited.css'
import { Col, Row, Card } from 'antd';
import imageOne from '../assets/beachone.jfif'


export default function Visited() {
    const breakPoints = [
        { width: 1, itemsToShow: 1 },
        { width: 550, itemsToShow: 2 },
        { width: 768, itemsToShow: 3 },
        { width: 1200, itemsToShow: 4 },
      ];

    return (
        <div>
            <Row>
                    <Col span={6}>
                    <button class="ui inverted basic button" type="text" onClick={() => {window.history.back()}}>
                            <i class="chevron left icon" style={{ color: 'black' }}></i>
                    </button>
                    </Col>
                    <Col span={12} style={{textAlign: "center"}}>
                    <h4>Visited Places</h4>
                    </Col>
                    <Col span={6} style={{textAlign: "right"}}>
                    <button class="ui inverted basic button" type="text">
                            <i class="ellipsis horizontal icon" style={{ color: 'black' }}></i>
                    </button>
                    </Col>
                </Row>

            <div className="site-card-wrapper">
                <Row style={{margin: 10}}>
                    <Col span={8}>
                        <Card 
                        className= "VisitedClass"
                        bordered={false} 
                        cover={
                        <div>
                            <img alt="example" src={imageOne} style={{width: 187, height: 200, margin: 5, borderRadius: 5}} />
                            <h3 style={{ position: "absolute",
                                    bottom: 14,
                                    left: 10,
                                    color: "white",
                                    fontWeight: "1200",
                                    fontSize: 17,
                                    width: 180,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                    }}>Tanjung Pinang, Jawa tengah</h3> 
                        </div>
                        } />
                    </Col>
                    <Col span={8}>
                    <Card 
                        className= "VisitedClass"
                        bordered={false} 
                        cover={
                        <div>
                            <img alt="example" src={imageOne} style={{width: 187, height: 200, margin: 5, borderRadius: 5}} />
                            <h3 style={{ position: "absolute",
                                    bottom: 14,
                                    left: 10,
                                    color: "white",
                                    fontWeight: "1200",
                                    fontSize: 17,
                                    width: 180,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                    }}>Tanjung Pinang, Jawa tengah</h3> 
                        </div>
                        } />
                    </Col>
                    <Col span={8}>
                    <Card 
                        className= "VisitedClass"
                        bordered={false} 
                        cover={
                        <div>
                            <img alt="example" src={imageOne} style={{width: 187, height: 200, margin: 5, borderRadius: 5}} />
                            <h3 style={{ position: "absolute",
                                    bottom: 14,
                                    left: 10,
                                    color: "white",
                                    fontWeight: "1200",
                                    fontSize: 17,
                                    width: 180,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                    }}>Tanjung Pinang, Jawa tengah</h3> 
                        </div>
                        } />
                    </Col>
                    <Col span={8}>
                    <Card 
                    className= "VisitedClass"
                        bordered={false} 
                        cover={
                        <div>
                            <img alt="example" src={imageOne} style={{width: 187, height: 200, margin: 5, borderRadius: 5}} />
                            <h3 style={{ position: "absolute",
                                    bottom: 14,
                                    left: 10,
                                    color: "white",
                                    fontWeight: "1200",
                                    fontSize: 17,
                                    width: 180,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                    }}>Tanjung Pinang, Jawa tengah</h3> 
                        </div>
                        } />
                    </Col>
                    <Col span={8}>
                    <Card 
                    className= "VisitedClass"
                        bordered={false} 
                        cover={
                        <div>
                            <img alt="example" src={imageOne} style={{width: 187, height: 200, margin: 5, borderRadius: 5}} />
                            <h3 style={{ position: "absolute",
                                    bottom: 14,
                                    left: 10,
                                    color: "white",
                                    fontWeight: "1200",
                                    fontSize: 17,
                                    width: 180,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                    }}>Tanjung Pinang, Jawa tengah</h3> 
                        </div>
                        } />
                    </Col>
                    <Col span={8}>
                    <Card 
                    className= "VisitedClass"
                        bordered={false} 
                        cover={
                        <div>
                            <img alt="example" src={imageOne} style={{width: 187, height: 200, margin: 5, borderRadius: 5}} />
                            <h3 style={{ position: "absolute",
                                    bottom: 14,
                                    left: 10,
                                    color: "white",
                                    fontWeight: "1200",
                                    fontSize: 17,
                                    width: 180,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                    }}>Tanjung Pinang, Jawa tengah</h3> 
                        </div>
                        } />
                    </Col>
                </Row>
            </div>
        </div>

    )
}