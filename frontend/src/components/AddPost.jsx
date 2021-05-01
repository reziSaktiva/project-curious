import React, { useState, useContext, useEffect } from "react";
import { Modal, Button, Form, Input, Row, Col, Upload } from "antd";
import { PlusOutlined, PictureOutlined } from '@ant-design/icons';
import { useMutation, gql } from '@apollo/client';
import "../App.css";
import UploadFile from "./Upload";
import { get } from 'lodash'

import { PostContext } from "../context/posts";

import firebase from 'firebase/app'
import 'firebase/storage'

const  storage = firebase.storage()

/////////GQL START////////////

const CREATE_POST = gql`
mutation createPost(
  $text: String
  $media: [String]
  $location: Location!
) {
  createPost(
  text: $text
  media: $media
  location: $location
){
  id
  owner
  text
  media
  createdAt
  location{
    lat
    lng
  }
  commentCount
  likeCount
  likes{
    id
  }
  comments {
    id
    createdAt
    owner
    text
    displayName
    photoProfile
    colorCode
  }

}
}
`
/////////GQL FINISH///////////


export default function ModalPost() {

  const [createPost, { error, data, loading}] = useMutation(
    CREATE_POST,
    {
      onCompleted: () => {
        setState({ ...state, visible: false, isFinishUpload: false })
      }
    }
  )

  const [state, setState] = useState({
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
  })
  
  const { isFinishUpload, visible, previewVisible, previewImage, fileList, previewTitle, lat, lng, uploaded} = state;

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
    console.log('state upload text: ', state.text && !uploaded.length && isFinishUpload);
    console.log('state upload image: ', !!uploaded.length, ' ', typeof(uploaded));
    if (!!uploaded.length || (state.text && !uploaded.length && isFinishUpload)) {
      const { text= '' } = state;
      const variables = {
        text,
        media: uploaded,
        location: {
          lat,
          lng
        }
      };

       console.log('payload: ', variables);
      createPost( { variables });
    }
  }, [uploaded, isFinishUpload])

  //////////////////// Upload Photo Function Start//////////////////////////////////

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const handleOk = () => {
    setState({ loading: true, visible: true });
    setTimeout(() => {
      setState({ loading: false, visible: false });
    }, 1000);
    onFinish()
  };

  const handleCancel = () => setState({...state, previewVisible: false });

  const handleCancelModal = () => {
    setState({
      ...state,
      visible: false
    });
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

  const handleChange = ({ fileList }) => setState({
    ...state, 
    fileList 
  });


  //////////////////// Upload Photo Function Finish/////////////////////////////////

  const showModal = () => {
    setState({
      ...state,
      visible: true,
      loading: false
    });
  };

  const onFinish = async (value) => {
    console.log('file list: ', fileList);
    let uploaded = [];
    ////////////////fungsi upload///////////////////
    if (fileList.length) {
      uploaded = await Promise.all(fileList.map(async (elem) => {
        // console.log(elem)
        const uploadTask = storage.ref(`images/${elem.originFileObj.name}`).put(elem.originFileObj)
  
        const url = await new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            () => {},
            error => reject(error),
            async () => {
              const downloadUrl = await uploadTask.snapshot.ref.getDownloadURL();
  
              resolve(downloadUrl);
            }
          )
        })
  
        return url
      }));

      console.log('set image')
      setState({ ...state, uploaded, isFinishUpload: true, text: value.text });

      return;
    }

    console.log('set text')

    setState({ ...state, uploaded: [], isFinishUpload: true, text: value.text})
    
    return;
  };

  console.log('visible: ', visible);
  return (
    <div>
      
      <div className="ui circular outlined icon button fixed"
        style={{ position: 'fixed', backgroundColor: '#7958F5', borderRadius: '100%', right: '16%', bottom: '10%' }}
        onClick={showModal}>
        <i className="plus icon" style={{ color: 'white' }}></i>
      </div>
      <Modal
          visible={visible}
          title={[
            <p>Post to</p>,
            <div style={{ position: "absolute", marginTop: 15, marginLeft: 60, width: 150 }}>
              <h3 style={{ fontWeight: "bold" }}>Nearby</h3>
              <a style={{ fontSize: 12 }}>Wild Park, Melbourne</a>
            </div>,
            <div style={{ width: 45 }}>
              <a href="/"><p className="location" style={{ marginTop: 10 }} /></a>
            </div>
          ]}
          onCancel={handleCancelModal}
          footer={null}
        >
        <Form  name="nest-messages" onFinish={onFinish}>
          <Form.Item name="text"  >
            <Input.TextArea />
          </Form.Item>
          <Row>
          {fileList.length == 0 ? (
            <Col span={12}>
              <Form.Item name="foto" style={{marginBottom: 0}}> 
            <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            showUploadList={null}
            onChange={handleChange}
            >
              <PictureOutlined />
            </Upload>
          </Form.Item>
            </Col>
          ) : (

        <Form.Item name="foto" > 
            <Upload
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      listType="picture-card"
                      fileList={fileList}
                      onPreview={handlePreview}
                      onChange={handleChange}
                    >
                      {fileList.length >= 5 ? null : uploadButton}
                    </Upload>
          </Form.Item>
          )}
          <Col span={12}>
            <div style={{float: "right"}}>
            <Button htmlType="submit" key="submit" type="primary" 
                      style={{ backgroundColor: '#7958f5', borderRadius: 20, position:"absolute",  bottom:"3%", left: "70%", height:25, fontSize: 10}}>
                          Postnya
                      </Button>
            </div>
          </Col>
          </Row>
          
         
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
