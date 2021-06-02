import React from 'react'
import { Col, Row, Button } from 'antd'

import LoginFacebook from '../../components/LoginFacebookButton';
import LoginGoogle from '../../components/LoginGoogleButton';
import { Link } from 'react-router-dom'

import BGLanding from '../../assets/bg-landing.png';

import './style.css';

const SignIn = (props) => {
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
          {window.isMobile && <img src={BGLanding} width="250px" />}
          <h1>Welcome to Curious!</h1>

          <div className="btn-wrapper">
            <LoginFacebook props={props} />
            <LoginGoogle props={props} />
          </div>
          
          <Row style={{marginTop: 20}}>
                <Col span={12} style={{paddingLeft: "15%", paddingRight: "4%"}}>
                <Button className="ui black basic button" style={{ width: "100%", padding: 0 }}>
                    <Link to='/register'>
                        Sign Up
                    </Link>
                </Button>
                </Col>

                <Col span={12} style={{paddingLeft: "4%", paddingRight: "15%"}}>
                <Button className="ui black basic button" style={{ width: "100%", padding: 0 }}>
                    <Link to='login'>
                        Login
                    </Link>
                </Button>
                </Col>
            </Row>

          <p style={{ marginTop: 30, fontSize: 14 }}>By signing up, you agree to our <span className="terms">Terms & Privacy Policy</span></p>
          <p className="copy-right">&copy; 2020 Curious</p>

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

export default SignIn;
