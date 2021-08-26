import React, { useContext } from 'react'
import { BellOutlined } from '@ant-design/icons';
import '../App.css'
import { PostContext } from '../context/posts';

export default function NavBar({toggleOpen, toggleOpenNotif, location, noBurger, noNotif}) {

  const { setNav, active, notifLength } = useContext(PostContext)

  
  const handleToggle = e => {
    setNav(e.target.value)
  }

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
          {!noBurger &&
          <button className="toggle-button" onClick={toggleOpen}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>}
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
          {!noNotif && 
            <div className="toggle-button">
            <BellOutlined style={{
              marginLeft: -10,
              fontSize: "25px",
              color: "black",
              strokeWidth: "30",
              }} onClick={toggleOpenNotif} />
              {
          notifLength > 1 && <div className="notifCounter__mobile">
            <p style={{fontSize:10,display: 'flex', justifyContent: 'center', color: "white"}}> {notifLength > 99 ?
               ('99+') :
                (notifLength)}</p>    
                </div>}
            </div>
          }
          </div>

        </div>
      </nav>
      <div className="toolbar__nav2" />
      </div>
    </header>
   )
}