import React, { useContext, useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./style.css";
import { Col, Row, Tabs } from "antd";
import { chunk } from "lodash";

//assets
import no_likes from '../../assets/Noresults/No_likes_profile.png'
import no_posts from '../../assets/Noresults/No_posts_home_Profile.png'

//location
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

// Components
import PostCard from "../../components/PostCard/index";
import AppBar from "../../components/AppBar";
import { Helmet } from "react-helmet";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_PROFILE_LIKED_POSTS, GET_PROFILE_POSTS, GET_USER_DATA } from "../../GraphQL/Queries";
import { PostContext } from "../../context/posts";
import InfiniteScroll from "../../components/InfiniteScroll";

import SkeletonLoading from "../../components/SkeletonLoading";
import { AuthContext } from "../../context/auth";
import Media from "./Media";

function OtherProfile({ username }) {
    const [userData, setUserData] = useState(null)
    const { posts, setPosts, likedPosts, setLikedPosts } = useContext(PostContext);
    const { user } = useContext(AuthContext)
    const [gallery, setgallery] = useState()
    const { data } = useQuery(GET_USER_DATA, {
        variables: { username }
    })

    const [getProfilePosts, { data: dataPosts, loading }] = useLazyQuery(GET_PROFILE_POSTS)
    const [getProfileLikedPost, { data: dataLikedPosts }] = useLazyQuery(GET_PROFILE_LIKED_POSTS)

    useEffect(() => {
        if (data) setUserData({
            ...data.getUserData.user,
            galery: data.getUserData.galery
        })
    }, [data])

    useEffect(() => {
        if (userData) {
            if (!userData.private) {
                getProfilePosts({ variables: { username } })
                getProfileLikedPost({ variables: { username } })
            }
        }
    }, [userData])

    useEffect(() => {
        if (dataPosts) {
            setPosts(dataPosts.getProfilePosts)
        }
        if (dataLikedPosts) {
            setLikedPosts(dataLikedPosts.getProfileLikedPost)
        }
    }, [dataPosts, dataLikedPosts])

    useEffect(() => {
        if (userData) {
            const gallery = chunk(userData.galery, 4);
            setgallery(gallery)
        }
    }, [userData])

    const { TabPane } = Tabs;

    const Demo = () => (
        <Tabs defaultActiveKey="1" centered>
            <TabPane tab="Posts" key="1">
                {loading ? (
                    <SkeletonLoading />
                ) : (
                    !posts ? (
                        <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                            <img src={no_posts} style={{ width: 300 }} />
                            <h4 style={{ textAlign: 'center' }}>There is no Nearby post around you</h4>
                            <h4 style={{ textAlign: 'center' }}>be the first to post in your area!</h4>
                            <h4 style={{ textAlign: 'center' }}>or change your location to see other post around</h4>
                        </div>
                    ) : (
                        <InfiniteScroll profile={"profilePosts"}>{
                            posts.map((post, key) => {
                                return (
                                    userData && (
                                        <div key={`posts${post.id} ${key}`}>
                                            <PostCard post={post} type="nearby" loading={loading} />
                                        </div>
                                    )
                                );
                            })
                        }</InfiniteScroll>
                    )
                )}
            </TabPane>
            <TabPane tab="Liked" key="2">
                {!dataLikedPosts ? (
                    <SkeletonLoading />
                ) : (
                    dataLikedPosts.getProfileLikedPost.posts.length ? (
                        <InfiniteScroll profile={"likedPosts"}>{
                            likedPosts.map((post, key) => {
                                return (
                                    post &&
                                    user && (
                                        <div key={`posts${post.id} ${key}`}>
                                            <PostCard post={post} type='liked_posts' loading={loading} />
                                        </div>
                                    )
                                );
                            })
                        }</InfiniteScroll>
                    ) : (
                        <div className="centeringButton">
                            <img src={no_likes} style={{ width: 300 }} />
                            <h4 style={{ textAlign: 'center' }}>Try Likes Some Posts</h4>
                            <h4 style={{ textAlign: 'center' }}>and it will displayed here</h4>
                        </div>
                    )
                )}
            </TabPane>

            <TabPane tab="Media" key="3">
                <Media gallery={gallery} />
            </TabPane>
        </Tabs>
    );
    return userData ? (
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
                                {userData && userData.postsCount}
                            </h5>
                            <p>Post</p>
                        </Col>
                        <Col span={8}>
                            <h5>{userData && userData.repostCount}</h5>
                            <p>Repost</p>
                        </Col>
                        <Col span={8}>
                            <h5>
                                {userData && userData.likesCount}
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
                            value={`curious.me/${userData && userData.newUsername ? userData.newUsername : userData.username}`}
                        />
                        <button
                            className="ui teal right icon button"
                            style={{ backgroundColor: "#7F57FF", fontSize: 10 }}
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {userData && userData.private ? (
                    <div style={{ display: 'grid', placeItems: 'center', height: "100%" }}>
                        This User Profile is Private
                    </div>
                ) : Demo()}
            </div>}

        </div>
    ) : (<div>
        <AppBar title="My Profile" />
        <div style={{display: 'grid', placeItems: 'center'}}>
        <div className="profile_not_found" />
        <h1>user tidak di temukan</h1>
        </div>
        </div>
    )
}

export default OtherProfile