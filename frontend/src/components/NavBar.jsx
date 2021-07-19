import React, { useContext } from 'react'
import { BellOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import '../App.css'
import { PostContext } from '../context/posts';
import { AuthContext } from '../context/auth';

export default function NavBar(props) {
  const { notifications } = useContext(AuthContext);
  const { setNav, active } = useContext(PostContext)
  console.log(props);
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
          <button className="toggle-button" onClick={props.toggleOpen}>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </button>
          </div>
          <div>
            <div className="radio-center">
              <Link to='/'>
              <button className={ active == 'latest' ? "toogle-latest toggle-active__navbar" : "toogle-latest"}
                onClick={handleToggle}
               value="latest">Latest</button>
              </Link>
              <Link to='/popular'>
              <button className={ active == 'popular' ? "toogle-popular toggle-active__navbar" : "toogle-popular"}
                onClick={handleToggle}
               value="popular">Popular</button>
              </Link>
            </div>
            
          </div>
          <div className='notif'>
            <div className="toggle-button">
            <BellOutlined style={{
              marginLeft: -10,
              fontSize: "25px",
              color: "black",
              strokeWidth: "30",
              }} onClick={props.toggleOpenNotif} />
              {
          notifications.length > 1 && <div className="notifCounter__mobile">
            <p style={{fontSize:10,display: 'flex', justifyContent: 'center'}}> {notifications.length > 99 ?
               ('99+') :
                (notifications.length)}</p>
              
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