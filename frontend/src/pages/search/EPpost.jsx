import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import AppBar from "../../components/AppBar";
import NavBar from "../../components/NavBar";
import { AuthContext } from "../../context/auth";
import { PostContext } from "../../context/posts";
import Latest from '../visited/latest'
import Popular from '../visited/popular'

export default function EPpost() {
  const { active, setNavMobileOpen } = useContext(PostContext)
  const { locationEP } = useContext(AuthContext)
  const path = useHistory().location.pathname
  const history = useHistory()

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

  if (!locationEP) history.push('/search')
  return (
    <div>
      <AppBar title={path.split('/')[2]} />
      <div>
        <NavBar toggleOpen={handleBurger} toggleOpenNotif={handleNotif} location="visited" />
      </div>
      {active == 'latest' ? <Latest postsLocation={locationEP} /> : <Popular postsLocation={locationEP} />}
    </div>
  );
}