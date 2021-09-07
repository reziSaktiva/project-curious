// Modules
import React, { useContext, useEffect, useState } from "react";
import cn from "classnames";
import { useQuery } from "@apollo/client";
import { chunk } from "lodash";
import { GET_PROFILE_POSTS, GET_PROFILE_LIKED_POSTS } from "../../GraphQL/Queries";
// import { CHANGE_PP } from "../../GraphQL/Mutations";
import { AuthContext } from "../../context/auth";
import "antd/dist/antd.css";
import "./style.css";
import { Col, Row, Tabs, } from "antd";
import { EditOutlined } from "@ant-design/icons";


//assets
import Pin from "../../assets/pin-svg-25px.svg";
import IconCrash from "../../assets/ic-crash.png";
import no_media from '../../assets/Noresults/No_images_profile.png'
import no_likes from '../../assets/Noresults/No_likes_profile.png'
import no_posts from '../../assets/Noresults/No_posts_home_Profile.png'

//location
import Geocode from "react-geocode";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { Link } from "react-router-dom";

// Components
import PostCard from "../../components/PostCard/index";
import AppBar from "../../components/AppBar";

// Init Firebase
import firebase from "firebase/app";
import "firebase/storage";
import { PostContext } from "../../context/posts";
import SkeletonLoading from "../../components/SkeletonLoading";
import SkeletonProfile from "./SkeletonProfile";
import { Helmet } from "react-helmet";
const storage = firebase.storage();

const InitialState = {
  url: "",
  isFinishUpload: false,
};

function Profile() {
  const { data: getProfilePosts, loading } = useQuery(GET_PROFILE_POSTS, {
    fetchPolicy: "network-only",
  });

  const { data: getProfileLikedPost } = useQuery(GET_PROFILE_LIKED_POSTS, {
    fetchPolicy: "network-only",
  });

  // const [changePPuser, { data }] = useMutation(CHANGE_PP);
  const { user, changeProfilePicture } = useContext(AuthContext);
  const { posts, setPosts, likedPosts, setLikedPosts } = useContext(PostContext);
  const [gallery, setGallery] = useState([]);
  const [address, setAddress] = useState("");
  const [postCount, setpostCount] = useState("")
  
  useEffect(() => {
    if(!loading) {
      setpostCount(posts.length)
    }
  }, [posts, loading])
  useEffect(() => {
    if (getProfilePosts && getProfileLikedPost) {
      setPosts({
        hasMore: false,
        posts: getProfilePosts.getProfilePosts
      });
      setLikedPosts(getProfileLikedPost.getProfileLikedPost);
      
    }
  }, [getProfilePosts, getProfileLikedPost]);

  const loc = localStorage.location;

  const location = loc ? JSON.parse(loc) : null;

  useEffect(() => {
    if (location) {
      setAddress(location.location);
    }
  }, [location])

  useEffect(() => {
    if (!loading && getProfilePosts) {
      const filterByMedia =
        getProfilePosts &&
        getProfilePosts.getProfilePosts.filter((post) => {
          const hasMedia = post.media && post.media.length >= 1;

          if (hasMedia) return post;
        });

      const gallery = chunk(filterByMedia, 4);

      setGallery(gallery);
    }
  }, [loading, getProfilePosts]);

  const likeCounter =
    getProfilePosts &&
    getProfilePosts.getProfilePosts.map((doc) => doc.likeCount);
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
            posts.map((post, key) => {
              return (
                user && (
                  <div key={`posts${post.id} ${key}`}>
                    <PostCard post={post} type="nearby" loading={loading} />
                  </div>
                )
              );
            })
          )
        )}
      </TabPane>
      <TabPane tab="Liked" key="2">
        {!getProfileLikedPost ? (
          <SkeletonLoading />
        ) : (
          getProfileLikedPost.getProfileLikedPost.length ? (
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
        {gallery.length ? (
          gallery.map((media) => (
            <div className="gallery">
              {media.length &&
                media.map((photo, idx) => {
                  const imgClass = cn({
                    gallery_item_right: idx === 1,
                    gallery_item_left: idx === 2,
                    gallery__img: idx != 1 || idx != 2,
                  });
                  return (
                    <img
                      key={`Media${idx}`}
                      src={photo.media}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = IconCrash;
                      }}
                      className={imgClass}
                      alt="Image 1"
                    />
                  )
                })}
            </div>
          ))
        ) : (
          <div className="centeringButton">
            <img src={no_media} style={{ width: 300 }} />
            <h4 style={{ textAlign: 'center' }}>Try Upload a Photo when posting</h4>
            <h4 style={{ textAlign: 'center' }}>and make your post more atractive</h4>
            <h4 style={{ textAlign: 'center' }}>and your photo colection will shown up here</h4>
          </div>
        )}
      </TabPane>
    </Tabs>
  );

  let repostCount = posts
    ? posts.reduce((accumulator, current) => {
      return accumulator + current.repostCount;
    }, 0) : 0;
  return (
    <div>
      <Helmet>
        <title>Curious - Profile</title>
        <meta name="description" content="Where all your post stored here and also your photos, share your profile to your friend and see how they react." />
        <meta name="keywords" description="Social Media, Dating App, Chat App" />
      </Helmet>
      <AppBar title="My Profile" />
      {loading ? (
        <SkeletonProfile />
      ) : (
        <div>
          <div
            style={{ margin: "auto", width: 80, marginTop: 60, marginBottom: -10, }}
          >
            <div style={{ position: "relative", textAlign: "center", width: 80, backgroundColor: 'white' }}>
              <img
                src={user.profilePicture}
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

          <h4 style={{ textAlign: "center" }}>{user.newUsername ? user.newUsername : user.username}</h4>
          <div style={{ textAlign: "center", margin: "auto", width: "50%" }}>
            <Link to="/maps">
              <img src={Pin} style={{ width: 20, marginTop: -5 }} />
              <span style={{ fontSize: 12 }}>{address}</span>
            </Link>
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
                  {getProfilePosts ? postCount : 0}
                </h5>
                <p>Post</p>
              </Col>
              <Col span={8}>
                <h5>{repostCount}</h5>
                <p>Repost</p>
              </Col>
              <Col span={8}>
                <h5>
                  {getProfilePosts && likeCounter.length >= 1
                    ? likeCounter.reduce((total, num) => (total += num))
                    : 0}
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
                value={`https://insvire-curious-app.web.app/profile/user/${user.id}`}
              />
              <button
                className="ui teal right icon button"
                style={{ backgroundColor: "#7F57FF", fontSize: 10 }}
              >
                Copy
              </button>
            </div>
          </div>

          {Demo()}
        </div>
      )}

    </div>
  );
}

export default Profile;
