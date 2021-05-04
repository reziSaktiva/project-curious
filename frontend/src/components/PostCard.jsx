import React, { useState, useEffect, useContext } from "react";
import { List } from "antd";
import { Row, Col, Menu, Dropdown } from "antd";
import moment from "moment";
import Geocode from "react-geocode";

import { AuthContext } from "../context/auth";
import Pin from "../assets/pin-svg-25px.svg";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import RepostButton from "./RepostButton";

import { EllipsisOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { DELETE_POST, MUTE_POST } from "../GraphQL/Mutations";
import { PostContext } from "../context/posts";
import { Link } from "react-router-dom";

Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k");

Geocode.setLanguage("id");

export default function PostCard({ post, loading }) {
  const [address, setAddress] = useState("");
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

  const userName = user && user.username;

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
    }
  }, [post]);

  console.log(post);

  return (
    <List itemLayout="vertical" size="large">
      <List.Item
        key={post.id}
        actions={
          !loading && [
            <Row gutter={[48, 0]}>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <LikeButton
                  likeCount={post.likeCount}
                  likes={post.likes}
                  id={post.id}
                />
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <CommentButton commentCount={post.commentCount} />
              </Col>
              <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                <RepostButton />
              </Col>
            </Row>,
          ]
        }
      >
        <List.Item.Meta
          extra={<a href="#" />}
          title={
            <div>
              <Row>
                <Col span={12}>
                  <Link to={`/post/${post.id}`} style={{ fontSize: 15 }}>
                    <img src={Pin} style={{ width: 15, marginTop: -4 }} />
                    {address}
                  </Link>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="0">Subscribe</Menu.Item>
                        <Menu.Item key="1" onClick={() => mutePost({ variables: { id: post.id } })}>
                          Mute
                        </Menu.Item>
                        <Menu.Item key="3">Report</Menu.Item>
                        {userName === post.owner ? (
                          <Menu.Item key="4" onClick={() => deletePost({ variables: { id: post.Id } })}>
                            Delete Post
                          </Menu.Item>
                          ) : (null)}
                        </Menu>
                        } 
                        trigger={['click']} placement="bottomRight">
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          <EllipsisOutlined />
                        </a>
                      </Dropdown>
                      </Col>
                  </Row>
                    </div>}
                  description={<div style={{ marginTop: -15 }}>{moment(post.createdAt).fromNow()}</div>}
                >
                </List.Item.Meta>
                <p style={{marginTop: -9}}>{post.text}</p>
                {post.media? (
                  post.media.length == 1? (
                    <img src={post.media} style={{ width: "100%", borderRadius: 10 }} />
                  ) : null
                ) : null}

                {post.media? (
                  post.media.length == 2? (
                    <div className="row-card-2">
                      <img src={post.media[0]} style={{borderRadius: "10px 0px 0px 10px"}} />
                      <img src={post.media[1]} style={{borderRadius: "0px 10px 10px 0px"}} />
                  </div>
                  ) : null
                ) : null}

                {post.media? (
                  post.media.length >= 3? (
                    <table className="photo-grid-3">
                      <tr>
                        <td rowspan="2" style={{width: "50%"}}>
                          <img className="pict1-3" src={post.media[0]} style={{borderRadius: "10px 0px 0px 10px"}} />
                        </td>
                        <td style={{width: "50%"}}>
                          <img className="pict2-3" src={post.media[1]} style={{borderRadius: "0px 10px 0px 0px"}} />
                        </td>
                      </tr>
                      <tr>
                        <td style={{width: "50%"}}>
                          <div className="text-container">
                        <img className="pict3-3" src={post.media[2]} style={post.media.length > 3? {borderRadius: "0px 0px 10px 0px", filter: "blur(2px)" }: {borderRadius: "0px 0px 10px 0px" }} />
                          <div className="text-center">{post.media.length > 3? ("+" +(post.media.length - 3)) : null}</div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  ) : null
                ) : null}

            </List.Item>
        </List>
    )
}
