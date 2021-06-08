//GQL
import moment, { defaultFormatUtc } from "moment";
import Geocode from "react-geocode";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_COMMENT } from "../GraphQL/Mutations";
import React, { useContext, useEffect, useRef, useState } from "react";
import Meta from "antd/lib/card/Meta";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { get } from "lodash";

import '../components/PostCard/style.css';

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
  Image,
  Modal
} from "antd";

//component
import Pin from "../assets/pin-svg-25px.svg";
import LikeButton from "../components/Buttons/LikeButton/index";
import CommentButton from "../components/Buttons/CommentButton/index";
import RepostButton from "../components/Buttons/RepostButton/index";
import { EllipsisOutlined, PlusOutlined, UploadButton } from "@ant-design/icons";
import PostNavBar from "../components/PostNavBar";

// Query
import { GET_POST } from "../GraphQL/Queries";
import { PostContext } from "../context/posts";

// Init Firebase
import firebase from 'firebase/app'
import 'firebase/storage'
const  storage = firebase.storage()

//location
Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k");
Geocode.setLanguage("id");

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default function SinglePost(props) {
  const _isMounted = useRef(false)
  const { post, setPost, loading, loadingData, setComment } = useContext(PostContext);
  const [address, setAddress] = useState("");
  const [repostAddress, setRepostAddress] = useState("");
  const [replay, setReplay] = useState({username: null, id: null});
  const [form] = Form.useForm()
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: []
  })
  const { previewVisible, previewImage, fileList, previewTitle } = state;

  // upload photo comment /////////////////////////////


  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const handleChange = ({ fileList }) => {
    const newFiles = fileList.map(file => ({ ...file, status: 'done'}))
    setState({
      ...state, 
      fileList: newFiles
    });
  };
  


  //akhir upload photo comentttttt //////////////////////////////////////////////////////////////////////

  
  const id = props.match.params.id;
  const room = props.match.params.room === "post" ? null : props.match.params.room

  const [getPost, { data }] = useLazyQuery(GET_POST ,{
    fetchPolicy: "network-only"
  });

  useEffect(() => {
    if (id) {
      getPost({ variables: { id, room } });
    }
  }, [id]);

  //reply func
  const handleReply =item => {
    console.log(item);
    setReplay({
      username : item.displayName,
      id: item.id
    })

    form.setFieldsValue({
      comment : `Reply to ${item.displayName}: ` 
    })

  }
  //input form

  useEffect(() => {
    if (!_isMounted.current && data) {
      if (!data) {
        loadingData()

        return;
      }

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

      // set did mount react
      _isMounted.current = true;

      return;
    }
  }, [data, _isMounted]);

  //repost

  const repost = get(post, "repost") || {};
  const isRepost = get(repost, "id") || "";

  useEffect(() => {
      if (isRepost) {
        const { location } = repost;
        Geocode.fromLatLng(location.lat, location.lng).then(
          (response) => {
            const address =
              response.results[0].address_components[1].short_name;
            setRepostAddress(address);
          },
          (error) => {
            console.error(error);
          }
        );
      }
  }, [post, isRepost]);


  const [createComment] = useMutation(CREATE_COMMENT, {
    onError(err) {
      console.log(err.message);
    },update(_, { data: { createComment: commentData } }){
      setComment(commentData)
  },
  });



  const onFinish = async value => {
    const { comment } = value;
    const newComment = comment ? comment.substring(comment.indexOf(':')+1) : ''
    const finalComment = newComment == undefined ? comment : newComment
    
    const isReplay = form.getFieldValue(["comment"]).includes(replay.username && replay.id)
    console.log(isReplay);

    if(!isReplay){
      setReplay({username: null, id: null})
    }
    let uploaded = [];
    ////////////////fungsi upload///////////////////
    console.log(fileList);
    if (fileList.length) {
      uploaded = await Promise.all(fileList.map(async (elem) => {
        const uploadTask = storage.ref(`images/${elem.originFileObj.name}`).put(elem.originFileObj)
  
        const url = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            () => {},
            error => {
              fileList.push({ ...elem, status: 'error' })
              reject()
            },
            async () => {
              const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
  
              resolve(downloadUrl);
            }
          )
        })
  
        return url
      }));
      

      setState({ ...state, uploaded, fileList, isFinishUpload: true, text: value.text });
      createComment({ variables: { text: finalComment, id: id, replay: replay, photo: uploaded[0] } });
      setState({...state, fileList: []})
      return;
    }


    setState({ ...state, uploaded: [], isFinishUpload: true, text: value.text})
    createComment({ variables: { text: finalComment, id: id, replay: replay, photo: '' } });

  };

  return (
    <List itemLayout="vertical" size="large">
      <PostNavBar />
     {post ? (
       <div>
          <List.Item
        key={post.id}
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
            <div style={{ display: "flex" }}>
              <p className="ic-location-small" style={{ margin: 0 }} />
              <div style={{ fontWeight: 600, paddingLeft: 10 }}>
                {repostAddress}
              </div>
            </div>
            <span style={{ fontSize: 12 }}>
              {moment(repost.createdAt).fromNow()}
            </span>
            {repost.media?(
              repost.media.length == 1 ? (
                <Image
                  style={{ width: "100%", borderRadius: 10, objectFit: "cover", maxHeight: 300, objectFit: "cover" }}
                  src={repost.media}
                />
              ) : null
              ) : null}
            <div style={{ marginTop: 5 }}>{repost.text}</div>
          </Card>
        )}
          {post.text}
        </Skeleton>
      </List.Item>
      {post.comments && post.comments.length == 0 ? (null) : (
        <div>
          <List
          itemLayout="vertical"
          size="large"
          dataSource={post.comments}
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
                  <div>
                    <div className="commentContainer"/>
                    <Avatar
                      size={50}
                      style={{
                        backgroundColor: item.colorCode,
                        backgroundImage: `url(${item.displayImage})`,
                        backgroundSize: 50,
                      }}
                    />
                  </div>
                    
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
                description={<div>
                  <p style={{ color: "black" }}>{item.text}</p>
                  {item.photo ?(
                    <Image
                    style={{
                      width: "80%",
                      height: 220,
                      borderRadius: 10,
                      objectFit: "cover",
                      maxHeight: 300,
                      objectFit: "cover",
                    }}
                    src={item.photo}
                  />
                  ) : null}
                  </div>}
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
                  
                  <Button
                  type="link"
                  onClick={() => handleReply(item)}
                    style={{
                      fontWeight: "bold",
                      display: "inline-block",
                      marginLeft: 10,
                      color: "black"
                    }}
                  >
                    Reply
                  </Button>
                </p>
              </div>
            <div>
            <List
            className="commentContainerReply"
          itemLayout="vertical"
          size="large"
          dataSource={item.replayList}
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
                    <Avatar
                      size={50}
                      style={{
                        backgroundColor: item.colorCode,
                        backgroundImage: `url(${item.displayImage})`,
                        backgroundSize: 50,
                      }}
                    />
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
                  
                  <Button
                  type="link"
                  onClick={() => handleReply(item)}
                    style={{
                      fontWeight: "bold",
                      display: "inline-block",
                      marginLeft: 10,
                      color: "red"
                    }}
                  >
                    Reply
                  </Button>
                </p>
              </div>
            <div>
            </div>
            </Card>
          )}>
          </List>
            </div>
            </Card>
          )}>
          </List>
          
        </div>
        
        
      )}
      <Form
       form={form}
        style={{ marginTop: 21, paddingBottom: -20 }}
        name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinish}
      >
        
        {fileList.length > 0 && (
          <div style={{backgroundColor: "#ececec"}}>
          <div style={{height:120, borderTopRightRadius: 30, borderTopLeftRadius: 30, backgroundColor: "white"}}>
            <Form.Item name="foto" style={{ marginBottom: 0 }} >
              <div className="centeringButton" style={{ marginTop: -8}}>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                accept="video/*, image/*"
                onPreview={handlePreview}
                onChange={handleChange}
              >
              </Upload>
              </div>
            </Form.Item>
            </div>
          </div>
          
          )}
        
        <Row>
          <Col span={2}>
            <Form.Item name="upload" className="centeringButton" >
              <Upload onChange={handleChange} showUploadList={false}>
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
              name="comment"
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
       </div>
     ) : (
     <div style={{margin:20}}>
       <Skeleton active  avatar paragraph={{ rows: 2 }} />
     </div>
     )}
    </List>
  )
  
}
