import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AppBar from "../../components/AppBar";
import NavBar from "../../components/NavBar";
import { AuthContext } from "../../context/auth";
import { PostContext } from "../../context/posts";

export default function EPpost() {
    const { active, setNavMobileOpen } = useContext(PostContext)
    const path = useHistory().location.pathname
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
    return (
        <div>
        <AppBar title={path.split('/')[2]} />
            <div>
            <NavBar toggleOpen={handleBurger} toggleOpenNotif={handleNotif} location="visited" />
            </div>
        
        </div>
    );
}