import React, { useContext, useEffect, useRef } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_ROOM_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import PostCard from '../components/PostCard/index'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'

import { getSession } from '../util/Session';


function Room(props) {
    const room = props.match.path
    const _isMounted = useRef(false);
    const { room_1, setRoom, room_2, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    const [ getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_ROOM_POSTS, {
        fetchPolicy: "network-only",
      });
    
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
            setRoom(data.getRoomPosts)

            if(room_1.length && room_2.length){
                _isMounted.current = true
            }
            // set did mount react

            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            <NavBar />
            {room === "/Insvire E-Sport" ? (user ? ( !room_1 ? null
                    : room_1.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                        
                        return (
                            <div key={`posts${id} ${key}`}>
                                {!isMuted && <PostCard post={post} loading={loading} />}
                            </div>
                        )
                    })) : null) : (user ? ( !room_2 ? null
                        : room_2.map((post, key) => {
                            const { muted, id } = post;
                            const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                            
                            return (
                                <div key={`posts${id} ${key}`}>
                                    {!isMuted && <PostCard post={post} loading={loading} />}
                                </div>
                            )
                        })) : null)}
        </div>
    );
}

export default Room