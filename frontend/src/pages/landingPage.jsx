import React from 'react'
import '../App.css'
import { Col, Row, Button } from 'antd'
import { Grid } from 'semantic-ui-react'

import LoginFacebook from '../components/LoginFacebookButton'
import { Link } from 'react-router-dom'

function LandingPage(props) {
    return (
        <div>
            <Row>
                <Col xs={0} sm={12} md={12} lg={12} xl={12}>
                    <div className="landingimage" />
                    <div className="container-landing">
                        <div className="curiouslanding" />
                    </div>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <div className="landingPage-input">
                        <h1>Welcome to Curious!</h1>

                        <div style={{ paddingLeft: 70, paddingRight: 70}}>
                        <LoginFacebook props={props} />
                        <Button className="ui black basic button" style={{ width: "100%", height: 45, marginTop: 15, borderRadius: 5 }}>
                            <i className="google icon"></i>
                                Continue with Google
                        </Button>
                        </div>
                        
                        <Row style={{marginTop: 20}}>
                            <Col span={12} style={{paddingLeft: "15%", paddingRight: "4%"}}>
                            <Button className="ui black basic button" style={{ width: "100%"}}>
                                <Link to='/register'>
                                    Sign Up
                                </Link>
                            </Button>
                            </Col>

                            <Col span={12} style={{paddingLeft: "4%", paddingRight: "15%"}}>
                            <Button className="ui black basic button" style={{ width: "100%"}}>
                                <Link to='login'>
                                    Login
                                </Link>
                            </Button>
                            </Col>
                        </Row>

                    <p style={{ marginTop: 30, fontSize: 14 }}>By signing up, you agree to our <span className="terms">Terms & Privacy Policy</span></p>
                        <p style={{ marginTop: 320 }}>&copy; 2020 Curious</p>

                        <Row>
                            <Col span={6}>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Terms of Service
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Privacy Policy
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Cookie Policy
                                </Button>
                            </Col>
                            <Col span={6}>
                                <Button type="text" style={{ fontSize: 8 }}>
                                    Ads Info
                                </Button>
                            </Col>
                        </Row>  
                    </div>
                    </Col>
                </Row>
        </div>)
}

export default LandingPage