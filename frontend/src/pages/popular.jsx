import React, { useContext, useEffect, useRef } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_POPULAR_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'

import { getSession } from '../util/Session';


function Popular() {
    const _isMounted = useRef(false);
    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    const { location } = getSession();
    const [ getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_POPULAR_POSTS);
    
    useEffect(() => {
        if (Object.keys(location).length) {
            const loc = JSON.parse(location);

            getPosts({ variables: loc });
        }
    }, [location]);

    useEffect(() => {
        if (!_isMounted.current && data) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }
            console.log(data.getPopularPosts);
            setPosts(data.getPopularPosts)
            
            // set did mount react
            _isMounted.current = true;

            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            <NavBar />
            {user ? (<InfiniteScroll isLoading={loadingPosts}>
                {!posts ? null
                    : posts.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                        
                        return (
                            <div key={`posts${id} ${key}`}>
                                {!isMuted && <PostCard post={post} loading={loading} />}
                            </div>
                        )
                    })}
            </InfiniteScroll>) : null}
        </div>
    );
}

export default Popular