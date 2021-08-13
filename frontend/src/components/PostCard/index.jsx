import React, { useState, useEffect, useContext } from "react";
import { List } from "antd";
import { Row, Col, Menu, Dropdown, Card } from "antd";
import moment from "moment";
import Geocode from "react-geocode";
import { Link } from "react-router-dom";
import { get } from "lodash";

import { AuthContext } from "../../context/auth";
import Pin from "../../assets/pin-svg-25px.svg";
import LikeButton from "../Buttons/LikeButton/index";
import CommentButton from "../Buttons/CommentButton/index";
import RepostButton from "../Buttons/RepostButton/index";
import Photo from '../Photo'

import { DropIcon } from "../../library/Icon";
import { MessageOutlined, RetweetOutlined, LoadingOutlined } from '@ant-design/icons';

import { useMutation } from "@apollo/client";
import {
  DELETE_POST,
  MUTE_POST,
  SUBSCRIBE_POST,
} from "../../GraphQL/Mutations";
import { PostContext } from "../../context/posts";

import "./style.css";
import { MAP_API_KEY } from "../../util/ConfigMap";
import Modal from "../Modal";
import BackDrop from "../BackDrop";
import ImgPreview from "../ImgPreview";

Geocode.setApiKey(MAP_API_KEY);

Geocode.setLanguage("id");

