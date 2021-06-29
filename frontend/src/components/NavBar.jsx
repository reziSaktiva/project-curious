import { Button, Col, Radio, Row, Tabs } from 'antd';
import React, { useContext, useState } from 'react'
import { useHistory, Link } from 'react-router-dom';
import { BellOutlined } from '@ant-design/icons';

// Semantic
import { Menu } from 'semantic-ui-react'

import '../App.css'

const options = [
  { label: 'Latest', value: '/' },
  { label: 'Popular', value: '/popular' },
];

export default function NavBar(props) {
  const history = useHistory();
  const parentTab = history.location.pathname == '/populer' ? 'populer' : 'latest'
  const [nav, setNav] = useState({ value: '/' })

  const { value } = nav
  const handleNav = e => {
    setNav({value: e.target.value})
    history.push(e.target.value)
  }

  console.log(value);



  return (
    <header className="toolbar">
      <div className="toolbar__nav">
        <div className="toolbar__nav2" />
      </div>
      <nav >
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
            {/* <Radio.Group
            style={{width:151, zIndex: 200}}
            size="medium"
            onClick={handleNav}
            value={value}
              optionType="button"
              buttonStyle="solid"
              defaultValue="/"
              
              >
                <Radio.Button  value="/" style={{zIndex: 200}}>
                  <Link to='/' style={{color: 'white'}}>Latest</Link>
                  </Radio.Button>
                <Radio.Button value="/popular" style={{zIndex: 200}}>
                  <Link to='/popular' style={{color: '#7958f5'}}>Popular</Link>
                </Radio.Button>
            </Radio.Group> */}
            <Radio.Group
              style={{width:151, zIndex: 200}}
              size="medium"
              onChange={handleNav}
              value={value}
              defaultValue="/"
              optionType="button"
            >
              <Radio.Button value="/">
                  Latest
                  </Radio.Button>
                <Radio.Button value="/popular">
                  Popular
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