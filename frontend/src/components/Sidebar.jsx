/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";

//location
import Geocode from "react-geocode";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

//css & assets
import "../App.css";
import Blank from "../assets/blank.png";
import Pin from "../assets/pin-svg-25px.svg";

//antd
import { Layout, Menu, List } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
  SettingOutlined,
  SearchOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Sider } = Layout;

const Sidebar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [address, setAddress] = useState("");

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { user } = useContext(AuthContext);
  const loc = localStorage.location;

  const location = loc ? JSON.parse(loc) : null;

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
      {/* Sidebar */}
      <div
        className="sidebarcoy"
        style={{
          position: "fixed",
          backgroundColor: "white",
          zIndex: 1,
          height: "100%",
          borderRight: "1px #cccccc solid",
        }}
      >
        <Sider
          className="site-layout-background"
          width={windowWidth < 1200 ? 230 : 280}
          style={{ backgroundColor: "white" }}
          collapsed={windowWidth < 993 ? true : false}
        >
          <div style={{ width: 60 }}>
            <Link to="/">
              <div
                className="profilefoto"
                style={
                  user.profilePicture
                    ? { backgroundImage: `url(${user.profilePicture}` }
                    : { backgroundImage: `url(${Blank})` }
                }
              />
            </Link>
          </div>

          <h3 style={{ marginTop: 15, marginBottom: -1, fontSize: 15 }}>
            {user.username ? user.username : "My Account"}
          </h3>
          <List.Item.Meta
            title={
              <a href="https://ant.design">
                {" "}
                <img src={Pin} style={{ width: 20, marginTop: -5 }} />
                {address}
              </a>
            }
          />
          <Menu
            mode="inline"
            defaultSelectedKeys={["NearBy"]}
            defaultOpenKeys={["NearBy"]}
            style={{ height: "100%", border: "none" }}
            inlineCollapsed="false"
          >
            <Menu.Divider />
            <Menu.Item key="NearBy" icon={<UserOutlined />}>
              <Link to="/nearby">Nearby</Link>
            </Menu.Item>
            <Menu.Item key="Search" icon={<SearchOutlined />}>
              Search
            </Menu.Item>

            <SubMenu
              key="Room"
              icon={<LaptopOutlined />}
              title="Available Room"
            >
              <Menu.Item key="Room1">April Mop</Menu.Item>
              <Menu.Item key="Room2">Sad Story</Menu.Item>
            </SubMenu>
            <Menu.Item key="Visited" icon={<StarOutlined />}>
              <Link to="/visited">Visited Places</Link>
            </Menu.Item>
            <Menu.Item key="Sub" icon={<NotificationOutlined />}>
              Subscribed Posts
            </Menu.Item>
            <Menu.Item key="Muted" icon={<SettingOutlined />}>
              <Link to="/MutedPost" >Muted Posts</Link>
            </Menu.Item>

            <Menu.Item key="Settings" icon={<SettingOutlined />}>
              Settings
            </Menu.Item>
          </Menu>
        </Sider>
        {windowWidth < 993 ? null : <div className="curious" />}
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
