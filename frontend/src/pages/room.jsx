import React, { useContext, useEffect, useRef } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_ROOM_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'

import { getSession } from '../util/Session';


function Room(props) {
    const room = props.match.path
    const _isMounted = useRef(false);
    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    const [ getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_ROOM_POSTS);
    
    useEffect(() => {
        if (room) {
            getPosts({ variables: { room } });
        }
    }, [room]);

    useEffect(() => {
        if (data  && !_isMounted.current) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }
            setPosts(data.getRoomPosts)

            _isMounted.current = true
            // set did mount react

            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            <NavBar />
            {user ? ( !posts ? null
                    : posts.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                        
                        return (
                            <div key={`posts${id} ${key}`}>
                                {!isMuted && <PostCard post={post} loading={loading} />}
                            </div>
                        )
                    })) : null}
        </div>
    );
}

export default Room