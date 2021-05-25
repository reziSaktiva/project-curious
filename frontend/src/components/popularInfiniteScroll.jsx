import React, { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { GET_MORE_POPULAR } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import { getSession } from '../util/Session'

function ScrollInfinitePopular(props) {
    const { isLoading } = props;
    const { popular, morePopular, lastIdPopular, isMorePopular } = useContext(PostContext)
    const { location } = getSession()

    const [ nextPopular, { loading } ] = useMutation(GET_MORE_POPULAR, {
        update(_, { data: { nextPopularPosts: postsData } }){
            morePopular(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })
    
    const loadMore = () => {
        const loc = JSON.parse(location)
        nextPopular({ variables: { id: lastIdPopular, lat: loc.lat, lng: loc.lng } })
    }
    
    return (
        <div>
            <InfiniteScroll
                dataLength={popular ? popular.length : 0}
                next={loadMore}
                hasMore={isMorePopular}
                loader={(!loading || !isLoading) && popular.length < 1 ? <h4>belum ada postingan</h4> : <h4>Loading...</h4>}
                scrollableTarget="scrollableDiv"
                {...props}
            />
        </div>
    )
}

export default ScrollInfinitePopular