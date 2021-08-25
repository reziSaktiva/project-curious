import React, { useState, useEffect, useContext } from 'react'
import { useQuery } from "@apollo/client";
import { useHistory } from 'react-router-dom'
import cn from 'classnames';

import 'antd/dist/antd.css';
import moment from 'moment';
import { chunk } from 'lodash';
import { Card, Skeleton } from 'antd';
import VisitedLatest from './latest';
import VisitedPopular from './visitedPopular';

import NavBar from '../../components/NavBar'
import AppBar from '../../components/AppBar'
import SidebarMobile from '../../components/SidebarMobile'
import BackDrop from '../../components/BackDrop'
import NotificationMobile from '../../components/NotificationMobile'

// Queries
import { GET_VISITED } from '../../GraphQL/Queries';

import './style.css';
import { AuthContext } from '../../context/auth';
import { PostContext } from '../../context/posts';


const InitialStyles = {
  textContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    color: "white",
    width: 180,
  },
  textStyles: {
      color: "white",
      fontWeight: "1200",
      fontSize: 16,
      margin: 0,
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
}
const { textContainer, textStyles } = InitialStyles
export default function Visited() {
  const [postsLocation, setPostsLocation] = useState(null)
  const [location, setLocation] = useState([]);
  const history = useHistory();
  const { data, loading } = useQuery(GET_VISITED);
  const visited = data?.getVisited || [];
  const { active, setNavMobileOpen } = useContext(PostContext)

  const [burger, setBurger] = useState({
    toggle: false
  })

  const path = history.location.pathname

  const { setPathname } = useContext(AuthContext)

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

  useEffect(() => {
    setPathname(path)
  }, [])


  useEffect(() => {
    if (!loading && visited.length) {
      setLocation(chunk(visited, 4));
    }
  }, [loading, visited]);

  const onChangeLocation = ({ lat, lng }) => {
    const location = { lat, lng };

    setPostsLocation(location);
  }

  return (
    <div>
      <AppBar onClick={() => setPostsLocation(null)} postsLocation={postsLocation} title="Visited Places" />

      {!postsLocation ? (
        loading ? (
          <div className="gallery-location">

                <Skeleton.Button style={{ borderRadius:20, width:"100%", maxWidth: 387, height: 200, margin: 5 }} active />
                <Skeleton.Button style={{ borderRadius:20, width:"100%", height: 400, margin: 5 }} active />
                <Skeleton.Button style={{ borderRadius:20, width:"100%", height: 400, margin: "25px 5px" }} active />
                <Skeleton.Button style={{ borderRadius:20, width:"100%", maxWidth: 387, height: 200, margin: "225px 5px" }} active />
          </div>
        ) : (
          <div className="site-card-wrapper">
            {location.length ? location.map(subLoc => {
              return (
                <div className="gallery-location">
                  {subLoc.length && subLoc.map((loc, idx) => {
                    const {
                      administrative_area_level_1: province,
                      administrative_area_level_2: city,
                      administrative_area_level_3: districts,
                      photo_reference,
                      createAt,
                      location
                    } = loc;

                    const containerClass = cn({
                      'VisitedClass': true,
                      'gallery-location__item-right': idx == 1,
                      'gallery-location__item-left': idx == 2,
                      'gallery-location__img': idx != 1 || idx != 2
                    });
                    const address = `${province}, ${city}, ${districts}`;

                    return (
                      <Card
                        className={containerClass}
                        bordered={false}
                        onClick={() => {
                          onChangeLocation(location)
                        }}
                        cover={
                          <>
                            <img alt="example" src={photo_reference} style={{ width: '100%', height: '100%', borderRadius: 15, objectFit: 'cover' }} />
                            <div style={textContainer}>
                              <h3 style={textStyles}>{address}</h3>
                              <p style={{color: 'white'}}>{moment(createAt).fromNow()}</p>
                            </div>
                          </>}
                      />
                    )
                  })}
                </div>
              )
            }
            ) : <></>}
          </div>
        )
      ) : (
        <div>
          <div style={{marginTop: -15}}>
          <NavBar noBurger={true} noNotif={true} toggleOpen={handleBurger} toggleOpenNotif={handleNotif} location="visited" />
          </div>
          
          <NotificationMobile />
          <SidebarMobile show={burger.toggle} />

          {burger.toggle ? <BackDrop click={handleBackdropClose} /> : null}
          {active == 'latest' ? <VisitedLatest postsLocation={postsLocation} /> : <VisitedPopular postsLocation={postsLocation} />}
        </div>
      )}
    </div>

  )
}