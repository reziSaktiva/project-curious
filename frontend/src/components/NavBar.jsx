import { Button, Col, Radio, Row, Tabs } from 'antd';
import React, { useContext, useState } from 'react'
import { useHistory, Link } from 'react-router-dom';
import { BellOutlined } from '@ant-design/icons';

import { StickyContainer } from 'react-sticky';
// Semantic
import { Menu } from 'semantic-ui-react'

import '../App.css'


export default function NavBar(props) {
  const history = useHistory();
  const parentTab = history.location.pathname == '/populer' ? 'populer' : 'latest'
  const [nav, setNav] = useState({ value2: '/' })

  const { value2 } = nav;

  return (
    <header className="toolbar">
      <nav className="toolbar__nav">
        <Row>
          <Col span={3}>
          <button className="toggle-button" onClick={props.toggleOpen}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
          </Col>
          <Col span={18}>
            <div  className="centeringButton adtional__nav">
            <Radio.Group
            style={{width:151}}
            size="medium"
              value={value2}
              optionType="button"
              buttonStyle="solid"
              defaultValue="/"
              >
                <Radio.Button  value="/">
                  <Link to='/' style={{color: 'white'}}>Latest</Link>
                  </Radio.Button>
                <Radio.Button value="/popular">
                  <Link to='/popular' style={{color: '#7958f5'}}>Popular</Link>
                </Radio.Button>
            </Radio.Group>
            </div>
            
          </Col>
          <Col span={3}>
            <div className="toggle-button">
            <BellOutlined style={{
              fontSize: "25px",
              color: "black",
              strokeWidth: "30", // --> higher value === more thickness the filled area
              }} onClick={props.toggleOpenNotif} />
            </div>
          
          </Col>
        </Row>
      </nav>
    </header>


  )
}