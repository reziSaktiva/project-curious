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
  AudioMutedOutlined
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Sider } = Layout;

export default function SidebarMobile(props) {
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

  let siderClasses = 'sidebarmobilecoy'
  
  if(props.show) {
    siderClasses = 'sidebarmobilecoy open' 
  }
  return user && (
    <React.Fragment>
      {/* Sidebar */}
      <div className={siderClasses}>
        <Sider
          width='100%'
          className="site-layout-background"
          style={{ backgroundColor: "white" }}
          collapsed={false}
        >
          <div style={{ width: 60 }}>
            <Link to={`/${user.newUsername ? user.newUsername : user.username}`}>
              <div
                className="profilefoto"
                style={{marginLeft: 4, backgroundImage: `url("${user.profilePicture? user.profilePicture : Blank}")`}}
              />
            </Link>
          </div>
          <Link to={`/${user.newUsername ? user.newUsername : user.username}`}>
            <h3 style={{marginLeft: 4, marginTop: 15, marginBottom: -1, fontSize: 15 }}>
              {user.username ? user.username : "My Account"}
            </h3>
          </Link>

          <List.Item.Meta
            title={
              <Link to="/maps" style={{marginLeft: 4,}}>
                {" "}
                  <img src={Pin} style={{ width: 20, marginTop: -5 }} />
                {address}
              </Link>
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
              <Link to="/">Nearby</Link>
            </Menu.Item>
            <Menu.Item key="Search" icon={<SearchOutlined />}>
              <Link to="/search">Search</Link>
            </Menu.Item>

            <SubMenu
              key="Room"
              icon={<LaptopOutlined />}
              title="Available Room"
            >
              <Menu.Item key="Room1">
                <Link to="/Insvire E-Sport">Insvire E-Sport</Link>
              </Menu.Item>
              <Menu.Item key="Room2">
                <Link to="/BMW Club Bandung">BMW Club Bandung</Link>
                </Menu.Item>
            </SubMenu>
            <Menu.Item key="Visited" icon={<StarOutlined />}>
              <Link to="/visited">Visited Places</Link>
            </Menu.Item>
            <Menu.Item key="Sub" icon={<NotificationOutlined />}>
              <Link to="/subscribePosts">Subscribed Posts</Link>
            </Menu.Item>
            <Menu.Item key="Muted" icon={<AudioMutedOutlined />}>
              <Link to="/MutedPost" >Muted Posts</Link>
            </Menu.Item>

            <Menu.Item key="Settings" icon={<SettingOutlined />}>
              <Link to="/settings">Settings</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        {windowWidth < 993 ? null : <Link to='/' ><div className="curious" /></Link>}
      </div>
    </React.Fragment>
  );
};

