import { Button, Radio, Tabs } from 'antd';
import React, { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { StickyContainer, Sticky } from 'react-sticky';
// Semantic
import { Menu } from 'semantic-ui-react'

import '../App.css'


export default function Login() {
  const history = useHistory();
  const parentTab = history.location.pathname == '/populer' ? 'populer' : 'latest'
  const [nav, setNav] = useState({ value2: parentTab })

  const optionsWithDisabled = [
    { label: 'Latest', value: 'latest' },
    { label: 'Popular', value: 'popular' },
  ];

  const onChange2 = e => {
    setNav({
      value2: e.target.value,
    });
    history.push(`/${e.target.value == "latest" ? '' : e.target.value}`)
  };

  const { value2 } = nav;

  return (
    <StickyContainer style={{ position: "center" }}>
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