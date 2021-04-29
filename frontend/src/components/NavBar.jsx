import { Button, Radio, Tabs } from 'antd';
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'

import { StickyContainer, Sticky } from 'react-sticky';
// Semantic
import { Menu } from 'semantic-ui-react'

import '../App.css'


export default function Login() {
const [nav, setNav] = useState({value2: "Latest"})

const optionsWithDisabled = [
    { label: 'Latest', value: 'Latest' },
    { label: 'Popular', value: 'Popular' },
  ];

const onChange2 = e => {
    setNav({
        value2: e.target.value,
    });
  };

const { value2 } = nav;

    return (
      <StickyContainer style={{position: "center"}}>
        <Menu pointing secondary size='massive'>
          <div className="centeredButton">
            <Radio.Group
              options={optionsWithDisabled}
              onChange={onChange2}
              value={value2}
              optionType="button"
              buttonStyle="solid"
            />
          </div>
        </Menu>
      </StickyContainer>
        )
}