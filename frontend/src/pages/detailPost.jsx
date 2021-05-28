//GQL
import moment from "moment";
import Geocode from "react-geocode";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_COMMENT } from "../GraphQL/Mutations";
import React, { useContext, useEffect, useState } from "react";
import Meta from "antd/lib/card/Meta";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

//antd
import {
  Skeleton,
  List,
  Avatar,
  Card,
  Row,
  Col,
  Dropdown,
  Menu,
  Input,
  Upload,
  Button,
  Form,
} from "antd";

//component
import Pin from "../assets/pin-svg-25px.svg";
import LikeButton from "../components/Buttons/LikeButton";
import CommentButton from "../components/Buttons/CommentButton";
import RepostButton from "../components/Buttons/RepostButton";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import PostNavBar from "../components/PostNavBar";

// Query
import { GET_POST } from "../GraphQL/Queries";
import { PostContext } from "../context/posts";

//location
Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k");
Geocode.setLanguage("id");

const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

export default function SinglePost(props) {
  const { post, setPost, loading } = useContext(PostContext);
  const [address, setAddress] = useState("");
  const [comments, setComments] = useState([]);

  let id = props.match.params.id;

  const [getPost, { data }] = useLazyQuery(GET_POST);

  useEffect(() => {
    if (id) {
      getPost({ variables: { id } });
    }
  }, []);
  //input form

  useEffect(() => {
    if (data) {
      const post = data.getPost
      setPost(post);

      Geocode.fromLatLng(post.location.lat, post.location.lng).then(
        (response) => {
          const address = response.results[0].address_components[1].short_name;
          setAddress(address);
        },
        (error) => {
          console.error(error);
        }
      );

      setComments(post.comments);
    }
  }, [data]);

  const [createComment] = useMutation(CREATE_COMMENT, {
    onError(err) {
      console.log(err.message);
    },
  });

  const onFinish = (values) => {
    const { comment } = values;
    console.log("Success:", values);

    createComment({ variables: { id, text: comment } });
  };

  // //translate location


  // //post card start here
  return post ? (
    <List itemLayout="vertical" size="large">
      <PostNavBar />
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
        <Skeleton loading={loading} active avatar>
          <List.Item.Meta
            title={
              <div>
                <Row>
                  <Col span={12}>
                    <img src={Pin} style={{ width: 20, position: "center" }} />
                    {address}
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Dropdown
                      overlay={
                        <Menu>
                          <Menu.Item key="0">Subscribe</Menu.Item>
                          <Menu.Item key="1" onClick={(e) => console.log(e)}>
                            Mute
                          </Menu.Item>
                          <Menu.Item key="3">Report</Menu.Item>
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
            description={moment(post.createdAt).fromNow()}
          />
          {post.text}
        </Skeleton>
      </List.Item>
      {comments && comments.length == 0 ? null : (
        <List
          itemLayout="vertical"
          size="large"
          dataSource={comments}
          renderItem={(item) => (
            <Card
              style={{
                width: "100%",
                backgroundColor: "#ececec",
                marginBottom: -20,
              }}
              loading={loading}
            >
              <Meta
                avatar={
                  <Link to="/profile">
                    <Avatar
                      size={50}
                      style={{
                        backgroundColor: item.colorCode,
                        backgroundImage: `url(${item.displayImage})`,
                        backgroundSize: 50,
                      }}
                    />
                  </Link>
                }
                title={
                  <Row>
                    <Col span={12}>
                      <p style={{ fontWeight: "bold" }}>{item.displayName}</p>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item key="0">Subscribe</Menu.Item>
                            <Menu.Item key="1" onClick={(e) => console.log(e)}>
                              Mute
                            </Menu.Item>
                            <Menu.Item key="3">Report</Menu.Item>
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
                }
                description={<p style={{ color: "black" }}>{item.text}</p>}
              />
              <div
                style={{
                  marginTop: 20,
                  display: "inline-block",
                  marginBottom: -20,
                }}
              >
                <p>
                  {moment(item.createdAt).fromNow()}
                  <p
                    style={{
                      fontWeight: "bold",
                      display: "inline-block",
                      marginLeft: 10,
                    }}
                  >
                    Reply
                  </p>
                </p>
              </div>
            </Card>
          )}
        />
      )}
      <Form
        style={{ marginTop: 21, paddingBottom: -20 }}
        name="basic"
        // onFinish={onFinish}
        // onFinishFailed={onFinish}
      >
        <Row>
          <Col span={2}>
            <Form.Item name="upload" className="centeringButton">
              <Upload>
                <Button
                  style={{ border: "none" }}
                  icon={<PlusOutlined style={{ color: "#7f57ff" }} />}
                />
              </Upload>
            </Form.Item>
          </Col>

          <Col span={19}>
            <Form.Item
              name="comment"
              rules={[
                { required: true, message: "Isi komennya dulu ya broooo!" },
              ]}
            >
              <Input
                placeholder="Write your comment..."
                style={{ borderRadius: 20 }}
              />
            </Form.Item>
          </Col>

          <Col span={3}>
            <Form.Item className="centeringButton">
              <Button
                htmlType="submit"
                style={{
                  borderRadius: 20,
                  backgroundColor: "#7f57ff",
                  display: "inline-block",
                  color: "white",
                }}
              >
                Post
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </List>
  ) : <div>loading...</div>
}
