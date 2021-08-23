import React, { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { GET_MORE_POPULAR, GET_MORE_POSTS } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import { getRangeSearch, getSession } from '../util/Session'

import { LoadingOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useEffect } from 'react'

function ScrollInfinite(props) {
    console.log("props", props);
    const pathname = useHistory().location.pathname

    const { isLoading } = props;
    const { posts, morePosts, lastIdPosts, isMorePost } = useContext(PostContext)
    const { location } = getSession()
    const range = getRangeSearch();

    let loading;

    const [ nextPosts, { loading : loadingNearby } ] = useMutation(GET_MORE_POSTS, {
        update(_, { data: { nextPosts: postsData } }){
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })

    const [ nextPopular, { loading : loadingPopular } ] = useMutation(GET_MORE_POPULAR, {
        update(_, { data: { nextPopularPosts: postsData } }){
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })
    
    const loadMore = () => {
        const loc = JSON.parse(location)
        switch (pathname) {
            case '/popular':
                nextPopular({ variables: { id: lastIdPosts, lat: loc.lat, lng: loc.lng, range: range ? parseFloat(range) : undefined } })
                break;
            default:
                nextPosts({ variables: { id: lastIdPosts, lat: loc.lat, lng: loc.lng, range: range ? parseFloat(range) : undefined } })
                break;
        }
    }

    useEffect(() => {
        switch (pathname) {
            case '/popular':
                loading = loadingPopular
                break;
        
            default:
                loading = loadingNearby
                break;
        }
    }, [pathname])
    return (
        <div>
            <InfiniteScroll
                dataLength={posts ? posts.length : 0}
                next={loadMore}
                hasMore={isMorePost && posts.length}
                loader={(loading || isLoading) ? loading ?
                    <Skeleton avatar active paragraph={{rows: 2}} />
                       : (isLoading && <div className="centeringButton" ><LoadingOutlined /></div>): <Skeleton avatar active paragraph={{rows: 2}} />}
                scrollableTarget="scrollableDiv"

                {...props}

                
            />
        </div>
    )
}

export default ScrollInfinite
