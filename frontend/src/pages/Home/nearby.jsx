import React, { useContext, useEffect, useState } from "react";

import NavBar from '../../components/NavBar'
import SidebarMobile from '../../components/SidebarMobile'
import BackDrop from '../../components/BackDrop'
import NotificationMobile from '../../components/NotificationMobile'
import { PostContext } from "../../context/posts";
import Popular from "./popular";
import Latest from './latest'
import { AuthContext } from "../../context/auth";
import { useHistory } from "react-router";



const NearbyPost = () => {
  const { setNavMobileOpen, active, setNav } = useContext(PostContext)
  const [burger, setBurger] = useState({
    toggle: false
  })
  const history = useHistory().location.pathname
  useEffect(() => {
    window.scrollTo(0, 0);
}, [history])
  
  useEffect(() => {
    setNav("latest")
  }, [])

  const handleBurger = () => {
    setBurger(prevState => {
      return {
        toggle: !prevState.toggle
      }
    })
  }
  const handleNotif = () => {
    setNavMobileOpen(true)
  }
  const handleBackdropClose = () => {
    setBurger({ toggle: false })
  }

  let Component;
  switch (active) {
    case "latest" :
      Component = <Latest />
      break;
    case "popular":
      Component = <Popular />
      break;
    default:
      break;
  }
  
  return (
    <div style={{height: "100vh"}}>
      <NavBar toggleOpen={handleBurger} toggleOpenNotif={handleNotif} />
      <NotificationMobile />
      <SidebarMobile show={burger.toggle} />

      {burger.toggle ? <BackDrop click={handleBackdropClose} /> : null}
      {Component}
    </div>
  );
};

export default NearbyPost;
