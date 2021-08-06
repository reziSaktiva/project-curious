import React from 'react'
import { Col, Row, Button } from 'antd'

import LoginFacebook from '../../components/LoginFacebookButton';
import LoginGoogle from '../../components/LoginGoogleButton';
import { Link } from 'react-router-dom'

import BGLanding from '../../assets/bg-landing.png';

import './style.css';

export default function SignIn(props) {
  return (
  <div className="landing-container">
    <div className="left-grid__wrapper">
      <div className="landingimage" />
      <div className="curiouslanding" />
    </div>
    <div className="right-grid__wrapper" >
    <div className="content__wrapper">
      <img src={BGLanding}  className="landing-bg__mobile" />
        <div >
        <h1>Welcome to <br/> Curious! </h1>
        </div>
        <div  style={{maxWidth: 343}}>
          <LoginFacebook props={props} />
          <LoginGoogle props={props} />
        </div>
        <Row  style={{marginTop: 15}}>
              <Col span={12} style={{ paddingRight:7.5}}>
              <Button className="landing-sm-button">
                  <Link to='/register'>
                      Sign Up
                  </Link>
              </Button>
              </Col>

              <Col span={12} style={{ paddingLeft:7.5}}>
              <Button  className="landing-sm-button">
                  <Link to='login'>
                      Login
                  </Link>
              </Button>
              </Col>
          </Row>

        <p style={{ marginTop: 10, fontSize: 14, color: "#352A39" }}>By signing up, you agree to our <span className="terms">Terms & Privacy Policy</span></p>
        
    </div>
    </div>
     <div style={{backgroundColor: 'white'}}>
     <footer>
    <p className="copy-right" style={{textAlign: 'center'}}>&copy; 2020 Curious</p> 
      <Row style={{textAlign: 'center'}}>
                <Col span={6}>
                    <Button type="text" style={{ fontSize: 12, color: "#352A39" }}>
                        Terms of Service
                    </Button>
                </Col>
                <Col span={6}>
                    <Button type="text" style={{ fontSize: 12, color: "#352A39" }}>
                        Privacy Policy
                    </Button>
                </Col>
                <Col span={6}>
                    <Button type="text" style={{ fontSize: 12, color: "#352A39" }}>
                        Cookie Policy
                    </Button>
                </Col>
                <Col span={6}>
                    <Button type="text" style={{ fontSize: 12, color: "#352A39" }}>
                        Ads Info
                    </Button>
                </Col>
            </Row>
      </footer>
      </div>    
  </div>)
}


