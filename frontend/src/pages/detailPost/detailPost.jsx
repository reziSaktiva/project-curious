//GQL
import moment from "moment";
import Geocode from "react-geocode";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_COMMENT } from "../../GraphQL/Mutations";
import React, { useContext, useEffect, useRef, useState } from "react";
import Comments from './comments'
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { get } from "lodash";

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
  Image
} from "antd";

//component
import Pin from "../../assets/pin-svg-25px.svg";
import LikeButton from "../../components/Buttons/LikeButton/index";
import CommentButton from "../../components/Buttons/CommentButton/index";
import RepostButton from "../../components/Buttons/RepostButton/index";
import { EllipsisOutlined, PlusOutlined,  LoadingOutlined } from "@ant-design/icons";
import PostNavBar from "../../components/PostNavBar";

// Query
import { GET_POST } from "../../GraphQL/Queries";
import { PostContext } from "../../context/posts";

// Init Firebase
import firebase from 'firebase/app'
import 'firebase/storage'
import { AuthContext } from "../../context/auth";
import { MAP_API_KEY } from "../../util/ConfigMap";
const  storage = firebase.storage()

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
  const _isMounted = useRef(false)
  const { post, setPost, loading, loadingData, setComment } = useContext(PostContext);
  const { user } = useContext(AuthContext)
  const [address, setAddress] = useState("");
  const [repostAddress, setRepostAddress] = useState("");
  const [reply, setReply] = useState({username: null, id: null});
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


  const [createComment, {loading : loadingCreate}] = useMutation(CREATE_COMMENT, {
    onError(err) {
      console.log(err.message);
    },update(_, { data: { createComment: commentData } }){
      // const idReply = commentData.reply.id

      // if (idReply) {

      // }

      setComment(commentData)
  },
  });

  const onFinish = async value => {
    const { comment } = value;
    const newComment = comment ? comment.substring(comment.indexOf(':')+1) : ''
    const finalComment = newComment == undefined ? comment : newComment
    
    const isReply = form.getFieldValue(["comment"]).includes(reply.username && reply.id)

    if(!isReply){
      setReply({username: null, id: null})
    }
    let uploaded = [];
    ////////////////fungsi upload///////////////////
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
      createComment({ variables: { text: finalComment, id: id, reply: reply, photo: uploaded[0], room: post.room } });
      setState({...state, fileList: []})
      form.resetFields()
      return;
    }


    setState({ ...state, uploaded: [], isFinishUpload: true, text: value.text})
    createComment({ variables: { text: finalComment, id: id, reply: reply, photo: '' , room: post.room } });
    form.resetFields()
  };



  return (
    <div>
    <PostNavBar />
    <List itemLayout="vertical" size="large" style={{ background: 'white', margin: 10, borderRadius: 5}}>
     {post ? (
       <div>
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

                  <CommentButton commentCount={post.commentCount} />

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
              background: "white",
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
          {/* mediaaaaaaaaaaaaaa */}

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
                      rowSpan="2"
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

          {/* mediaaaaaaaaaaaa end */}
        </Skeleton>
      </List.Item>
      {post && post.comments && post.comments.length == 0 ? (null) : <Comments post={post} loading={loading} user={user} setReply={setReply} form={form} />}
      <Form
       form={form}
        style={{ marginTop: 21, paddingBottom: -20 }}
        name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinish}
      >
        
        {fileList.length > 0 && (
          <div style={{backgroundColor: "white"}}>
          <div style={{height:120, borderTopRightRadius: 30, borderTopLeftRadius: 30, backgroundColor: "white", padding: 10}}>
            <Form.Item name="foto" style={{ marginBottom: 0 }} >
              <div className="centeringButton" style={{ marginTop: -38}}>
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
            <Form.Item name="upload" className="centeringButton" style={{marginTop: -6}} >
              <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              fileList={fileList}
              accept="video/*, image/*"
              onPreview={handlePreview}
              onChange={handleChange}
              showUploadList={false}
              >
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
            <Form.Item className="centeringButton" style={{ marginTop: -6}}>
              <Button
                htmlType="submit"
                style={{
                  borderRadius: 20,
                  backgroundColor: "#7f57ff",
                  display: "inline-block",
                  color: "white",
                }}
              >
                {loadingCreate ? <LoadingOutlined />: 'Post'}
                
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
    </div>
  )
  
}