export default function PostCard({ post, loading, type }) {
  const [media] = useState(post.media)
  const [address, setAddress] = useState("");
  const [repostAddress, setRepostAddress] = useState("");
  const [repostData, setRepostData] = useState("");
  const [deleteModal, setDeleteModal] = useState(false)
  const {loginLoader} = useContext(AuthContext)
  const { user } = useContext(AuthContext);
  const postContext = useContext(PostContext);

  const [deletePost, {loading: deletePostLoading}] = useMutation(DELETE_POST, {
    update(_, { data: { deletePost} }) {
      
      postContext.deletePost(post.id, post.room);
    },
  });
  const [mutePost] = useMutation(MUTE_POST, {
    update(_, { data: { mutePost } }) {
      postContext.mutePost(mutePost, post.room);
    },
  });

  const [subscribePost] = useMutation(SUBSCRIBE_POST, {
    update(_, { data: { subscribePost } }) {
      postContext.subscribePost(subscribePost, post);
    },
  });
  const userName = user && user.username;
  const repost = get(post, "repost") || {};
  const isRepost = get(repost, "id") || "";

  const { muted, subscribe } = post;
  const isMuted = user && muted && muted.find((mute) => mute.owner === user.username);

  const isSubscribe = user && subscribe && subscribe.find((sub) => sub.owner === user.username);

  useEffect(() => {
    if (post.location) {
      Geocode.fromLatLng(post.location.lat, post.location.lng).then(
        (response) => {
          const address = response.results[0].address_components[1].short_name;
          setAddress(address);
        },
        (error) => {
          console.error(error);
        }
      );

      if (isRepost) {
        const { location } = repost;
        Geocode.fromLatLng(location.lat, location.lng).then(
          (response) => {
            const address =
              response.results[0].address_components[1].short_name;
            setRepostAddress(address);
            setRepostData(repost);
          },
          (error) => {
            console.error(error);
          }
        );
      }
    }
  }, [post, isRepost]);


  return (
    <List itemLayout="vertical" size="large" style={{
      background: 'white',
      marginBottom: '16px',
      borderRadius: 5
      }}>
      <List.Item
        key={post.id}
        className="list-actions"
        actions={
          !loading && [
            <>
              <div className="action-post">
                <div className="action-post__item">
                  <LikeButton
                    likeCount={post.likeCount}
                    likes={post.likes}
                    id={post.id}
                    room={post.room}
                    type={type}
                  />
                </div>
                <div className="action-post__item">
                  <Link to={`/${post.room ? post.room : "post"}/${post.id}`}>
                  <CommentButton commentCount={post.commentCount} icon={<MessageOutlined />} />
                  </Link>
                </div>
                <div className="action-post__item">
                  <RepostButton idPost={post.id} room={post.room} repostCount={post.repostCount} icon={<RetweetOutlined />} />
                </div>
              </div>
            </>,
          ]
        }
      >
        
        <List.Item.Meta
          title={
            <div>
              <Row>
                <Col span={20}>
                  <Link to={`/${post.room ? post.room : "post"}/${post.id}`} style={{ fontSize: 15 }}>
                    <img src={Pin} style={{ width: 15, marginTop: -4 }} />
                    {address}
                  </Link>
                  {userName == post.owner && (
                    <div
                      style={{
                        width: 60,
                        height: 20,
                        border: "1px black solid",
                        borderRadius: 5,
                        textAlign: "center",
                        display: "inline-block",
                        marginLeft: 6,
                      }}
                    >
                      <p style={{ fontSize: 14 }}>My Post</p>
                    </div>
                  )}
                </Col>
                <Col span={4}>
                  <Dropdown
                    overlay={
                      <Menu>
                        {!post.room && (<Menu.Item
                          key="0"
                          onClick={() =>
                            subscribePost({ variables: { id: post.id, room: post.room } })
                          }
                        >
                          {isSubscribe ? "Unsubscribe" : "Subscribe"}
                        </Menu.Item>)}
                        {!post.room && (<Menu.Item
                          key="1"
                          onClick={() =>
                            mutePost({ variables: { postId: post.id, room: post.room} })
                          }
                        >
                          {isMuted ? "Unmute" : "Mute"}
                        </Menu.Item>)}
                        <Menu.Item key="3">Report</Menu.Item>
                        {userName === post.owner ? (
                          <Menu.Item
                            key="4"
                            onClick={() => setDeleteModal(true)}>
                            <span>Delete Post</span>
                          </Menu.Item>
                        ) : null}
                      </Menu>
                    }
                    trigger={["click"]}
                    placement="bottomLeft"
                  >
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      <DropIcon />
                      
                    </a>
                    
                  </Dropdown>
                </Col>
              </Row>
            </div>
          }
          description={<div>{moment(post.createdAt).fromNow()}</div>}
        ></List.Item.Meta>
        {isRepost && (
          <Card
            bodyStyle={{ padding: "10px 12px" }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 10,
              backgroundColor: "#f5f5f5",
              borderColor: "#ededed",
              padding: 0,
              marginBottom: 20,
            }}
          >
            <Link to={`/post/${post.id}`} style={{ fontSize: 15 }}>
              <img src={Pin} style={{ width: 15, marginTop: -4 }} />
              {repostAddress}
            </Link>
            {userName == post.owner && (
              <div
                style={{
                  width: 60,
                  height: 20,
                  border: "1px black solid",
                  borderRadius: 5,
                  textAlign: "center",
                  display: "inline-block",
                  marginLeft: 6,
                }}
              >
                <p style={{ fontSize: 14 }}>My Post</p>
              </div>
            )}
            <span style={{ fontSize: 12 }}>
              {<div style={{marginBottom: 16}}>{moment(repost.createdAt).fromNow()}</div>}
            </span>
            {repost.media && <Photo photo={repost.media} />}
            <div style={{ marginTop: 5 }}>{repost.text}</div>
            
          </Card>
        )}
        
        <p style={{ marginTop: -9 }}>{post.text}</p>
        {/* {
          loginLoader && <ImgPreview photo={media} />
        } */}
        {deletePostLoading && <BackDrop ><LoadingOutlined style={{fontSize: 50}} /></BackDrop> }   
        <Photo photo={media} />
        <Modal title="delete this post"
         deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleYes={() => {
          deletePost({ variables: { id: post.id, room: post.room }})
          setDeleteModal(false)
          }}/>
        
      </List.Item>
    </List>
  );
}
