import React, { useState, useEffect, useContext } from 'react'
import { useQuery } from "@apollo/client";
import { useHistory } from 'react-router-dom'
import cn from 'classnames';

import 'antd/dist/antd.css';
import moment from 'moment';
import { chunk } from 'lodash';
import { Row, Card, Skeleton, Space } from 'antd';
import AppBar from '../../components/AppBar';

// Assets
import imageOne from '../../assets/beachone.jfif'

// Queries
import { GET_VISITED } from '../../GraphQL/Queries';

import { LS_LOCATION } from '../../context/constant'

import './style.css';
import { AuthContext } from '../../context/auth';

export default function Visited() {
  const [location, setLocation] = useState([]);
  const history = useHistory();
  const { data, loading } = useQuery(GET_VISITED);
  const visited = data?.getVisited || [];

  const path = useHistory().location.pathname

  const { setPathname } = useContext(AuthContext)

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

    localStorage.setItem(LS_LOCATION, JSON.stringify(location));

    setTimeout(() => {
      history.push('/');
    }, 1500);
  }

  return (
      <div>
          <AppBar title="Visited Places"/>

          {loading ? (
            <div className="site-card-wrapper" style={{margin: 10}}>
              <Row style={{margin: 5}}>
                <Space>
                  <Skeleton.Button style={{ width: 187, height: 200, margin: 5 }} active />
                </Space>
                <Space>
                  <Skeleton.Button style={{ width: 187, height: 200, margin: 5 }} active />
                </Space>
              </Row>
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
                                className= {containerClass}
                                bordered={false}
                                onClick={() => {
                                  onChangeLocation(location)
                                }}
                                cover={
                                <>
                                  <img alt="example" src={imageOne} style={{width: '100%', height: '100%', borderRadius: 15}} />
                                  <div style={{
                                    position: "absolute",
                                    bottom: 10,
                                    left: 10,
                                    color: "white",
                                    width: 180,
                                  }}>
                                    <h3 style={{
                                      color: "white",
                                      fontWeight: "1200",
                                      fontSize: 16,
                                      margin: 0,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis"
                                    }}>{address}</h3> 
                                    <p>{moment(createAt).fromNow()}</p>
                                  </div>
                                </>}
                              />
                            )
                        })}
                    </div>
                  )}
                ) : <></>}
            </div>
          )}
      </div>

  )
}