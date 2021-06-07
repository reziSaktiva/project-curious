import React, { useState, useEffect, useContext } from "react";
import { List } from "antd";
import { Row, Col, Menu, Dropdown, Image, Card } from "antd";
import moment from "moment";
import Geocode from "react-geocode";
import { Link } from "react-router-dom";
import { get } from "lodash";

import { AuthContext } from "../../context/auth";
import Pin from "../../assets/pin-svg-25px.svg";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";
import RepostButton from "../Buttons/RepostButton/index";

import { EllipsisOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import {
  DELETE_POST,
  MUTE_POST,
  SUBSCRIBE_POST,
} from "../../GraphQL/Mutations";
import { PostContext } from "../../context/posts";

import "./style.css";

Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k");

Geocode.setLanguage("id");

export default function PostCard({ post, loading }) {
  const [address, setAddress] = useState("");
  const [repostAddress, setRepostAddress] = useState("");
  const [repostData, setRepostData] = useState("");

  const { user } = useContext(AuthContext);
  const postContext = useContext(PostContext);

  const [deletePost] = useMutation(DELETE_POST, {
    update(_, { data: { deletePost } }) {
      alert(deletePost);
      postContext.deletePost(post.id);
    },
  });

  const [mutePost] = useMutation(MUTE_POST, {
    update(_, { data: { mutePost } }) {
      postContext.mutePost(mutePost);
    },
  });

  const [subscribePost] = useMutation(SUBSCRIBE_POST, {
    update(_, { data: { subscribePost } }) {
      postContext.subscribePost(subscribePost);
    },
  });
  const userName = user && user.username;
  const repost = get(post, "repost") || {};
  const isRepost = get(repost, "id") || "";

  const { muted, subscribe } = post;
  const isMuted =
    user && muted && muted.find((mute) => mute.owner === user.username);
  const isSubscribe =
    user && subscribe && subscribe.find((sub) => sub.owner === user.username);

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
    <List itemLayout="vertical" size="large">
      <List.Item
        key={post.id}
        className="list-actions"
        actions={
          !loading && [
            <>
              {/* <Row gutter={[48, 0]}>
                <Col xs={6} sm={8} md={8} lg={8} xl={8}>
                  <LikeButton
                    likeCount={post.likeCount}
                    likes={post.likes}
                    id={post.id}
                  />
                </Col>

                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Link to={`/post/${post.id}`}>
                    <CommentButton commentCount={post.commentCount} />
                  </Link>
                </Col>

                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <RepostButton idPost={post.id} />
                </Col>
              </Row> */}
              <div className="action-post">
                <div className="action-post__item">
                  <LikeButton
                    likeCount={post.likeCount}
                    likes={post.likes}
                    id={post.id}
                    room={post.room}
                  />
                </div>
                <div className="action-post__item">
                  <Link to={`/post/${post.id}`}>
                    <CommentButton commentCount={post.commentCount} />
                  </Link>
                </div>
                <div className="action-post__item">
                  <RepostButton idPost={post.id} />
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
                <Col span={12}>
                  <Link to={`/post/${post.id}`} style={{ fontSize: 15 }}>
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
                <Col span={12} style={{ textAlign: "right" }}>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="0"
                          onClick={() =>
                            subscribePost({ variables: { id: post.id } })
                          }
                        >
                          {isSubscribe ? "Unsubscribe" : "Subscribe"}
                        </Menu.Item>
                        <Menu.Item
                          key="1"
                          onClick={() =>
                            mutePost({ variables: { id: post.id } })
                          }
                        >
                          {isMuted ? "Unmute" : "Mute"}
                        </Menu.Item>
                        <Menu.Item key="3">Report</Menu.Item>
                        {userName === post.owner ? (
                          <Menu.Item
                            key="4"
                            onClick={() =>
                              deletePost({ variables: { id: post.id } })
                            }
                          >
                            Delete Post
                          </Menu.Item>
                        ) : null}
                      </Menu>
                    }
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <a
                      className="ant-dropdown-link"
                      onClick={(e) => e.preventDefault()}
                    >
                      <EllipsisOutlined />
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
              {moment(repost.createdAt).fromNow()}
            </span>
            {repost.media ? (
              repost.media.length == 1 ? (
                <Image
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    objectFit: "cover",
                    maxHeight: 300,
                    objectFit: "cover",
                  }}
                  src={repost.media}
                />
              ) : null
            ) : null}
            <div style={{ marginTop: 5 }}>{repost.text}</div>
          </Card>
        )}
        <p style={{ marginTop: -9 }}>{post.text}</p>
        {post.media ? (
          post.media.length == 1 ? (
            <Image
              style={{
                width: "100%",
                borderRadius: 10,
                objectFit: "cover",
                maxHeight: 300,
              }}
              src={post.media}
            />
          ) : null
        ) : null}

        {post.media ? (
          post.media.length == 2 ? (
            <table className="row-card-2">
              <tbody>
                <tr>
                  <Image.PreviewGroup>
                    <td style={{ width: "50%" }}>
                      <Image
                        style={{ borderRadius: "10px 0px 0px 10px" }}
                        src={post.media[0]}
                      />
                    </td>
                    <td>
                      <Image
                        style={{ borderRadius: "0px 10px 10px 0px" }}
                        src={post.media[1]}
                      />
                    </td>
                  </Image.PreviewGroup>
                </tr>
              </tbody>
            </table>
          ) : null
        ) : null}

        {post.media ? (
          post.media.length >= 3 ? (
            <table className="photo-grid-3">
              <Image.PreviewGroup>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <td
                      rowspan="2"
                      style={{ width: "50%", verticalAlign: "top" }}
                    >
                      <Image
                        className="pict1-3"
                        style={{ borderRadius: "10px 0px 0px 10px" }}
                        src={post.media[0]}
                      />
                    </td>
                    <td style={{ width: "50%" }}>
                      <Image
                        className="pict2-3"
                        style={{ borderRadius: "0px 10px 0px 0px" }}
                        src={post.media[1]}
                      />
                      <div
                        className="text-container"
                        style={{ marginTop: "-6px" }}
                      >
                        <Image
                          className="pict3-3"
                          style={
                            post.media.length > 3
                              ? {
                                  borderRadius: "0px 0px 10px 0px",
                                  filter: "blur(2px)",
                                }
                              : { borderRadius: "0px 0px 10px 0px" }
                          }
                          src={post.media[2]}
                        />
                        <div className="text-center">
                          {post.media.length > 3
                            ? "+" + (post.media.length - 3)
                            : null}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {post.media.length > 3 ? (
                    <div>
                      <Image
                        className="pict3-3"
                        style={{ display: "none" }}
                        src={post.media[3]}
                      />
                      {post.media.length > 4 ? (
                        <Image
                          className="pict3-3"
                          style={{ display: "none" }}
                          src={post.media[4]}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </tbody>
              </Image.PreviewGroup>
            </table>
          ) : null
        ) : null}

        {post.media ? (
          post.media.length >= 3 ? (
            <table className="photo-grid-3">
              <tbody>
                <tr>
                  <td rowSpan="2" style={{ width: "50%" }}>
                    <img
                      className="pict1-3"
                      src={post.media[0]}
                      style={{ borderRadius: "10px 0px 0px 10px" }}
                    />
                  </td>
                  <td style={{ width: "50%" }}>
                    <img
                      className="pict2-3"
                      src={post.media[1]}
                      style={{ borderRadius: "0px 10px 0px 0px" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "50%" }}>
                    <div className="text-container">
                      <img
                        className="pict3-3"
                        src={post.media[2]}
                        style={
                          post.media.length > 3
                            ? {
                                borderRadius: "0px 0px 10px 0px",
                                filter: "blur(2px)",
                              }
                            : { borderRadius: "0px 0px 10px 0px" }
                        }
                      />
                      <div className="text-center">
                        {post.media.length > 3
                          ? "+" + (post.media.length - 3)
                          : null}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : null
        ) : null}
      </List.Item>
    </List>
  );
}
