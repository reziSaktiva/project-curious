/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import React, { useContext, useState, useEffect } from "react";
import "../App.css";
import Geocode from "react-geocode";
import { Link } from "react-router-dom";

import { Layout, Menu, List } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  SettingOutlined,
  SearchOutlined,
  StarOutlined
} from "@ant-design/icons";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { AuthContext } from "../context/auth";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

import Blank from '../assets/blank.png'
import Pin from '../assets/pin-svg-25px.svg'

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [address, setAddress] = useState("");

  const { user } = useContext(AuthContext);
  console.log(user);
  const loc = localStorage.location;

  const location = loc ? JSON.parse(loc) : null

  if (location) {

    Geocode.fromLatLng(location.lat, location.lng).then(
      (response) => {
        const address = response.results[0].address_components[1].short_name;
        setAddress(address);

      },
      (error) => {
        console.error(error);
      }
    );
  }
  return (
    <React.Fragment >
      {/* Sidebar */}
      <div className="sidebarcoy" style={{ position: 'fixed', backgroundColor: 'white', zIndex: 1}} >
        <Sider className="site-layout-background" width={230} style={{backgroundColor: 'white'}}>
        <div style={{width: 60}}>
          <Link to="/"><div className="profilefoto" style={user.profilePicture? {backgroundImage: `url(${user.profilePicture}`} : {backgroundImage: `url(${Blank})` }} /></Link>
        </div>

        <h3 style={{ marginTop: 15, marginBottom: -1}}>{user.username? user.username : "My Account"}</h3>
          <List.Item.Meta
          title={<a href="https://ant.design"> <  img src={Pin} style={{width:20, marginTop: -5}}/>{address}</a>}
        />
          <Menu
            mode="inline"
            defaultSelectedKeys={['NearBy']}
            defaultOpenKeys={['NearBy']}
            style={{ height: '100%', border: 'none'}}
          >
            <Menu.Divider />

            <Menu.Item key="NearBy" icon={<UserOutlined />}>
            <Link to="/">
              NearBy
              </Link>
            </Menu.Item>
            <Menu.Item key="Search" icon={<SearchOutlined />}>
              Search
            </Menu.Item>
            
            <SubMenu key="Room" icon={<LaptopOutlined />} title="Available Room">
              <Menu.Item key="Room1">April Mop</Menu.Item>
              <Menu.Item key="Room2">Sad Story</Menu.Item>
            </SubMenu>
            <Menu.Item key="Visited" icon={<StarOutlined />}>
              <Link to="/visited">
              Visited Places
              </Link>
            </Menu.Item>
            <Menu.Item key ="Sub" icon={<NotificationOutlined />}>
              Subscribed Posts
            </Menu.Item>
            <Menu.Item key="Muted" icon={<SettingOutlined />}>
              Muted Posts
            </Menu.Item>

            <Menu.Item key="Settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        <div className="curious" />

      </div>
    </React.Fragment>
  );
};

export default Sidebar;
