import { Button, Radio, Tabs } from 'antd';
import { ArrowLeftOutlined } from "@ant-design/icons";
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { StickyContainer, Sticky } from 'react-sticky';
// Semantic
import { Menu } from 'semantic-ui-react'

import '../App.css'


export default function PostNavBar() {
const [nav, setNav] = useState({value2: "Latest"})
//back button
let history = useHistory();



const onChange2 = e => {
    setNav({
        value2: e.target.value,
    });
  };

const { value2 } = nav;

    return (
      <StickyContainer>
        <Menu pointing secondary size='massive'>
          <div style={{display: "inline-block",marginLeft: 20, padding: "10px 0"}} onClick={() => history.goBack()}>
          <ArrowLeftOutlined />
          </div>
          <p style={{padding: "10px 0",marginLeft: 20, fontWeight: 'bolder',}}>Post</p>
        </Menu>
      </StickyContainer>
        )
}