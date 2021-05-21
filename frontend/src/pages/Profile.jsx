import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PROFILE_POSTS, GET_PROFILE_LIKED_POSTS } from '../GraphQL/Queries'
import { AuthContext } from "../context/auth";
import 'antd/dist/antd.css';
import '../App.css'
import {  Col, Row, Tabs } from 'antd';

//assets
import Pin from '../assets/pin-svg-25px.svg'

//location
import Geocode from "react-geocode";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import PhotoGallery from '../components/PhotoGalerry';



function Profile() {

    const { data: getProfilePosts, loading } = useQuery(GET_PROFILE_POSTS);
    const { data: getProfileLikedPost } = useQuery(GET_PROFILE_LIKED_POSTS);
    const { user, liked } = useContext(AuthContext);
    const [address, setAddress] = useState("");
    //set location
    const loc = localStorage.location;
    const photogallery = []

const location = loc ? JSON.parse(loc) : null

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

const likeCounter = getProfilePosts && getProfilePosts.getProfilePosts.map(doc => doc.likeCount)
    const { TabPane } = Tabs;

    const Demo = () => (
        <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Posts" key="1">
            {!getProfilePosts ? null
                    : getProfilePosts.getProfilePosts.map((post, key) => {
                        return (
                            user && 
                                <div key={`posts${post.id} ${key}`}>
                                <PostCard post={post} loading={loading} />
                            </div>
                        )
                    })}
            </TabPane>
            <TabPane tab="Liked" key="2">
            {!getProfileLikedPost ? null
                    : getProfileLikedPost.getProfileLikedPost.map((post, key) => {
                        
                        return (
                            user && 
                                <div key={`posts${post.id} ${key}`}>
                                <PostCard post={post} loading={loading} />
                            </div>
                        )
                    })}
            </TabPane>

            <TabPane tab="Media" key="3">
            {/* {!data ? null
                    : data.getProfilePosts.map((post, key) => {
                        return (
                            user && 
                                <div key={`posts${post.id} ${key}`}>
                                <PhotoGallery post={post} loading={loading} />
                            </div>
                        )
                    })} */}
                    <div className="gallery">
            {!getProfilePosts ? null
                    : Array(getProfilePosts).map((post, key) => {

                        const hasmedia = post.media && post.media.length >=1 
                        // if(post.media) {
                        //     if(post.media.length >= 1) {
                        //         photogallery.push(post.media)
                        //     }
                        // }
                        return(
                            user && hasmedia && 
                            <div className={key}>
                                        {/* <figure className="gallery_item_1"> */}
                                            <img src={post.media} className="gallery__img"  alt="Image 1" />
                                            
                                       {/* </figure> */}
                                        </div>
                        )
                            
                    })}
                    </div>
                
            </TabPane>
            
        </Tabs>
    );
    return (
        <div>
            <Row>
                    <Col span={6}>
                    <button class="ui inverted basic button" type="text">
                            <i class="chevron left icon" style={{ color: 'black' }}></i>
                    </button>
                    </Col>
                    <Col span={12} style={{textAlign: "center"}}>
                    <h4>My profile</h4>
                    </Col>
                    <Col span={6} style={{textAlign: "right"}}>
                    <button class="ui inverted basic button" type="text">
                            <i class="ellipsis horizontal icon" style={{ color: 'black' }}></i>
                    </button>
                    </Col>
                </Row>

            <div style={{position:'fixed', width: "100%"}}>
                <div class="ui divider" style={{ marginLeft: -14 }}/>
            </div>
                <img src={user.profilePicture} 
                     style={{
                        marginTop:50,
                        borderRadius:"50%",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: 80,
                        height: 80,
                        objectFit: "cover"
                     }}
                />
                <h4 style={{textAlign: "center"}}>My Account</h4>
                <div style={{ textAlign: "center", margin: "auto", width: "50%" }}>
                    <Link to="/"><img src={Pin} style={{width:20, marginTop: -5}} /><span style={{ fontSize: 12 }}>{address}</span></Link>
                </div>


                <div style={{ textAlign: "center", margin: "auto", width: "50%", marginTop: 20 }}>
                    <Row>
                        <Col span={8}> 
                            <h5>{getProfilePosts? getProfilePosts.getProfilePosts.length: 0}</h5>
                            <p>Post</p>
                        </Col>
                        <Col span={8}> 
                            <h5>12</h5>
                            <p>Repost</p>
                        </Col>
                        <Col span={8}> 
                            <h5>{getProfilePosts && likeCounter.reduce((total, num) => total += num)}</h5>
                            <p>Likes</p>
                        </Col>
                    </Row>
                </div>
                
                <div style={{ textAlign: "center", margin: "auto", width: "50%", marginTop: 20, marginBottom: 40 }}>
                <div class="ui action input"
                    style={{height: 25}}>
                    <input type="text" value="http://ww.short.url/c0opq" />
                    <button class="ui teal right icon button" style={{ backgroundColor: '#7F57FF', fontSize: 10 }}>
                        Copy
                </button>
                        </div>
                </div>
                
                        {Demo()}
                    </div>
    )
}

export default Profile