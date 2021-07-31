import { Input, Form, Cascader, DatePicker, Upload } from "antd";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router";
import AppBar from "../../components/AppBar";
import { AuthContext } from "../../context/auth";
import './style.css'
import ImgCrop from "antd-img-crop";

// Init Firebase
import firebase from "firebase/app";
import "firebase/storage";
import { useMutation } from "@apollo/client";
import { CHANGE_PROFILE } from "../../GraphQL/Mutations";
import { useEffect } from "react";
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

  const [changeProfileUser] = useMutation(CHANGE_PROFILE, {
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
            setUserData({ url, isFinishUpload: true });
            // changeProfile(url);
          });
      }
    );
  };

  const handleChangesProfile = (value) => {
    const { username } = value
    const newData = {
      ...value,
      url: newUserData.url && newUserData.url,
      newUsername: username
    }

    changeProfileUser({ variables: newData })


  }

  return (
    <div >
      <AppBar title="Edit Profile" />
      <div className="edit-profile__container">
        <div className="form__container">
          <div className="PP__grid">
            <img src={newUserData.url ? newUserData.url : user.profilePicture} className="profile-picture" />
            <div className="right-content">
              <ImgCrop rotate>
                <Upload onChange={handleChange} showUploadList={false}>
                  <p className="text-color">Update My Avatar</p>
                </Upload>
              </ImgCrop>
            </div>

          </div>

          <Form name="basic" initialValues={{ remember: true }} onFinish={handleChangesProfile}>
            <Form.Item
              name="phoneNumber"
              className="edit-profile__textfield"
            >
              <Input placeholder="Phone Number" defaultValue={user.mobileNumber} />
            </Form.Item>

            <Form.Item
              name="username"
              className="edit-profile__textfield"
            >
              <Input
                placeholder="Username" defaultValue={user.username} />
            </Form.Item>

            <Form.Item name="gender"
              className="edit-profile__textfield">
              <Cascader style={{ backgroundColor: '#FAFAFF', width: "100%" }} options={gender} />
            </Form.Item>

            <Form.Item name="birthday"
              className="edit-profile__textfield">
              <DatePicker placeholder="birthday" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
              <button className="ui  facebook button body-page__btn-send" type="submit"
                style={{ fontSize: '18px', padding: 0, width: "100%" }}>
                Update Profile
              </button>
            </Form.Item>

          </Form>

        </div>


      </div>
    </div>
  )
}