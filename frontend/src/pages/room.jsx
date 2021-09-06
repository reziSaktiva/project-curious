import React, { useContext, useEffect, useRef } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_ROOM_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import PostCard from '../components/PostCard/index'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import No_result from '../assets/Noresults/No_posts_home_Profile.png'
import SkeletonLoading from '../components/SkeletonLoading'
import InfiniteScroll from '../components/InfiniteScroll'
import { Helmet } from 'react-helmet'


function Room(props) {
    const history = useHistory().location.pathname

    const { setPathname } = useContext(AuthContext)

    useEffect(() => {
        setPathname(history)
    }, [history])

    const room = props.match.path
    const _isMounted = useRef(false);
    const { room_1, setRoom, room_2, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    const [getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_ROOM_POSTS, {
        fetchPolicy: "network-only",
    });

    useEffect(() => {
        if (room) {
            getPosts({ variables: { room } });
        }
    }, [room]);

    useEffect(() => {
        if (data && !_isMounted.current) { // check if doesn't fetch data
            if (!data) {
                loadingData();
                return;
            }
            setRoom(data.getRoomPosts)

            if (room_1.length && room_2.length) {
                _isMounted.current = true
            }
            // set did mount react
            return;
        }
    }, [data, _isMounted])

    return (
        <div>
            <Helmet>
                <title>Curious - Room</title>
                <meta name="description" content="Here where you can see on going event so you wont miss the new trend." />
                <meta name="keywords" description="Social Media, Dating App, Chat App" />
            </Helmet>
            <NavBar />
            {_isMounted.current && room_1.length !== 0 && <SkeletonLoading />}
            <InfiniteScroll isLoading={loadingPosts}>
                {room === "/Insvire E-Sport" ? (user ? (room_1.length === 0 ? (
                    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                        <img src={No_result} style={{ width: 300 }} />
                        <h4 style={{ textAlign: 'center' }}>There is no Nearby post around you</h4>
                        <h4 style={{ textAlign: 'center' }}>be the first to post in your area!</h4>
                        <h4 style={{ textAlign: 'center' }}>or change your location to see other post around</h4>
                    </div>)
                    : room_1.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)

                        return (
                            <div key={`posts${id} ${key}`}>
                                {!isMuted && <PostCard post={post} loading={loading} />}
                            </div>
                        )
                    })) : null) : (user ? (room_2.length === 0 ? (
                        (
                            <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                                <img src={No_result} style={{ width: 300 }} />
                                <h4 style={{ textAlign: 'center' }}>There is no Nearby post around you</h4>
                                <h4 style={{ textAlign: 'center' }}>be the first to post in your area!</h4>
                                <h4 style={{ textAlign: 'center' }}>or change your location to see other post around</h4>
                            </div>)
                    )
                        : room_2.map((post, key) => {
                            const { muted, id } = post;
                            const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)

                            return (
                                <div key={`posts${id} ${key}`}>
                                    {!isMuted && <PostCard post={post} loading={loading} />}
                                </div>
                            )
                        })) : null)}
            </InfiniteScroll>
        </div>
    );
}

export default Room