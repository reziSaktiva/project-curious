import React, { useContext, useEffect } from 'react'

import { useQuery } from '@apollo/client'
import { GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard'


function Home() {
    const { data } = useQuery(GET_POSTS)

    const { posts, setPosts, loadingData, loading } = useContext(PostContext)

    useEffect(() => {
        if (!data) {
            loadingData()
        } else {
            setPosts(data.getPosts)
        }
    }, [data])

    return (
        <div>
            <InfiniteScroll>
                {!posts ? null
                    : posts.map(post => {
                        return (
                            <div key={post.id}>
                                <PostCard post={post} loading={loading} />
                            </div>
                        )
                    })}
            </InfiniteScroll>
        </div>
    );
}

export default Home


