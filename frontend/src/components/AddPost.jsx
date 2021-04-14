import React, { useState, useContext } from 'react'
import { Modal, Button, Form, Input } from 'antd';
import '../App.css'
import UploadFile from './Upload'

import { useMutation } from '@apollo/client'
import { AuthContext } from '../context/auth'
import { CREATE_POST } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts';

function AddPost() {
    const [state, setState] = useState({})

    const showModal = () => {
        setState({
            visible: true,
            loading: false
        });
    };

    const handleOk = () => {
        setState({ loading: true, visible: true });
        setTimeout(() => {
            setState({ loading: false, visible: false });
        }, 1000);
    };

    const handleCancel = () => {
        setState({ visible: false });
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    const { user } = useContext(AuthContext)
    const postContext = useContext(PostContext)
    const [ createPost ] = useMutation(CREATE_POST, {
        update(_, { data : { createPost } }){
            postContext.createPost(createPost);
        }
    })

    const onFinish = (values) => {
        const text = values.text
        const lat = user.location.lat
        const lng = user.location.lng

        createPost({ variables: { text, lat, lng } })
    };

    const { visible, loading } = state;

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
                    <div style={{ position: "absolute", marginLeft: 60, width: 150 }}>
                        <h3 style={{ fontWeight: "bold", marginBottom: 1 }}>Nearby</h3>
                        <a style={{ fontSize: 12 }}>Wild Park, Melbourne</a>
                    </div>,
                    <div style={{ width: 45 }}>
                        <a href="/"><p className="location" style={{ marginTop: 10 }} /></a>
                    </div>
                ]}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <UploadFile />
                ]}
            >
                <Form name="nest-messages" onFinish={onFinish} validateMessages={validateMessages}>
                    <Form.Item name="text"  >
                        <Input.TextArea />
                    </Form.Item>
                    <Button htmlType="submit" key="submit" type="primary"
                        style={{ backgroundColor: '#7958f5', borderRadius: 20, position: "absolute", left: "83%", bottom: "3%", height: 25, fontSize: 10 }} loading={loading} onClick={handleOk}>
                        Post
                 </Button>
                </Form>
            </Modal>

        </div>
    );
}

export default AddPost;