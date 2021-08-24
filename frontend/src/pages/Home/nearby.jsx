import React, { useContext, useState } from "react";

import NavBar from '../../components/NavBar'
import SidebarMobile from '../../components/SidebarMobile'
import BackDrop from '../../components/BackDrop'
import NotificationMobile from '../../components/NotificationMobile'
import { PostContext } from "../../context/posts";
import Popular from "./popular";
import Latest from './latest'

const NearbyPost = () => {
  const { setNavMobileOpen, active } = useContext(PostContext)
  const [burger, setBurger] = useState({
    toggle: false
  })

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
    <div>
      <NavBar toggleOpen={handleBurger} toggleOpenNotif={handleNotif} />
      <NotificationMobile />
      <SidebarMobile show={burger.toggle} />

      {burger.toggle ? <BackDrop click={handleBackdropClose} /> : null}
      {Component}
    </div>
  );
};

export default NearbyPost;
