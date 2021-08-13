import React, { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { GET_MORE_POSTS } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import { getSession } from '../util/Session'

import { LoadingOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd'

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
                hasMore={isMorePost && posts.length}
                loader={(loading || isLoading) ? loading ?
                    <Skeleton avatar active paragraph={{rows: 2}} />
                       : (
                    isLoading && <div className="centeringButton" ><LoadingOutlined /></div>): <Skeleton avatar active paragraph={{rows: 2}} />}
                scrollableTarget="scrollableDiv"
                {...props}
            />
        </div>
    )
}

export default ScrollInfinite
