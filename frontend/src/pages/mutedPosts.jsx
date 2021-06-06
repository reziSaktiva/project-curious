import React, { useContext, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/client'
import { GET_MUTED_POSTS, GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard/index'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'


function MutedPost() {
    const { data } = useQuery(GET_MUTED_POSTS);

    const _isMounted = useRef(false);
    const { mutedPost, setMutedPost, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (!_isMounted.current && data) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }

            setMutedPost(data.mutedPosts)
            
            // set did mount react
            _isMounted.current = true;

            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            <NavBar />
            {user ? (<div>
                {!mutedPost ? null
                    : mutedPost.map((post, key) => {
                        return (
                                <div key={`posts${post.id} ${key}`}>
                                    {console.log(post)}
                                <PostCard post={post} loading={loading} />
                            </div>
                        )
                    })}
            </div>) : null}
        </div>
    );
}

export default MutedPost