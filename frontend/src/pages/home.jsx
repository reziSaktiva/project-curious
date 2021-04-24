import React, { useContext, useEffect, useRef } from 'react'

import { useQuery } from '@apollo/client'
import { GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard'
import { AuthContext } from '../context/auth'


function Home() {
    const { data, loading: loadingPosts } = useQuery(GET_POSTS);
    const _isMounted = useRef(false);

    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    useEffect(() => {
        if (!_isMounted.current) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }

            setPosts(data.getPosts)
            
            // set did mount react
            _isMounted.current = true;

            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            {user ? (<InfiniteScroll isLoading={loadingPosts}>
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


