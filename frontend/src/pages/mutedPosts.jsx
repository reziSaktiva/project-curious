import React, { useContext, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/client'
import { GET_MUTED_POSTS, GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'


function MutedPost() {
    const { data } = useQuery(GET_MUTED_POSTS);

    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {
            if (!data) {
                loadingData();

                return;
            }

            setPosts(data.mutedPosts)
    }, [data])

    return (
        <div>
            <NavBar />
            {user ? (<div>
                {!posts ? null
                    : posts.map((post, key) => {
                        return (
                                <div key={`posts${post.id} ${key}`}>
                                <PostCard post={post} loading={loading} />
                            </div>
                        )
                    })}
            </div>) : null}
        </div>
    );
}

export default MutedPost