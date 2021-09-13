//GQL
import moment from "moment";
import Geocode from "react-geocode";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_COMMENT, DELETE_POST, MUTE_POST, SUBSCRIBE_POST } from "../../GraphQL/Mutations";
import React, { useContext, useEffect, useRef, useState } from "react";
import Comments from './comments'
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { get } from "lodash";

import defaultStyle from './defaultStyle'
import defaultMentionStyle from './defaultMentionStyle'

import '../../components/PostCard/style.css';

//antd
import {
  Skeleton,
  List,
  Card,
  Row,
  Col,
  Dropdown,
  Menu,
  Input,
  Upload,
  Button,
  Form,
  Mentions,
} from "antd";

//component
import Pin from "../../assets/pin-svg-25px.svg";
import LikeButton from "../../components/Buttons/LikeButton/index";
import CommentButton from "../../components/Buttons/CommentButton/index";
import RepostButton from "../../components/Buttons/RepostButton/index";
import { EllipsisOutlined, PlusOutlined, LoadingOutlined, MessageOutlined } from "@ant-design/icons";
import Photo from "../../components/Photo";
import PostNavBar from "../../components/PostNavBar";
import { MentionsInput, Mention } from 'react-mentions'

// Query
import { GET_POST } from "../../GraphQL/Queries";
import { PostContext } from "../../context/posts";

// Init Firebase
import firebase from 'firebase/app'
import 'firebase/storage'
import { AuthContext } from "../../context/auth";
import { MAP_API_KEY } from "../../util/ConfigMap";
import Modal from "../../components/Modal";
import { useHistory } from "react-router";
import NoPost from "../404/404-Post";
import AppBar from "../../components/AppBar";
const storage = firebase.storage()

