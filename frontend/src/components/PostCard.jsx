import React, { useState, useEffect, useContext } from "react";
import { List } from "antd";
import { Row, Col, Menu, Dropdown } from "antd";
import moment from "moment";
import Geocode from "react-geocode";

import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import RepostButton from "./RepostButton";

import { EllipsisOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { DELETE_POST, MUTE_POST } from "../GraphQL/Mutations";
import { PostContext } from "../context/posts";

Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k");

Geocode.setLanguage("id");

export default function PostCard({ post, loading }) {
  const [address, setAddress] = useState("");
  const { user } = useContext(AuthContext);
  const postContext = useContext(PostContext)

  const [ deletePost ] = useMutation(DELETE_POST, {
    update(_, { data: { deletePost } }) {
      alert(deletePost);
      postContext.deletePost(post.id)
    },
  })

  const [ mutePost ] = useMutation(MUTE_POST, {
    update(_, {data: { mutePost } }){
      postContext.mutePost(mutePost)
    }
  })

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

  return (
    <List itemLayout="vertical" size="large">
      <List.Item
        key={post.id}
        actions={
          !loading && [
            <LikeButton
              likeCount={post.likeCount}
              likes={post.likes}
              id={post.id}
            />,
            <CommentButton commentCount={post.commentCount} />,
            <RepostButton />,
          ]
        }
      >
        <List.Item.Meta
          extra={<a href="#" />}
          title={
            <div>
              <Row>
                <Col span={12}>
                  <a href={`/post/${post.id}`}>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/insvire-curious-app12.appspot.com/o/mapRadius%2Fpin-figma.png?alt=media&token=3d842f6c-3338-486c-8605-4940e05b96b6"
                      style={{ width: 15 }}
                    />{" "}
                    {address}
                  </a>
                </Col>
                <Col span={12} style={{ textAlign: "right" }}>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item key="0">Subscribe</Menu.Item>
                        <Menu.Item key="1" onClick={() => mutePost({ variables: { id: post.id } })}>
                          {user && post.muted.find((mute) => mute.owner === user.username) ? "Unmute" : "Mute"}
                        </Menu.Item>
                        <Menu.Item key="3">Report</Menu.Item>
                        {post.owner === userName && (
                          <Menu.Item key="4" onClick={() => deletePost({ variables: { id: post.id } })}>delete</Menu.Item>
                        )}
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
          description={
            <div style={{ marginTop: -9 }}>
              {moment(post.createdAt).fromNow()}
            </div>
          }
        ></List.Item.Meta>
        {post.text}
        <br />
      </List.Item>
    </List>
  );
}
