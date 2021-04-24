import React, { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { GET_MORE_POSTS } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import { H4 } from 'tabler-icons-react'

function ScrollInfinite(props) {
    const { isLoading } = props;
    const { posts, morePosts, lastId, more } = useContext(PostContext)

    const [ nextPosts, { loading } ] = useMutation(GET_MORE_POSTS, {
        update(_, { data: { nextPosts: postsData } }){
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })

    console.log('loading: ', loading);
    const loadMore = () => {
        nextPosts({ variables: { id: lastId } })
    }
    return (
        <div>
            <InfiniteScroll
                dataLength={posts ? posts.length : 0}
                next={loadMore}
                hasMore={more}
                loader={(!loading || !isLoading) && posts.length < 1 ? <h4>belum ada postingan</h4> : <h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                {...props}
            />
        </div>
    )
}

export default ScrollInfinite
