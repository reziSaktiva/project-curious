import { Button, Radio, Tabs } from 'antd';
import React, { useContext, useState } from 'react'
import { useHistory, Link } from 'react-router-dom'

import { StickyContainer, Sticky } from 'react-sticky';
// Semantic
import { Menu } from 'semantic-ui-react'

import '../App.css'


export default function Login() {
  const history = useHistory();
  const parentTab = history.location.pathname == '/populer' ? 'populer' : 'latest'
  const [nav, setNav] = useState({ value2: '/' })

  const onChange2 = e => {
    setNav({
      value2: e.target.value,
    });
  };

  const { value2 } = nav;

  return (
    <StickyContainer style={{ position: "center" }}>
      <Menu pointing secondary size='massive'>
        <div className="centeredButton">
          
          <Radio.Group
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
      </Menu>
    </StickyContainer>
  )
}