//location
Geocode.setApiKey(MAP_API_KEY);
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
  const history = useHistory()
  const [text, settext] = useState(null)
  // const _isMounted = useRef(false)
  const { post, setPost, loading, loadingData, setComment } = useContext(PostContext);
  const { user } = useContext(AuthContext)
  const [address, setAddress] = useState("");
  const [deleteModal, setDeleteModal] = useState(false)
  const [UploadBar, setUploadBar] = useState(0)
  const [repostAddress, setRepostAddress] = useState("");
  const [reply, setReply] = useState({ username: null, id: null });
  const postContext = useContext(PostContext);
  const [form] = Form.useForm()
  const [state, setState] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    fileList: []
  })
  const { fileList } = state;

  const [deletePost, { loading: deletePostLoading }] = useMutation(DELETE_POST, {
    update(_, { data: { deletePost } }) {
      history.push('/')
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
    const newFiles = fileList.map(file => ({ ...file, status: 'done' }))
    setState({
      ...state,
      fileList: newFiles
    });
  };

  const id = props.match.params.id;
  const room = props.match.params.room === "post" ? null : props.match.params.room

  const [getPost, { data, loading: getPostLoading, error }] = useLazyQuery(GET_POST, {
    fetchPolicy: 'network-only'
  });
  useEffect(() => {
    if (id) {
      getPost({ variables: { id, room } });
    }
  }, [id]);

  //input form

  useEffect(() => {
    if (data) {
      const post = data.getPost
      setPost(post);
      setAddress(post.location.location);

      return;
    }
  }, [data]);

  //repost

  const repost = get(post, "repost") || {};
  const isRepost = get(repost, "id") || "";

  useEffect(() => {
    if (isRepost) {
      const { location } = repost;
      setRepostAddress(location.location);
    }
  }, [isRepost]);


  const [createComment, { loading: loadingCreate }] = useMutation(CREATE_COMMENT, {
    onError(err) {
      console.log(err.message);
    }, update(_, { data: { createComment: commentData } }) {
      setTimeout(() => {
        setComment(commentData)
      }, 2500);
      
    },
  });
  const mentionSuggest = post && post.comments.map(data => {
    return {
      id: data.id,
      display: data.displayName
    }
  })
  const onFinish = async value => {
    const { comment } = value;
    // const usernameMention = comment.split("[")[1].split("]")[0];
    // const textAfterMention = comment.split("[")[1].split(")")[1];
    const finalComment =  comment ? (comment.split("[").length <= 1 ? (comment) : (comment.split("[")[1].split("]")[0] + comment.split("[")[1].split(")")[1])) : comment

    const isReply = form.getFieldValue(["comment"]) && form.getFieldValue(["comment"]).includes(reply.username && reply.id) || false

    if (!isReply) {
      setReply({ username: null, id: null })
    }
    let uploaded = [];
    ////////////////fungsi upload///////////////////
    if (fileList.length) {
      uploaded = await Promise.all(fileList.map(async (elem) => {
        const fileName = elem.uid + "." + elem.type.split("/")[1]
        const uploadTask = storage.ref(`images/${fileName}`).put(elem.originFileObj)

        const url = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              let uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100

              setUploadBar(Math.ceil(uploadProgress))
             },
            error => {
              fileList.push({ ...elem, status: 'error' })
              reject()
            },
            async () => {
              let downloadUrl;
                await uploadTask.snapshot.ref.getDownloadURL().then(data => {

                  return elem.type.split("/")[0] === "video" ? (
                    downloadUrl = "https://firebasestorage.googleapis.com/v0/b/insvire-curious-app.appspot." + data.split("?")[0].split(".")[4] + "." + data.split("?")[0].split(".")[5] + "?alt=media"
                    ) : (
                      downloadUrl = "https://firebasestorage.googleapis.com/v0/b/insvire-curious-app.appspot." + data.split("?")[0].split(".")[4] + "_1920x1080." + data.split("?")[0].split(".")[5] + "?alt=media" 
                    )

                  }).catch(err => reject());
                
                 resolve(downloadUrl)
                 setUploadBar(0)
                }
          )
        })

        return url
      }));

      setState({ ...state, uploaded, fileList, isFinishUpload: true, text: value.text });
      createComment({ variables: { text: finalComment || " ", id: id, reply: reply, photo: uploaded[0], room: post.room } });
      setState({ ...state, fileList: [] })
      form.resetFields()
      return;
    }


    setState({ ...state, uploaded: [], isFinishUpload: true, text: value.text })
    createComment({ variables: { text: finalComment, id: id, reply: reply, photo: '', room: post.room } });
    form.resetFields()
  };

  const muted = get(post, "muted") || [];
  const subscribe = get(post, "subscribe") || [];

  const isMuted = user && muted && muted.find((mute) => mute.owner === user.username);
  const isSubscribe = user && subscribe && subscribe.find((sub) => sub.owner === user.username);

  const userName = user && user.username;

  return error? (<NoPost />) : (
    <div>
      <Modal title="delete this post"
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          handleYes={() => {
            deletePost({ variables: { id: post.id, room: post.room } })
            setDeleteModal(false)
          }} />
      <AppBar title="Post" />
      {getPostLoading ? <Skeleton avatar paragraph={{ rows: 2 }} /> : (
        <List className="single_post_container" itemLayout="vertical" size="large" style={{ background: 'white', margin: 10, borderRadius: 5 }}>
          {post ? (
            <div >
              <List.Item
                key={post.id || ''}
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
                            type="detail_post"
                          />
                        </div>
                        <div className="action-post__item">
                          <Link to={`/post/${post.id}`}>
                            <CommentButton commentCount={post.commentCount} icon={<MessageOutlined />} />
                          </Link>
                        </div>
                        <div className="action-post__item">
                          <RepostButton idPost={post.id} room={post.room} repostCount={post.repostCount} />
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
                          <Col span={18}>
                            <img src={Pin} style={{ width: 20, position: "center" }} />
                            {address}
                            {userName === post.owner && (
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
                          <Col span={6} style={{ textAlign: "right" }}>
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
                                  {!post.room && post.owner !== userName && (<Menu.Item
                                    key="1"
                                    onClick={() =>
                                      mutePost({ variables: { postId: post.id, room: post.room } })
                                    }
                                  >
                                    {isMuted ? "Unmute" : "Mute"}
                                  </Menu.Item>)}
                                  {userName === post.owner ? (
                                    <Menu.Item
                                      key="4"
                                      onClick={() => setDeleteModal(true)}>
                                      <span>Delete Post</span>
                                    </Menu.Item>
                                  ) : null}
                                  {
                                    userName !== post.owner &&
                                    <Menu.Item key="3">Report</Menu.Item>
                                  }
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
                      <Photo photo={repost.media} />

                      <div style={{ marginTop: 5 }}>{repost.text}</div>
                    </Card>
                  )}
                  {post.text}
                  <Photo photo={post.media} />

                </Skeleton>
              </List.Item>
              {post && post.comments && post.comments.length === 0 ? (
                null) :
                <Comments post={post} loading={loading} user={user} setReply={setReply} form={form} />}
              <Form
                form={form}
                style={{ paddingBottom: -20, }}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinish}
              >

                {fileList.length > 0 && (
                  <div className="imagePreview_container">
                    <div style={{ height: 120, borderRadius: "30px 30px 0 0", backgroundColor: "white", padding: 10 }}>
                    
                      <Form.Item name="foto" style={{ marginBottom: 0 }} >
                        <div className="centeringButton" style={{ marginTop: -38 }}>
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
                      { UploadBar >=1 &&
                        <progress value={UploadBar} max="100"  style={{position: "relative", bottom: -50}}/>
                      }
                      
                    </div>
                    
                  </div>

                )}
                <div
                  className="sticky-input__container" // clas hanya aktif di mobile menggunakan media query
                >
                  <Form.Item name="upload" style={{ marginLeft: 5 }}>
                    <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      fileList={fileList}
                      accept="video/*, image/*"
                      onPreview={handlePreview}
                      onChange={handleChange}
                      showUploadList={false}
                    >
                      <Button
                        style={{ border: 'none' }}
                        disabled={fileList.length >= 1 ? true : false}
                        icon={<PlusOutlined style={{ color: "#7f57ff" }} />}
                      />
                    </Upload>
                  </Form.Item>

                  <Form.Item
                    name="comment"
                    rules={ fileList.length >=1 ? [
                      { required: false },
                    ] : [
                      { required: false , message: "Isi komennya dulu ya broooo!" },
                    ]}

                  >

                    <MentionsInput
                      maxLength={250}
                      singleLine
                      className="mentionInput"
                      value={text} onChange={e => console.log(e.target.value.match("/^(?=(@[[])$)/"))}>
                      <Mention
                        trigger="@"
                        data={mentionSuggest}
                        style={defaultMentionStyle}
                      />
                    </MentionsInput>

                  </Form.Item>
                  <Form.Item style={{ marginLeft: 10, }}>
                    <Button
                    disabled={loadingCreate || UploadBar >=1 }
                      htmlType="submit"
                      style={{
                        borderRadius: 20,
                        backgroundColor: "#7f57ff",
                        display: "inline-block",
                        color: "white"
                      }}
                    >
                      {loadingCreate || UploadBar >=1 ? <LoadingOutlined /> : 'Post'}

                    </Button>
                  </Form.Item>
                </div>

              </Form>
            </div>
          ) : (
            <div style={{ margin: 20 }}>
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          )}
        </List>
      )}

    </div>
  )
}
