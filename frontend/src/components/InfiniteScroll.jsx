import React, { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { GET_MORE_POSTS } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import { getSession } from '../util/Session'

function ScrollInfinite(props) {
    const { isLoading } = props;
    const { posts, morePosts, lastIdPosts, isMorePost } = useContext(PostContext)
    const { location } = getSession()

    const [ nextPosts, { loading } ] = useMutation(GET_MORE_POSTS, {
        update(_, { data: { nextPosts: postsData } }){
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })
    
    const loadMore = () => {
        const loc = JSON.parse(location)
        nextPosts({ variables: { id: lastIdPosts, lat: loc.lat, lng: loc.lng } })
    }
    
    return (
        <div>
            <InfiniteScroll
                dataLength={posts ? posts.length : 0}
                next={loadMore}
                hasMore={isMorePost}
                loader={(!loading || !isLoading) && posts.length < 1 ? <h4>belum ada postingan</h4> : <h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                {...props}
            />
        </div>
    )
}

export default ScrollInfinite
