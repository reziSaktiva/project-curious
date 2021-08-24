import React, { useContext } from 'react'
import { BellOutlined } from '@ant-design/icons';
import '../App.css'
import { PostContext } from '../context/posts';
import { AuthContext } from '../context/auth';

export default function NavBar({toggleOpen, toggleOpenNotif, location}) {
  const { notifications } = useContext(AuthContext);
  const { setNav, active } = useContext(PostContext)
  
  const handleToggle = e => {
    setNav(e.target.value)
  }

  const notificationLength = notifications.length && notifications.filter(notif => notif.read === false).length
  return (
    <header className="toolbar">
      <div className="toolbar__nav">
      
      <nav >
        <div style={{
          display: 'flex',
          width: '100vw',
          justifyContent: 'space-between'
        }}>
          <div>
          <button className="toggle-button" onClick={toggleOpen}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
          </div>
          <div>
            <div className="radio-center">
              <button className={ active === 'latest' ? "toogle-latest toggle-active__navbar" : "toogle-latest"}
                onClick={handleToggle}
               value="latest">Latest</button>
               
              <button className={ active === 'popular' ||  active === `/${location}/popular` ? "toogle-popular toggle-active__navbar" : "toogle-popular"}
                onClick={handleToggle}
               value="popular">Popular</button>
            </div>
            
          </div>
          <div className='notif'>
            <div className="toggle-button">
            <BellOutlined style={{
              marginLeft: -10,
              fontSize: "25px",
              color: "black",
              strokeWidth: "30",
              }} onClick={toggleOpenNotif} />
              {
          notifications.length > 1 && <div className="notifCounter__mobile">
            <p style={{fontSize:10,display: 'flex', justifyContent: 'center'}}> {notifications.length > 99 ?
               ('99+') :
                (notificationLength)}</p>
              
                </div>}
              
            </div>
          
          </div>
        </div>
      </nav>
      <div className="toolbar__nav2" />
      </div>
    </header>
   )
}