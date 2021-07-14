// Modules
import React, { useState, useEffect, useContext } from "react";
import { useMutation, useLazyQuery } from '@apollo/client';
import { Modal, Button, Form, Input, Col, Upload, Card, Skeleton, Space, Collapse, Radio, Image } from "antd";
import { DownOutlined } from '@ant-design/icons'
import { PlusOutlined, PictureOutlined } from '@ant-design/icons';
import moment from 'moment';
import { get } from 'lodash';
import { Link } from "react-router-dom/cjs/react-router-dom.min";

// Styles
import "../../App.css";

//location
import Geocode from "react-geocode";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

// Context
import { PostContext } from "../../context/posts";
import Pin from "../../assets/pin-svg-25px.svg";
import Gorila from "../../assets/gorila.jpg";
import Bmw from "../../assets/bmw.jpg";

// Query
import { CREATE_POST, GET_POST } from '../../GraphQL/Queries';

// Init Firebase
import firebase from 'firebase/app'
import 'firebase/storage'
import { AuthContext } from "../../context/auth";
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

const UploadButton = () => (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

export default function ModalPost() {
  // Context
  const {
    isOpenNewPost,
    repost = null,
    toggleOpenNewPost,
    createPost: updatePosts
  } = useContext(PostContext);

  // Local State
  const [state, setState] = useState(InitialState);
  const [address, setAddress] = useState("");
  const [addressRepost, setAddressRepost] = useState("");
  const [form] = Form.useForm();
  const { room, setRoom } = useContext(AuthContext)
  const [open, setOpen] = useState([])

  //changeroom func
  const handleCollapse = () => {
    if (open.length) {
      setOpen([])
    } else {
      setOpen([1])
    }
  }
  const handleRoom = (e) => {
    setRoom('Nearby')
    setOpen([])

  }
  //set location

  const loc = localStorage.location;

  const location = loc ? JSON.parse(loc) : null;

  if (location) {
    Geocode.fromLatLng(location.lat, location.lng).then(
      (response) => {
        const address = response.results[0].address_components[1].short_name;
        setAddress(address);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  


  // Query
  const [getRepost, { data: dataRepost, loading }] = useLazyQuery(GET_POST);
  const getPost = get(dataRepost, 'getPost') || {};


  if (getPost.location) {
    Geocode.fromLatLng(getPost.location.lat, getPost.location.lng).then(
      (response) => {
        const address = response.results[0].address_components[1].short_name;
        setAddressRepost(address);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  const [createPost, { loading : loadingCreatePost }] = useMutation(
    CREATE_POST,
    {
      onCompleted: (data) => {
        const { createPost } = data;

        // Reset Form
        setState(InitialState);
        form.resetFields();

        // Update Redux
        toggleOpenNewPost(false)
        updatePosts({
          ...createPost,
          repost: getPost
        });
      }
    }
  )

  const { isFinishUpload, previewVisible, previewImage, fileList, previewTitle, lat, lng, uploaded } = state;

  ///////// location /////////
  function showPosition(position) {
    setState({
      ...state,
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }

  useEffect(() => {
    if (isOpenNewPost) navigator.geolocation.getCurrentPosition(showPosition)
  }, [isOpenNewPost]);

  useEffect(() => {
    if (repost) {
      getRepost({ variables: { id: repost.repost } });
    }
  }, [repost]);

  useEffect(() => {
    if (isOpenNewPost && !!uploaded.length || (state.text && !uploaded.length && isFinishUpload)) {
      const { text = '' } = state;
      const variables = {
        text,
        media: uploaded,
        location: {
          lat,
          lng
        },
        repost: repost.repost || '',
        roomRepost: repost.room || '',
        room
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

  const handleCancel = () => setState({ ...state, previewVisible: false });

  const handleCancelModal = () => {
    toggleOpenNewPost(false);
  };

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
    const newFiles = fileList.map(file => ({ ...file, status: 'done' }))
    setState({
      ...state,
      fileList: newFiles
    });

    
  }
  const handleRemove = file => {
    const newFile = fileList.filter(item => item !== file);
    setState({
      ...state,
      fileList: newFile
    })

  }

  //////////////////// Upload Photo Function Finish/////////////////////////////////

  const onFinish = async (value) => {
    let uploaded = [];
    ////////////////fungsi upload///////////////////
    if (fileList.length) {
      uploaded = await Promise.all(fileList.map(async (elem) => {
        const uploadTask = storage.ref(`images/${elem.originFileObj.name}`).put(elem.originFileObj)

        const url = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            () => { },
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

      return;
    }


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
                  <Radio.Button onClick={handleRoom} value="Nearby" style={{ border: 'none', color: 'black', backgroundColor: 'none', height: 50   }}>
                    <img src={Pin} alt="pin" style={{ display: 'inline-block', width: 40,  }} />
                  </Radio.Button>
                  <div style={{ display: 'inline-block' }}>
                    <h3 style={{ fontWeight: "bold" }}>{room ? room : "Nearby"}</h3>
                    <Link to='/maps'><p style={{ fontSize: 12, marginTop: -10 }}>{address}</p></Link>
                  </div>
                  <DownOutlined style={{ float: 'right', width: 46, marginTop: 15 }} />
                </div>
              } key="1" showArrow={false}>
                <p onClick={handleRoom}>Nearby</p>
                <p>Available Room</p>
                <Radio.Button className='addpostRoom' onClick={handleRoom} value="Insvire E-Sport" style={{ border: 'none', color: 'black', backgroundColor: 'none', width: '100%', height: 55 }}>
                  <img src={Gorila} alt='gorila' style={{ display: 'inline-block', width: 40, marginTop: -21, marginBottom: "auto", borderRadius: '50%', marginRight: 5 }} />
                  <div style={{ display: 'inline-block' }}>
                    <h4 style={{ fontWeight: "bold" }}>Insvire E-Sport</h4>
                    <p style={{ fontSize: 12, marginTop: -15 }}>bermain dan besenang senang adalah jalan ninja kami</p>
                  </div>
                </Radio.Button>

                <Radio.Button className='addpostRoom' onClick={handleRoom} value="BMW Club Bandung" style={{ border: 'none', color: 'black', backgroundColor: 'none', width: '100%', height: 55 }}>
                  <img src={Bmw} style={{ display: 'inline-block', width: 40, marginTop: -21, marginBottom: "auto", borderRadius: '50%', marginRight: 5 }} />
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
        {!!repost && (
          <>
            {loading ?
              (
                <div style={{ marginBottom: 10 }}>
                  <Space>
                    <Skeleton.Avatar active={true} size={"large"} />
                    <Skeleton.Button style={{ width: window.isMobile ? '200px' : '400px' }} size={"small"} />
                  </Space>
                  <Skeleton.Button style={{ width: window.isMobile ? '250px' : '450px', marginTop: 10 }} size={"small"} />
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
                  
                  {getPost.media ? (
          getPost.media.length == 1 ? (
            <Image
              style={{
                width: "100%",
                borderRadius: 10,
                objectFit: "cover",
                maxHeight: 300,
              }}
              src={getPost.media}
            />
          ) : null
        ) : null}

        {getPost.media ? (
          getPost.media.length == 2 ? (
            <table className="row-card-2">
              <tbody>
                <tr>
                  <Image.PreviewGroup>
                    <td style={{ width: "50%" }}>
                      <Image
                        style={{ borderRadius: "10px 0px 0px 10px" }}
                        src={getPost.media[0]}
                      />
                    </td>
                    <td>
                      <Image
                        style={{ borderRadius: "0px 10px 10px 0px" }}
                        src={getPost.media[1]}
                      />
                    </td>
                  </Image.PreviewGroup>
                </tr>
              </tbody>
            </table>
          ) : null
        ) : null}

        {getPost.media ? (
          getPost.media.length >= 3 ? (
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
                        src={getPost.media[0]}
                      />
                    </td>
                    <td style={{ width: "50%" }}>
                      <Image
                        className="pict2-3"
                        style={{ borderRadius: "0px 10px 0px 0px" }}
                        src={getPost.media[1]}
                      />
                      <div
                        className="text-container"
                        style={{ marginTop: "-6px" }}
                      >
                        <Image
                          className="pict3-3"
                          style={
                            getPost.media.length > 3
                              ? {
                                  borderRadius: "0px 0px 10px 0px",
                                  filter: "blur(2px)",
                                }
                              : { borderRadius: "0px 0px 10px 0px" }
                          }
                          src={getPost.media[2]}
                        />
                        <div className="text-center">
                          {getPost.media.length > 3
                            ? "+" + (getPost.media.length - 3)
                            : null}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {getPost.media.length > 3 ? (
                    <div>
                      <Image
                        className="pict3-3"
                        style={{ display: "none" }}
                        src={getPost.media[3]}
                      />
                      {getPost.media.length > 4 ? (
                        <Image
                          className="pict3-3"
                          style={{ display: "none" }}
                          src={getPost.media[4]}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </tbody>
              </Image.PreviewGroup>
            </table>
          ) : null
        ) : null}

                  
                </Card>
              )}
          </>
        )}
        <Form form={form} name="nest-messages" onFinish={onFinish}>
          <Form.Item name="text"  >
            <Input.TextArea bordered={false} placeholder="What's your story" />
          </Form.Item>
          {fileList.length > 0 && (
            <Form.Item name="foto" style={{ marginBottom: 0 }} >
              <Upload
                onRemove={handleRemove}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                accept="video/*, image/*"
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 5 ? null : <UploadButton />}
              </Upload>
            </Form.Item>
          )}
          
          <div style={{ position: 'relative', width: '100%' }}>
            {/* <Divider /> */}
            <hr style={{
              border: 'none',
              borderTop: '1px solid #d9d9d9',
              height: '0.2px'
            }} />
            <Col span={12}>
              <Form.Item name="foto" style={{ marginBottom: 0 }}>
                <Upload
                  accept="video/*, image/*"
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
            <Button htmlType="submit" key="submit" type="primary" loading={loadingCreatePost}
              style={{ backgroundColor: '#7958f5', borderRadius: 20, position: "absolute", bottom: "3%", right: 0, height: 25, fontSize: 10 }}>
              Post
            </Button>
          </div>

        </Form>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </Modal>

    </div>
  );
}
