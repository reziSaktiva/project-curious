/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import React, { useContext, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
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
import { MuteIcon, NearbyIcon, RoomIcon, SearchIcon, SettingIcon, SubIcon, VisitIcon } from "../library/Icon";

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

  const { user, pathname } = useContext(AuthContext);

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
          backgroundColor: "#FAFAFA",
          zIndex: 102,
          height: "100%",
        }}
      >
        <Sider
          className="site-layout-background"
          width={215}
          style={{ backgroundColor: "#FAFAFA" }}
          collapsed={windowWidth <= 1071 ? true : false}
        >
          <div style={{ width: 60, backgroundColor: "#FAFAFA" }}>
            <Link to={`/profile/user/${user.id}`}>
              <div
                className="profilefoto"
                style={{ backgroundImage: `url("${user.profilePicture? user.profilePicture : Blank}")`}}
              />
            </Link>
          </div>
          <Link to={`/profile/user/${user.id}`}>
            <h3 style={{backgroundColor: "#FAFAFA", marginTop: 15, marginBottom: -1, fontSize: 15 }}>
              {user.newUsername ? user.newUsername : user.username }
            </h3>
          </Link>

          <List.Item.Meta
            title={
              <Link to="/maps">
                {" "}
                {windowWidth > 1024 &&
                  <div>
                    <img src={Pin} style={{ width: 20, marginTop: -5 }} />
                    {address}
                  </div>
                }
                
              </Link>
            }
          />
          <Menu
            mode="inline"
            defaultSelectedKeys={["/"]}
            selectedKeys={[pathname]}
            defaultOpenKeys={["/"]}
            style={{ height: "100%", border: "none", backgroundColor: '#FAFAFA' }}
            inlineCollapsed="false"
          >
            <Menu.Divider />
            <Menu.Item key="/" icon={<div className="sidebar-nearby" style={{display: 'inline',  position:'relative', top:5}}><NearbyIcon /></div>}>
              <Link to="/">Nearby</Link>
            </Menu.Item>
            <Menu.Item key="/search" icon={<div className="sidebar-search" style={{display: 'inline',  position:'relative', top:3}}><SearchIcon /></div>}>
              <Link to="/search">Search</Link>
            </Menu.Item>

            <SubMenu
              expandIcon=" "
              key="Room"
              icon={<div className="sidebar-room" style={{display: 'inline',  position:'relative', top:8, marginRight: 9}}><RoomIcon /></div>}
              title={windowWidth > 1024 &&"Available Room"}
            >
              <Menu.Item key="/Insvire E-Sport" className="sidebar-sub">
                <Link to="/Insvire E-Sport">Insvire E-Sport</Link>
              </Menu.Item>
              <Menu.Item key="/BMW Club Bandung" className="sidebar-sub">
                <Link to="/BMW Club Bandung">BMW Club Bandung</Link>
                </Menu.Item>
            </SubMenu>
            <Menu.Item key="/visited" icon={<div className="sidebar-visit" style={{display: 'inline'}}><VisitIcon /></div>}>
              <Link to="/visited">Visited Places</Link>
            </Menu.Item>
            <Menu.Item key="/subscribePosts" icon={<div style={{display: 'inline', position:'relative', top:5}}><SubIcon /></div>}>
              <Link to="/subscribePosts">Subscribed Posts</Link>
            </Menu.Item>
            <Menu.Item key="/MutedPost" icon={<div className="sidebar-mute" style={{display: 'inline',  position:'relative', top:5}}><MuteIcon /></div>}>
              <Link to="/MutedPost" >Muted Posts</Link>
            </Menu.Item>

            <Menu.Item key="/settings" icon={<div className="sidebar-mute" style={{display: 'inline',  position:'relative', top:5}}><SettingIcon /></div>}>
              <Link to="/settings">Settings</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        {windowWidth <= 1071 ? null : <div>
          <Link to='/' ><div className="curious" /></Link>
          <p style={{color: '#B7B7B7', fontSize:12, marginTop: 16}}>
          <Link style={{color: '#B7B7B7'}} to="/TermOfUse">Terms of Use. </Link>
          <Link style={{color: '#B7B7B7'}} to="/CommunityGuidelines">Community <br/>Guidelines .</Link>
          <Link style={{color: '#B7B7B7'}} to="/PrivacyPolicy">Privacy Policy</Link> <br/>
          © 2021 Curious</p>
          </div>}
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
