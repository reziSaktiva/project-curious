import React, { useState, useEffect } from 'react'
import { List } from 'antd';
import moment from 'moment'
import Geocode from 'react-geocode'

import marker from '../assets/marker.png'
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import RepostButton from './RepostButton';

Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k")

Geocode.setLanguage("id");

export default function PostCard({ post, loading }) {
    const [address, setAddress] = useState('')

    useEffect(() => {
        if (post.location) {
            Geocode.fromLatLng(post.location.lat, post.location.lng).then(
                response => {
                    const address = response.results[0].address_components[1].short_name;
                    setAddress(address);
                },
                error => {
                    console.error(error)
                }
            );
        }
    }, [post])

    return (
        <List
            itemLayout="vertical"
            size="large" >
            <List.Item
                key={post.id}
                actions={
                    !loading && [
                        <LikeButton likeCount={ post.likeCount } likes={post.likes} id={ post.id } />,
                        <CommentButton commentCount={ post.commentCount } />,
                        <RepostButton />
                    ]
                }
            >
                <List.Item.Meta
                    title={<a href={`/post/${post.id}`}><img src="https://firebasestorage.googleapis.com/v0/b/insvire-curious-app12.appspot.com/o/mapRadius%2Fpin-figma.png?alt=media&token=3d842f6c-3338-486c-8605-4940e05b96b6" style={{ width: 15 }} /> {address}</a>}
                    description={<div style={{ marginTop: -9 }}>{moment(post.createdAt).fromNow()}</div>}
                />
                {post.text}<br />
            </List.Item>
        </List>
    )
}
