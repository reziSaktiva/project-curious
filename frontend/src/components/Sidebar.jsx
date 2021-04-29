/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import React, { useContext, useState, useEffect } from "react";
import "../App.css";
import Geocode from "react-geocode";
import { Link } from "react-router-dom";

import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { AuthContext } from "../context/auth";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [address, setAddress] = useState("");

  const { user } = useContext(AuthContext);
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
    <React.Fragment>
      {/* Sidebar Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
        }`}
        style={{ position: "fixed" }}
      >
        <div style={{ width: 60 }}>
          <Link to="/">
            <div
              style={{
                backgroundImage: `url(${user && user.profilePicture})`,
                maxWidth: "60px",
                height: "60px",
              }}
            />
          </Link>
        </div>

        <h4 style={{ marginTop: 5, width: 150 }}>
          {user && user.username}
        </h4>
        <div style={{ width: 165, marginTop: 5 }}>
          <Link to="/map">
            <p className="markericon">
              <span style={{ marginLeft: 20 }}>{address}</span>
            </p>
          </Link>
        </div>

        <div className="ui divider" style={{ width: 260 }}></div>
        <Sider className="site-layout-background" width={250}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%", border: "none", backgroundColor: "white" }}
          >
            <Menu.Item key="Sub1" icon={<UserOutlined />}>
            <Link to="/nearby">
              Nearby
            </Link>
            </Menu.Item>
            <SubMenu
              key="sub2"
              icon={<LaptopOutlined />}
              title="Available Room"
            >
              <Menu.Item key="1">April Mop</Menu.Item>
              <Menu.Item key="2">Sad Story</Menu.Item>
            </SubMenu>
            <Menu.Item icon={<NotificationOutlined />}>
              Subscribed Posts
            </Menu.Item>
            <Menu.Item icon={<SettingOutlined />}>Muted Posts</Menu.Item>

            <Menu.Item icon={<SettingOutlined />}>Settings</Menu.Item>
          </Menu>
        </Sider>
        <div className="curious" />
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
