// Modules
import React, { useState, useEffect, useContext } from "react";
import { useMutation, useLazyQuery } from '@apollo/client';
import { Modal, Button, Form, Input, Col, Upload, Card, Skeleton, Space, Collapse, Radio, Alert } from "antd";
import { DownOutlined } from '@ant-design/icons'
import { PlusOutlined, PictureOutlined } from '@ant-design/icons';
import moment from 'moment';
import { get } from 'lodash';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

// Styles
import "../../App.css";

//location
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

// Context
import { PostContext } from "../../context/posts";
import Pin from "../../assets/pin-svg-25px.svg";
import Gorila from "../../assets/gorila.jpg";
import Bmw from "../../assets/bmw.jpg";

// Query
import { GET_POST } from '../../GraphQL/Queries';
import { CREATE_POST } from '../../GraphQL/Mutations'

// Init Firebase
import firebase from 'firebase/app'
import 'firebase/storage'
import Photo from "../Photo";
import { useHistory } from "react-router";

const storage = firebase.storage()

const { Panel } = Collapse;

const InitialState = {
  previewVisible: false,
  confirmLoading: false,
  visible: false,
  previewImage: '',
  previewTitle: '',
  fileList: [],
  lat: '',
  lng: '',
  uploaded: [],
  isFinishUpload: false,
  text: ''
};

const skeletonStyle = {
  marginTop: 10,
  marginLeft: 3,
  width: window.isMobile ? '200px' : '400px',
  height: 10
 }

