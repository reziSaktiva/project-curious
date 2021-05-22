import React, { useContext, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/client'
import { GET_SUBSCRIBED_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'


function SubscribePosts() {
    const { data } = useQuery(GET_SUBSCRIBED_POSTS);

    const _isMounted = useRef(false);
    const { subscribePosts, setSubscribePosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (!_isMounted.current && data) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }

            setSubscribePosts(data.getSubscribePosts)
            
            // set did mount react
            _isMounted.current = true;

            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            <NavBar />
            {user ? (<div>
                {!subscribePosts ? null
                    : subscribePosts.map((post, key) => post === null ? (null) : (
                        <div key={`posts${post.id} ${key}`}>
                            {console.log(post)}
                        <PostCard post={post} loading={loading} />
                    </div>
                ))}
            </div>) : null}
        </div>
    );
}

export default SubscribePosts