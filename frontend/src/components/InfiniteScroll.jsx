import React, { useContext } from 'react'

import { useMutation } from '@apollo/client'
import { GET_MORE_MORE_FOR_YOU, GET_MORE_POPULAR, GET_MORE_POSTS, GET_MORE_PROFILE_LIKED_POSTS, GET_MORE_PROFILE_POSTS, GET_MORE_ROOM } from '../GraphQL/Mutations'
import { PostContext } from '../context/posts'

import InfiniteScroll from 'react-infinite-scroll-component'
import { getRangeSearch, getSession } from '../util/Session'

import { LoadingOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useEffect } from 'react'
import { AuthContext } from '../context/auth'

function ScrollInfinite(props) {
    const pathname = useHistory().location.pathname
    const { isLoading, visitedLocation, profile } = props;
    const { posts, morePosts, moreRoom, moreLikedPosts, room_1, room_2, active, isMorePost, lastIdPosts, isMoreLikedPost, lastIdLikedPosts, likedPosts } = useContext(PostContext)
    const { user } = useContext(AuthContext)
    const { location } = getSession()
    const range = getRangeSearch();

    let loading;
    let postsLength;

    const [nextPosts, { loading: loadingNearby }] = useMutation(GET_MORE_POSTS, {
        update(_, { data: { nextPosts: postsData } }) {
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })

    const [nextProfilePosts, { loading: loadingProfile }] = useMutation(GET_MORE_PROFILE_POSTS, {
        update(_, { data: { nextProfilePosts: postsData } }) {
            morePosts(postsData)
        },
        onError(err) {
            console.log(err.message);
        }
    })

    const [nextProfileLikedPost, { loading: loadingProfileLiked }] = useMutation(GET_MORE_PROFILE_LIKED_POSTS, {
        update(_, { data: { nextProfileLikedPost: postsData } }) {
            moreLikedPosts(postsData)
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
            moreRoom(postsData)
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
        console.log("jalan");
        switch (pathname) {
            case '/Insvire E-Sport':
                nextRoom({ variables: { id: room_1[room_1.length - 1].id, room: 'Insvire E-Sport' } })
                break;
            case '/BMW Club Bandung':
                nextRoom({ variables: { id: room_2[room_2.length - 1].id, room: 'BMW Club Bandung' } })
                break;
            case '/visited':
                if (active === 'latest') {
                    nextPosts({ variables: { ...visitedLocation, id: lastIdPosts, range: 1 } })
                } else {
                    nextPopular({ variables: { ...visitedLocation, id: lastIdPosts, range: 1 } })
                }
                break;
            case '/search':
                if (active === 'moreForYou') {
                    nextMoreForYou({ variables: { id: lastIdPosts } })
                }
                break;
            case `/${user.username}`:
                switch (profile) {
                    case 'profilePosts':
                        nextProfilePosts({ variables: { id: lastIdPosts } })
                        break;
                    case "likedPosts":
                        nextProfileLikedPost({ variables: { id: lastIdLikedPosts } })
                        break;
                }
                break;
            default:
                if (profile) {
                    switch (profile) {
                        case 'profilePosts':
                            nextProfilePosts({ variables: { id: lastIdPosts, username: pathname.split('/')[1] } })
                            break;
                        case "likedPosts":
                            nextProfileLikedPost({ variables: { id: lastIdLikedPosts, username: pathname.split('/')[1] } })
                            break;
                    }
                } else {
                    if (active === 'latest') {
                        nextPosts({ variables: { id: lastIdPosts, lat: loc.lat, lng: loc.lng, range: range ? parseFloat(range) : undefined } })
                    } else {
                        nextPopular({ variables: { id: lastIdPosts, lat: loc.lat, lng: loc.lng, range: range ? parseFloat(range) : undefined } })
                    }
                }
                break;
        }
    }

    useEffect(() => {
        switch (pathname) {
            case '/Insvire E-Sport' || '/BMW Club Bandung':
                loading = loadingRoom
                postsLength = room_1.length || room_2.length
                break;
            case '/popular':
                loading = loadingPopular
                postsLength = posts.length
                break;
            case '/search':
                if (active === 'moreForYou') {
                    loading = loadingMoreForYou
                    postsLength = posts.length
                }
                break;
            case `/${user.username}`:
                switch (profile) {
                    case 'profilePosts':
                        loading = loadingProfile
                        postsLength = posts.length
                        break;
                    case "likedPosts":
                        loading = loadingProfileLiked
                        postsLength = likedPosts
                        break;
                }
            default:
                if (profile) {
                    switch (profile) {
                        case 'profilePosts':
                            loading = loadingProfile
                            postsLength = posts.length
                            break;
                        case "likedPosts":
                            loading = loadingProfileLiked
                            postsLength = likedPosts.length
                            break;
                    }
                } else {
                    loading = loadingNearby || loadingPopular
                    postsLength = posts.length
                }
                break;
        }
    }, [pathname])
    return (
        <div>
            <InfiniteScroll
                dataLength={postsLength ? postsLength : posts.length || likedPosts.length || room_1.length || room_2.length}
                next={loadMore}
                hasMore={profile === 'likedPosts' ? isMoreLikedPost : isMorePost}
                loader={(loading || isLoading) ? loading || loadingNearby ?
                    <Skeleton avatar active paragraph={{ rows: 2 }} />
                    : (isLoading && <div className="centeringButton" ><LoadingOutlined /></div>) : <Skeleton avatar active paragraph={{ rows: 2 }} />}
                scrollableTarget="scrollableDiv"
                {...props}
                
            />
        </div>
    )
}

export default ScrollInfinite
