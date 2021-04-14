import React, { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { GET_MORE_POSTS } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'

function ScrollInfinite(props) {
    const { posts, morePosts, lastId, more } = useContext(PostContext)

    const [ nextPosts ] = useMutation(GET_MORE_POSTS, {
        update(_, { data: { nextPosts: postsData } }){
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })

    const loadMore = () => {
        nextPosts({ variables: { id: lastId } })
    }
    return (
        <div>
            <InfiniteScroll
                dataLength={posts ? posts.length : 0}
                next={loadMore}
                hasMore={more}
                loader={<h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                {...props}
            />
        </div>
    )
}

export default ScrollInfinite
