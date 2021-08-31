import React, { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { GET_MORE_MORE_FOR_YOU, GET_MORE_POPULAR, GET_MORE_POSTS, GET_MORE_ROOM } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import { getRangeSearch, getSession } from '../util/Session'

import { LoadingOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useEffect } from 'react'
import { useState } from 'react'

function ScrollInfinite(props) {
    const pathname = useHistory().location.pathname

    const { isLoading, visitedLocation } = props;
    const { posts, morePosts, room_1, room_2, active, isMorePost, lastIdPosts } = useContext(PostContext)

    const { location } = getSession()
    const range = getRangeSearch();

    let loading;

    const [nextPosts, { loading: loadingNearby }] = useMutation(GET_MORE_POSTS, {
        update(_, { data: { nextPosts: postsData } }) {
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })

    const [nextPopular, { loading: loadingPopular }] = useMutation(GET_MORE_POPULAR, {
        update(_, { data: { nextPopularPosts: postsData } }) {
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })

    const [nextRoom, { loading: loadingRoom }] = useMutation(GET_MORE_ROOM, {
        update(_, { data: { nextRoomPosts: postsData } }) {
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })

    const [nextMoreForYou, { loading: loadingMoreForYou }] = useMutation(GET_MORE_MORE_FOR_YOU, {
        update(_, { data: { nextMoreForYou: postsData } }) {
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        },
    })

    const loadMore = () => {
        const loc = JSON.parse(location)
        if (posts.length) {
            switch (pathname) {
                case '/Insvire E-Sport':
                    nextRoom({ variables: { id: room_1[room_1.length - 1].id, room: 'Insvire E-Sport' } })
                    break;
                case '/BMW Club Bandung':
                    nextRoom({ variables: { id: room_2[room_2.length - 1].id, room: 'BMW Club Bandung' } })
                    break;
                case '/':
                    if (active === 'latest') {
                        nextPosts({ variables: { id: posts[posts.length - 1].id, lat: loc.lat, lng: loc.lng, range: range ? parseFloat(range) : undefined } })
                    } else {
                        nextPopular({ variables: { id: posts[posts.length - 1].id, lat: loc.lat, lng: loc.lng, range: range ? parseFloat(range) : undefined } })
                    }
                    break;
                case '/visited':
                    if (active === 'latest') {
                        nextPosts({ variables: { ...visitedLocation, id: posts[posts.length - 1].id, range: 5 } })
                    } else {
                        nextPopular({ variables: { ...visitedLocation, id: posts[posts.length - 1].id, range: 5 } })
                    }
                    break;
                case '/search':
                    if (active === 'moreForYou') {
                        nextMoreForYou({ variables: { id: posts[posts.length - 1].id } })
                    }
                    break;
                default:
                    nextPosts({ variables: { id: posts[posts.length - 1].id, lat: loc.lat, lng: loc.lng, range: range ? parseFloat(range) : undefined } })
                    break;
            }
        }
    }

    useEffect(() => {
        switch (pathname) {
            case '/Insvire E-Sport' || '/BMW Club Bandung':
                loading = loadingRoom
                break;
            case '/popular':
                loading = loadingPopular
                break;
            case '/search':
                if (active === 'moreForYou') {
                    loading = loadingMoreForYou
                }
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
                hasMore={isMorePost}
                loader={(loading || isLoading) ? loading ?
                    <Skeleton avatar active paragraph={{ rows: 2 }} />
                    : (isLoading && <div className="centeringButton" ><LoadingOutlined /></div>) : <Skeleton avatar active paragraph={{ rows: 2 }} />}
                scrollableTarget="scrollableDiv"

                {...props}


            />
        </div>
    )
}

export default ScrollInfinite