const UploadButton = () => (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

export default function ModalPost() {
  const pathname = useHistory().location.pathname
  // Context
  const {
    isOpenNewPost,
    repost = null,
    toggleOpenNewPost,
    createPost: updatePosts
  } = useContext(PostContext);

  // Local State
  const [state, setState] = useState(InitialState);
  const [disabled, setDisabled] = useState(false);
  const [noVideoFilter, setnoVideoFilter] = useState(false)
  const [limiter, setlimiter] = useState(false)
  const [address, setAddress] = useState("");
  const [addressRepost, setAddressRepost] = useState("");
  const [form] = Form.useForm();
  const [room, setRoom] = useState("Nearby")
  const [open, setOpen] = useState([])
  const [errors, setErrors] = useState({});
  const [UploadBar, setUploadBar] = useState(0)
  const handleCloseAddPost = () => {
    toggleOpenNewPost(false)
  }

  //changeroom func
  const handleCollapse = () => {
    if (open.length) {
      setOpen([])
    } else {
      setOpen([1])
    }
  }
  const handleRoom = (e) => {
    setRoom(e.target.value)
    setOpen([])

  }
  //set location

  const loc = localStorage.location;

  const location = loc ? JSON.parse(loc) : null;

  // Query
  const [getRepost, { data: dataRepost, loading }] = useLazyQuery(GET_POST);
  let getPost = get(dataRepost, 'getPost') || {};


  useEffect(() => {
    if (location) {
      setAddress(location.location);
    }
    if (getPost.location) {
      setAddressRepost(getPost.location.location)
    }
  }, [getPost, location])

  const [createPost, { loading: loadingCreatePost }] = useMutation(
    CREATE_POST,
    {
      onCompleted: (data) => {
        const { createPost } = data;
        // Reset Form
        setState(InitialState);
        form.resetFields();

        // Update Redux
        toggleOpenNewPost(false)
        setTimeout(() => {
          updatePosts({
            ...createPost,
            repost: repost && getPost
          }, pathname);
        }, 2500);
      }
    }
  )

  const { isFinishUpload, fileList,  uploaded } = state;

  useEffect(() => {
    if (repost) {
      getRepost({ variables: { id: repost.repost } });
    }
  }, [repost]);

  useEffect(() => {
    if (isOpenNewPost && !!uploaded.length || (state.text && !uploaded.length && isFinishUpload)) {
      const data = location
      const { text = '' } = state;
      const variables = {
        text,
        media: uploaded,
        location: {
          ...data
        },
        repost: repost.repost || '',
        roomRepost: repost.room || '',
        room: room === "Nearby" ? null : room
      };

      createPost({ variables });
    }
  }, [uploaded, isFinishUpload]);

  //////////////////// Upload Photo Function Start//////////////////////////////////

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }


  const handleCancelModal = () => {
    toggleOpenNewPost(false);
    console.log("repost", repost);
    console.log("sebelum", getPost)
    getPost = {}
    console.log("sesudah",getPost)
  };
  console.log("dari luar", getPost);

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setState({
      ...state,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  const handleChange = ({ fileList }) => {

    fileList.map(file => (
      file.size > 10000000 ? (Promise.reject(setErrors('File should less than 10mb'))) :
      (Promise.resolve())
      ))
    const newfile = fileList.map(file => ({ ...file, status: 'done' }))
    setState({
      ...state,
      fileList: newfile
    });
    let limit = fileList.map(file => file.type.split("/")[0])
    if (limit[0] === "image") setnoVideoFilter(true)
    else setnoVideoFilter(false)
    if (limit[0] === 'video') setlimiter(true)
    else setlimiter(false)
  }

  const handleRemove = file => {
    const newFile = fileList.filter(item => item !== file);
    setState({
      ...state,
      fileList: newFile
    })
  }
  const handleRemoveErr = () => {
    const newFile = fileList.filter(item => item.size < 10000000);
    setState({
      ...state,
      fileList: newFile
    })
    setlimiter(false)
    Promise.resolve(setErrors({}))
  }

  //////////////////// Upload Photo Function Finish/////////////////////////////////

  const onFinish = async (value) => {
    let uploaded = [];
    ////////////////fungsi upload///////////////////
    if (fileList.length) {
      uploaded = await Promise.all(fileList.map(async (elem) => {

        const fileName = elem.uid + "." + elem.type.split("/")[1]
        const uploadTask = storage.ref(`upload/${fileName}`).put(elem.originFileObj)
        
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

                  }).catch(err => reject(setErrors('Upload Failed, Check Your Connection')));
                
                 resolve(downloadUrl);

                 setUploadBar(0)
                 setnoVideoFilter(false)
            }
          )
        })
        return url
      }));
    setlimiter(false)
    Promise.resolve(setErrors({}))
      setState({ ...state, uploaded, fileList, isFinishUpload: true, text: value.text });

      return;
    }

    setlimiter(false)
    Promise.resolve(setErrors({}))
    setState({ ...state, uploaded: [], isFinishUpload: true, text: value.text })

    return;
  };
  
  return (
    <div>
      <Modal
        key="addPost"
        visible={isOpenNewPost}
        title={[
          <p key="paragraf">{repost ? 'Repost' : 'Post to'}</p>,
          <div>
            <Collapse ghost accordion activeKey={open} onChange={handleCollapse}>
              <Panel onChange={handleCollapse} header={
                <div>

                  <Radio.Button onClick={handleRoom} value="Nearby" style={{ border: 'none', color: 'black', backgroundColor: 'none', height: 30 }}>
                    <img src={Pin} alt="pin" style={{ display: 'inline-block', width: 40, marginTop: -20 }} />
                  </Radio.Button>
                  <div style={{ display: 'inline-block' }}>
                    <h3 style={{ fontWeight: "bold" }}>{room ? room : "Nearby"}</h3>
                    <Link to='/maps' onClick={handleCloseAddPost}><p style={{ fontSize: 12, marginTop: -10 }}>{address}</p></Link>
                  </div>
                  <DownOutlined style={{ float: 'right', width: 46, marginTop: 15 }} />
                </div>
              } key="1" showArrow={false}>
                {room !== "Nearby" && (
                  <Radio.Button onClick={handleRoom} value="Nearby" style={{ border: 'none', color: 'black', backgroundColor: 'none', width: '100%', height: 55 }}>Nearby</Radio.Button>
                )}

                <p>Available Room</p>
                <Radio.Button className='addpostRoom' onClick={handleRoom} value="Insvire E-Sport" style={{ border: 'none', color: 'black', backgroundColor: 'none', width: '100%', height: 55 }}>
                  <img src={Gorila} alt='gorila' style={{ display: 'inline-block', width: 40, marginTop: -21, marginBottom: "auto", borderRadius: '50%', marginRight: 5 }} />
                  <div style={{ display: 'inline-block' }}>
                    <h4 style={{ fontWeight: "bold" }}>Insvire E-Sport</h4>
                    <p style={{ fontSize: 12, marginTop: -15 }}>bermain dan besenang senang adalah jalan ninja kami</p>
                  </div>
                </Radio.Button>

                <Radio.Button className='addpostRoom' onClick={handleRoom} value="BMW Club Bandung" style={{ border: 'none', color: 'black', backgroundColor: 'none', width: '100%', height: 55 }}>
                  <img src={Bmw} alt="room Picture" style={{ display: 'inline-block', width: 40, marginTop: -21, marginBottom: "auto", borderRadius: '50%', marginRight: 5 }} />
                  <div style={{ display: 'inline-block' }}>
                    <h4 style={{ fontWeight: "bold" }}>BMW Club Bandung</h4>
                    <p style={{ fontSize: 12, marginTop: -15 }}>masuk clubnya walau belom punya mobilnya</p>
                  </div>
                </Radio.Button>
              </Panel>
            </Collapse>

          </div>


          ,
        ]}
        onCancel={handleCancelModal}
        footer={null}
      >
        {repost && (
          <>
            {loading  ?
              (
                <div style={{ marginBottom: 10 }}>
                  <Card bodyStyle={{ padding: '10px 12px' }} style={{ width: '100%', height: '100%', borderRadius: 10, backgroundColor: '#f5f5f5', borderColor: '#ededed', padding: 0, marginBottom: 12 }}>
                  <div style={{ display: 'flex' }}>
                    <p className="ic-location-small" style={{ margin: 0 }} />
                    <Skeleton.Button style={skeletonStyle} active size={"small"} />
                  </div>
                  <div style={{marginBottom: 7}}>
                  <Skeleton.Button style={skeletonStyle} active size={"small"} />
                  </div>
                  <Skeleton.Button style={skeletonStyle} active size={"small"} />

                  <Photo photo={getPost.media} />
                </Card>

                </div>
              )
              : (
                <Card bodyStyle={{ padding: '10px 12px' }} style={{ width: '100%', height: '100%', borderRadius: 10, backgroundColor: '#f5f5f5', borderColor: '#ededed', padding: 0, marginBottom: 12 }}>
                  <div style={{ display: 'flex' }}>
                    <p className="ic-location-small" style={{ margin: 0 }} />
                    <div style={{ fontWeight: 600, paddingLeft: 10 }}>{addressRepost}</div>
                  </div>
                  <span style={{ fontSize: 12 }}>{moment(getPost.createdAt).fromNow()}</span>
                  <div style={{ marginTop: 5 }}>{getPost.text}</div>

                  <Photo photo={getPost.media} />
                </Card>
              )}
          </>
        )}
        <Form form={form} name="nest-messages" onFinish={onFinish}>
          <Form.Item name="text"  >
            <Input.TextArea bordered={true} style={{ width: '100%' }} placeholder="What's your story" />
          </Form.Item>
          {fileList.length > 0 && (
            <Form.Item name="foto" style={{ marginBottom: 0 }} >
              <Upload

                onRemove={handleRemove}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                type="file"
                accept={noVideoFilter ? ".jpg, .jpeg, .png" : ".jpg, .jpeg, .png"}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 5 || limiter ? null : <UploadButton />}
              </Upload>
            </Form.Item>
          )}
          {/* ERROR HANDLE */}
          {Object.keys(errors).length > 0 && (
            <Alert
              message={errors}
              type="error"
              closable
              onClose={handleRemoveErr}
              style={{ marginBottom: 10 }}
            />
          )}
          {UploadBar >=1 && <progress  value={UploadBar} max="100" /> }
          
          <div style={{ position: 'relative', width: '100%' }}>
            {/* <Divider /> */}
            <hr style={{
              border: 'none',
              borderTop: '1px solid #d9d9d9',
              height: '0.2px'
            }} />
            <Col span={12}>
              <Form.Item name="foto" style={{ marginBottom: 0, cursor: 'pointer' }}>
                <Upload
                  disabled={limiter}
                  accept={noVideoFilter ? "image/*" : "video/*, image/*"}
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  fileList={fileList}
                  showUploadList={null}
                  onChange={handleChange}
                  onRemove={handleRemove}
                >
                  <PictureOutlined />
                </Upload>
              </Form.Item>
            </Col>

            
            <Button htmlType="submit"  disabled={Object.keys(errors).length > 0 || disabled || UploadBar} key="submit" type="primary" loading={loadingCreatePost || UploadBar >=1  }
              style={{ backgroundColor: 'var(--primary-color)', borderRadius: 20, position: "absolute", bottom: "3%", right: 0, height: 25, fontSize: 10, color: "white" }}>
              {UploadBar >=1 ? "Uploading..." : "Post"}
            </Button>
          </div>

        </Form>
        {/* <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> */}
      </Modal>

    </div>
  );
}
