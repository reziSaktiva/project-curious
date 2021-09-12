import { Input, Form, Cascader, DatePicker, Upload, Skeleton } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import AppBar from "../../components/AppBar";
import { AuthContext } from "../../context/auth";
import './style.css'
import ImgCrop from "antd-img-crop";
import { LoadingOutlined } from "@ant-design/icons";
// Init Firebase
import firebase from "firebase/app";
import "firebase/storage";
import { useMutation } from "@apollo/client";
import { CHANGE_PROFILE } from "../../GraphQL/Mutations";
import SkeletonButton from "antd/lib/skeleton/Button";
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

export default function EditProfile() {
  const history = useHistory()

  const [changeProfileUser, { loading } ] = useMutation(CHANGE_PROFILE, {
    update(_, { data: { changeProfileUser } }) {
      changeProfile(changeProfileUser)
      history.push('/')
    },
    onError(err) {
      console.log(err.message)
    }
  });
  const { user, changeProfile } = useContext(AuthContext);
  const [newUserData, setUserData] = useState({});
  const [LoadingProfilePicture, setLoadingProfilePicture] = useState(false)

  const handleChange = (value) => {
    let obj = value.file.originFileObj
    console.log(obj.uid);
    const uploadTask = storage
      .ref(`profilePicture/${obj.uid }`)
      .put(value.file.originFileObj);
    uploadTask.on(
      "state_changed",
      () => { },
      (error) => {
        console.log(error);
      },
      async () => {
        storage
          .ref("profilePicture")
          .child(obj.uid )
          .getDownloadURL()
          .then((url) => {
            let resizeURl = url.split("?")[0] + "_1920x1080?" +url.split("?")[1]
            setLoadingProfilePicture(true)
            setTimeout(() => {
              setUserData({ url : resizeURl, isFinishUpload: true });
              changeProfile(resizeURl);
              setLoadingProfilePicture(false)  
            }, 2500);
            
          });
      }
    );
  };


  const handleChangesProfile = (value) => {
    const { username } = value

    let newUserName = username === undefined ? user.username : username
    const newData = {
      ...value,
      url: newUserData.url && newUserData.url,
      newUsername: newUserName
    }
    console.log("newData", newData);
    changeProfileUser({ variables: newData })


  }

  return (
    <div >
      <AppBar title="Edit Profile" />
      <div className="edit-profile__container">
        <div className="form__container">
          <div className="PP__grid">
            {LoadingProfilePicture ? (
              <Skeleton.Avatar active   size={80} style={{marginBottom: 16}} />
            ) : (
              <img src={newUserData.url ? newUserData.url : user.profilePicture} className="profile-picture" />
            )}
            <div className="right-content">
              <ImgCrop rotate>
                <Upload onChange={handleChange} showUploadList={false}>
                  <p className="text-color">Update My Avatar</p>
                </Upload>
              </ImgCrop>
            </div>

          </div>

          <Form
           name="basic"
            initialValues={{ remember: true }} onFinish={handleChangesProfile}>
            <Form.Item
              name="phoneNumber"
              className="edit-profile__textfield"
            >
              <Input placeholder="Phone Number" defaultValue={user.mobileNumber} />
            </Form.Item>

            <Form.Item
            
            rules={[
              {
                  required: false,
                  message: 'Please Enter Your Username',
              }
              ,
              {
                validator(_, value) {
                const regexlength = /^(?=.{5,20}$)/ 
                if(value === undefined ) return Promise.resolve();
                else {
                  if ( !undefined && !(value.match(regexlength)) )  return Promise.reject('Username should have 5-20 caracter');
                  const regex = /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$/
                  if ( !undefined && !(value.match(regex)) )  return Promise.reject('Username cannot use "space" or any special character unless _ and .');
                  else return Promise.resolve();
                }
                
                }
            }
          ]}
              name="username"
              className="edit-profile__textfield"
            >
              <Input
                placeholder="Username" defaultValue={user.newUsername ? user.newUsername : user.username } />
            </Form.Item>

            <Form.Item name="gender"
              className="edit-profile__textfield">
              <Cascader style={{ backgroundColor: '#FAFAFF', width: "100%" }} placeholder={user.gender}  options={gender} />
            </Form.Item>

            <Form.Item name="birthday"
              className="edit-profile__textfield">
              <DatePicker placeholder="birthday" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
              <button className="ui  facebook button body-page__btn-send" type="submit" 
              style={{ fontSize: '18px',padding: 0, width:"100%" }}>
                {loading ? (<LoadingOutlined />): ("Update Profile")} 
              </button>
            </Form.Item>

          </Form>

        </div>


      </div>
    </div>
  )
}