// Modules
import React, { useState, useEffect, useContext } from "react";
import { useMutation, useLazyQuery } from '@apollo/client';
import { Modal, Button, Form, Input, Col, Upload, Card, Skeleton, Space } from "antd";
import { PlusOutlined, PictureOutlined } from '@ant-design/icons';
import moment from 'moment';
import { get } from 'lodash';

// Styles
import "../../App.css";

// Context
import { PostContext } from "../../context/posts";

// Query
import { CREATE_POST, GET_POST } from '../../GraphQL/Queries';

// Init Firebase
import firebase from 'firebase/app'
import 'firebase/storage'
const  storage = firebase.storage()

const InitialState = {
  previewVisible: false,
  confirmLoading: false,
  visible: false,
  previewImage: '',
  previewTitle: '',
  fileList:[],
  lat: '',
  lng: '',
  uploaded:[],
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
    repost,
    toggleOpenNewPost,
    createPost: updatePosts
  } = useContext(PostContext);

  // Local State
  const [state, setState] = useState(InitialState);
  const [form] = Form.useForm();

  // Query
  const [getRepost, { data: dataRepost, loading }] = useLazyQuery(GET_POST);
  const getPost = get(dataRepost, 'getPost') || {};
  
  const [createPost] = useMutation(
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

  const { isFinishUpload, previewVisible, previewImage, fileList, previewTitle, lat, lng, uploaded} = state;

  ///////// location /////////
  function showPosition(position) {
    setState({
      ...state,
      lat: position.coords.latitude,
      lng: position.coords.longitude
    })
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(showPosition)
  }, []);

  useEffect(() => {
    if (repost) {
      getRepost({ variables: { id: repost }});
    }
  }, [repost]);

  useEffect(() => {
    if (isOpenNewPost && !!uploaded.length || (state.text && !uploaded.length && isFinishUpload)) {
      const { text= '' } = state;
      const variables = {
        text,
        media: uploaded,
        location: {
          lat,
          lng
        },
        repost
      };

      createPost( { variables });
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

  const handleCancel = () => setState({...state, previewVisible: false });

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
    const newFiles = fileList.map(file => ({ ...file, status: 'done'}))
    setState({
      ...state, 
      fileList: newFiles
    });
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

      return;
    }


    setState({ ...state, uploaded: [], isFinishUpload: true, text: value.text})
    
    return;
  };

  return (
    <div>
      <Modal
        key="addPost"
          visible={isOpenNewPost}
          title={[
            <p key="paragraf">{repost ? 'Repost' : 'Post to'}</p>,
            <div key="location" style={{ position: "absolute", marginTop: 15, marginLeft: 60, width: 150 }}>
              <h3 style={{ fontWeight: "bold" }}>Nearby</h3>
              <a style={{ fontSize: 12 }}>Wild Park, Melbourne</a>
            </div>,
            <div key="location2"style={{ width: 45 }}>
              <a href="/"><p className="location" style={{ marginTop: 10 }} /></a>
            </div>
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
                    <Skeleton.Avatar active={true} size={"large"}/>
                    <Skeleton.Button style={{ width: window.isMobile ? '200px' : '400px'}} size={"small"} />
                  </Space>
                  <Skeleton.Button style={{ width: window.isMobile ? '250px' : '450px', marginTop: 10}} size={"small"} />
                </div>
              )
             : (
              <Card bodyStyle={{ padding: '10px 12px' }} style={{ width: '100%', height: '100%', borderRadius: 10, backgroundColor: '#f5f5f5', borderColor: '#ededed', padding: 0, marginBottom: 12 }}>
                <div style={{ display: 'flex'}}>
                  <p className="ic-location-small" style={{ margin: 0}}/>
                  <div style={{ fontWeight: 600, paddingLeft: 10 }}>Jakarta, Indonesia</div>
                </div>
                <span style={{ fontSize: 12 }}>{moment(getPost.createdAt).fromNow()}</span>
                <div style={{ marginTop: 5 }}>{getPost.text}</div>
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
          <div style={{ position: 'relative', width: '100%'}}>
            {/* <Divider /> */}
            <hr style={{
              border: 'none',
              borderTop: '1px solid #d9d9d9',
              height: '0.2px'
            }} />
            <Col span={12}>
              <Form.Item name="foto" style={{marginBottom: 0}}> 
                <Upload
                accept="video/*, image/*"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                showUploadList={null}
                onChange={handleChange}
                >
                  <PictureOutlined />
                </Upload>
              </Form.Item>
              </Col>
            <Button htmlType="submit" key="submit" type="primary" 
              style={{ backgroundColor: '#7958f5', borderRadius: 20, position:"absolute",  bottom:"3%", right: 0, height:25, fontSize: 10}}>
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
