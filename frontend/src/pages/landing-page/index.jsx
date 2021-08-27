import React, { useContext, useState } from 'react'
import { Col, Row, Button } from 'antd'

import LoginFacebook from '../../components/LoginFacebookButton';
import LoginGoogle from '../../components/LoginGoogleButton';
import { Link } from 'react-router-dom'

import BGLanding from '../../assets/bg-landing.png';

import './style.css';
import BackDrop from '../../components/BackDrop'
import { AuthContext } from '../../context/auth'
import { LoadingOutlined } from "@ant-design/icons";
import CustomModal from '../../components/Modal/customModal';
import TOU from '../legal/TeromOfUse';
import PrivacyPolicy from '../legal/PrivacyPolicy';
import CG from '../legal/CommunityGuidelines';

export default function SignIn(props) {
    const [openModal, setOpenModal] = useState(false)
    const [legal, setlegal] = useState(undefined)
    const { loginLoader } = useContext(AuthContext)

    const handleOpenModalLegal = e => {
        setOpenModal(true)
        setlegal(e.target.innerText)
    }
    let legalKey;
    if(legal == "Terms of Service" || legal =="Terms") legalKey = <TOU  setOpenModal={setOpenModal} />
    if(legal == "Privacy Policy") legalKey = <PrivacyPolicy setOpenModal={setOpenModal} />
    if(legal == "Community Guidelines") legalKey = <CG  setOpenModal={setOpenModal} />

  return (
  <div className="landing-container">
      <CustomModal click={openModal} setOpenModal={setOpenModal} title={legal} >{legalKey}</CustomModal>
      {loginLoader && <BackDrop ><LoadingOutlined style={{fontSize: 80}} /></BackDrop> }
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

        <p style={{ marginTop: 10, fontSize: 14, color: "#352A39" }}>By signing up, you agree to our
        <span onClick={handleOpenModalLegal}  className="terms">Terms</span>
        <span> & </span>
        <span onClick={handleOpenModalLegal} className="terms">Privacy Policy</span></p>
        
    </div>
    </div>
     <div style={{backgroundColor: 'white'}}>
     <footer>
    <p className="copy-right" style={{textAlign: 'center'}}>&copy; 2020 Curious</p> 
      <Row style={{textAlign: 'center'}}>
                <Col span={8}>
                    <Button key="tou" onClick={handleOpenModalLegal} type="text" style={{ fontSize: 12, color: "#352A39" }}>
                        Terms of Service
                    </Button>
                </Col>
                <Col span={7}>
                    <Button onClick={handleOpenModalLegal} type="text" style={{ fontSize: 12, color: "#352A39" }}>
                        Privacy Policy
                    </Button>
                </Col>
                <Col span={9}>
                    <Button onClick={handleOpenModalLegal} type="text" style={{ fontSize: 12, color: "#352A39" }}>
                        Community Guidelines
                    </Button>
                </Col>

            </Row>
      </footer>
      </div>    
  </div>)
}


