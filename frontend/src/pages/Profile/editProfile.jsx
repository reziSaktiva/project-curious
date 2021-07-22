import { Input, Form, Cascader, DatePicker, Upload } from "antd";

import React, { useContext, useEffect, useState } from "react";
import AppBar from "../../components/AppBar";
import { AuthContext } from "../../context/auth";
import './style.css'
import ImgCrop from "antd-img-crop";

// Init Firebase
import firebase from "firebase/app";
import "firebase/storage";
import { useMutation } from "@apollo/client";
import { CHANGE_PP } from "../../GraphQL/Mutations";
const storage = firebase.storage();

const gender = [
    {
        value: 'male',
        label: 'male',
    },
    {
        value: 'female',
        label: 'female',
    },
    {
        value: 'other',
        label: 'other',
    },
];

const InitialState = {
    url: "",
    isFinishUpload: false,
  };

export default function EditProfile() {
    const [changePPuser, { data }] = useMutation(CHANGE_PP);
    const { user, changeProfilePicture } = useContext(AuthContext);
    const [profilePicture, setProfilePicture] = useState(InitialState);
    const { isFinishUpload, url } = profilePicture;
   
    const handleChange = (value) => {
        const uploadTask = storage
          .ref(`proflePicture/${value.file.originFileObj.name}`)
          .put(value.file.originFileObj);
        uploadTask.on(
          "state_changed",
          () => { },
          (error) => {
            console.log(error);
          },
          async () => {
            storage
              .ref("proflePicture")
              .child(value.file.originFileObj.name)
              .getDownloadURL()
              .then((url) => {
                setProfilePicture({ url, isFinishUpload: true });
                changeProfilePicture(url);
              });
          }
        );
      };
    
      useEffect(() => {
        if (isFinishUpload) {
          changePPuser({ variables: { url } });
        }
      }, [url, isFinishUpload]);

    return (
        <div >
        <AppBar title="Edit Profile" />
        <div className="edit-profile__container">
            <div className="form__container">
                <div className="PP__grid">
                    <img src={user.profilePicture} className="profile-picture"/>
                    <div className="right-content">
                        <ImgCrop rotate>
                        <Upload onChange={handleChange} showUploadList={false}>
                            <p className="text-color">Update My Avatar</p>
                        </Upload>
                        </ImgCrop>
                    </div>
                    
                </div>

            <Form name="basic" initialValues={{remember: true}}>
            <Form.Item
              name="phone number"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number',
                },
              ]}

              className="edit-profile__textfield"
            >
              <Input placeholder="Email / Username" defaultValue={user.mobileNumber} />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your phone number',
                },
              ]}
              className="edit-profile__textfield"
            >
              <Input 
             placeholder="Username" defaultValue={user.username} />
            </Form.Item>

            <Form.Item name="gender"
            className="edit-profile__textfield"
                rules={[{
                type: 'array',
                required: true,
                message: 'Please select your gender!',
                },]}>
                <Cascader style={{backgroundColor: '#FAFAFF', width: "100%"}} options={gender} />
            </Form.Item>

            <Form.Item name="birthday"
            className="edit-profile__textfield"
                rules={[{
                        required: true,
                        message: 'Please input your birthday!'
                    }]}>
                <DatePicker placeholder="birthday" style={{width:"100%"}}  />
            </Form.Item>

            <Form.Item>
              <button className="ui  facebook button body-page__btn-send" type="submit" 
              style={{ fontSize: '18px',padding: 0, width:"100%" }}>
                Update Profile
              </button>
            </Form.Item>

          </Form>

            </div>
        

        </div>
        </div>
    )
}