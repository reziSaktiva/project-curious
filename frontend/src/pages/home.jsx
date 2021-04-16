import React, { useContext, useEffect } from 'react'

import { useQuery } from '@apollo/client'
import { GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'


function Home() {
    const { data } = useQuery(GET_POSTS)

    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (!data) {
            loadingData()
        } else {
            setPosts(data.getPosts)
        }
    }, [data])

    return (
        <div>
            {user ? (<InfiniteScroll>
                {!posts ? null
                    : posts.map(post => {
                        return (
                            <div key={post.id}>
                                <PostCard post={post} loading={loading} />
                            </div>
                        )
                    })}
            </InfiniteScroll>) : null}
        </div>
    );
}

export default Home


