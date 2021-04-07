import React, { useContext } from 'react'
import { HeartOutlined } from '@ant-design/icons'
import { Button } from 'antd';
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts';

export default function LikeButton({ likeCount, id }) {
    const {  } = useContext(PostContext)

    const [ likePost ] = useMutation(LIKE_POST, {
        update(_, { data : { createPost } }){
            PostContext.createPost(createPost);
        }
    })

    const onLike = () => {
        likePost({ variables: { id } })
    }

    return (
        <div className="ui labeled" tabIndex="0">
            <div style={{ marginLeft: 35, marginRight: 5 }}>
                <div className="ui basic label float"
                    style={{ height: 25, borderRadius: 5, top: -3, border: '1px black solid', marginLeft: -10, marginRight: -20, position: 'relative', backgroundColor: 'white' }}>
                    <p style={{ marginTop: -4, marginLeft: 5 }}>{likeCount} likes</p>
                </div>
            </div>

            <div style={{ position: 'absolute', marginTop: -32 }}>
                    <Button onClick={onLike} shape="circle" className="likeButton"  icon={<HeartOutlined />} />
            </div>
        </div>
    )
}
