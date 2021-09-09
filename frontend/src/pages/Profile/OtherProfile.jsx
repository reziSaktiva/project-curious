import React, { useContext, useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./style.css";
import { Col, Row } from "antd";
import { EditOutlined } from "@ant-design/icons";

//location
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { Link } from "react-router-dom";

// Components
import AppBar from "../../components/AppBar";
import { Helmet } from "react-helmet";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_PROFILE_LIKED_POSTS, GET_PROFILE_POSTS, GET_USER_DATA } from "../../GraphQL/Queries";

function OtherProfile({ username }) {
    const [userData, setUserData] = useState({})
    const [profilePosts, setProfilePosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const { data } = useQuery(GET_USER_DATA, {
        variables: { username }
    })

    const [getProfilePosts, { data: dataPosts}] = useLazyQuery(GET_PROFILE_POSTS)
    const [getProfileLikedPost, { data: dataLikedPosts}] = useLazyQuery(GET_PROFILE_LIKED_POSTS)

    useEffect(() => {
        if (data) setUserData(data.getUserData.user)
    }, [data])

    useEffect(() => {
      if(userData){
        getProfilePosts({variables: { username }})
        getProfileLikedPost({variables: { username }})
      }
    }, [userData])

    useEffect(() => {
        if(dataPosts){
            setProfilePosts(dataPosts.getProfilePosts)
        }
        if(dataLikedPosts){
            setLikedPosts(dataLikedPosts.getProfileLikedPost)
        }
    }, [dataPosts, dataLikedPosts])

    console.log("likedPost", likedPosts);
    console.log("profilePosts", profilePosts);
    return (
        <div>
            <Helmet>
                <title>Curious - Profile</title>
                <meta name="description" content="Where all your post stored here and also your photos, share your profile to your friend and see how they react." />
                <meta name="keywords" description="Social Media, Dating App, Chat App" />
            </Helmet>
            <AppBar title="My Profile" />
            {<div>
                <div
                    style={{ margin: "auto", width: 80, marginTop: 60, marginBottom: -10, }}
                >
                    <div style={{ position: "relative", textAlign: "center", width: 80, backgroundColor: 'white' }}>
                        <img
                            src={userData && userData.profilePicture}
                            style={{
                                borderRadius: "50%",
                                objectFit: "cover",
                                width: 80,
                                height: 80,
                            }}
                        />
                        <div
                            style={{
                                backgroundColor: "#7f57ff",
                                color: "white",
                                borderRadius: "50%",
                                width: 21,
                                height: 21,
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                            }}
                        >
                            <Link to="/editProfile" showUploadList={false}>
                                <EditOutlined style={{ color: 'white' }} />
                            </Link>
                        </div>
                    </div>
                </div>

                <h4 style={{ textAlign: "center" }}>{userData && userData.newUsername ? userData.newUsername : userData.username}</h4>
                <div style={{ textAlign: "center", margin: "auto", width: "50%" }}>
                    {/* <Link to="/maps">
              <img src={Pin} style={{ width: 20, marginTop: -5 }} />
              <span style={{ fontSize: 12 }}>{address}</span>
            </Link> */}
                </div>

                <div
                    style={{
                        textAlign: "center",
                        margin: "auto",
                        width: "50%",
                        marginTop: 20,
                    }}
                >
                    <Row>
                        <Col span={8}>
                            <h5>
                                {99}
                            </h5>
                            <p>Post</p>
                        </Col>
                        <Col span={8}>
                            <h5>{99}</h5>
                            <p>Repost</p>
                        </Col>
                        <Col span={8}>
                            <h5>
                                {99}
                            </h5>
                            <p>Likes</p>
                        </Col>
                    </Row>
                </div>

                <div
                    style={{
                        textAlign: "center",
                        margin: "auto",
                        width: "50%",
                        marginTop: 20,
                        marginBottom: 40,
                    }}
                >
                    <div className="ui action input" style={{ height: 25 }}>
                        <input
                            type="text"
                            value={`curious.me/${"jonijomblo"}`}
                        />
                        <button
                            className="ui teal right icon button"
                            style={{ backgroundColor: "#7F57FF", fontSize: 10 }}
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {/* {Demo()} */}
            </div>}

        </div>
    )
}

export default OtherProfile