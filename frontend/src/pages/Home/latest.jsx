import React, { useContext, useEffect, useRef, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_POSTS } from '../../GraphQL/Queries'
import { PostContext } from '../../context/posts'

import InfiniteScroll from '../../components/InfiniteScroll'
import PostCard from '../../components/PostCard/index'
import { AuthContext } from '../../context/auth'


import SkeletonLoading from '../../components/SkeletonLoading'

import { getSession, getRangeSearch } from '../../util/Session';
import AdSense from 'react-adsense';
//gambar
import No_result from '../../assets/Noresults/No_posts_home_Profile.png'

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import LocationNotAllowed from '../Error/LocationNotAllowed'
import { Skeleton } from 'antd'



function Latest() {
    const history = useHistory().location.pathname
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [history])
    const _isMounted = useRef(false);

    const { posts, setPosts, loadingData, loadingAddPost, loading } = useContext(PostContext)
    const { user, setPathname, locationAllow } = useContext(AuthContext)

    useEffect(() => {
        setPathname(history)
    }, [])



    const { location } = getSession();
    const range = getRangeSearch();

    const [getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_POSTS, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (Object.keys(location).length) {
            const loc = JSON.parse(location);
            getPosts({ variables: { ...loc, range: range ? parseFloat(range) : undefined } });
        }
    }, [location]);

    useEffect(() => {
        if (!_isMounted.current && data) { // check if doesn't fetch data
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
        <div style={{ height: "100%" }} key="latest">
            {user ? (
                !locationAllow ? <LocationNotAllowed /> :
                    <InfiniteScroll isLoading={loadingPosts} >
                        {!_isMounted.current && !locationAllow && <LocationNotAllowed />}
                        {!_isMounted.current && locationAllow && <SkeletonLoading />}

                        {(_isMounted.current && !loading && !posts.length) ? (
                            !locationAllow ? (<LocationNotAllowed />) : (
                                <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                                    <img src={No_result} style={{ width: 300 }} />
                                    <h4 style={{ textAlign: 'center' }}>There is no Nearby post around you</h4>
                                    <h4 style={{ textAlign: 'center' }}>be the first to post in your area!</h4>
                                    <h4 style={{ textAlign: 'center' }}>or change your location to see other post around</h4>
                                </div>
                            )

                        )
                            :
                            <div style={{ height: "100%" }}>
                                {loadingAddPost && <Skeleton active />}
                                {
                                    posts && posts.map((post, key) => {
                                        const { muted, id } = post;
                                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                                        return (
                                            <div>
                                                <div className="postCard_container" key={`posts${id} ${key}`} style={key === 0 ? { marginTop: 20 } : { marginTop: 0 }} >
                                                    {!isMuted && <PostCard post={post} type="nearby" loading={loading} />}
                                                </div>

                                                {key > 1 && Math.ceil(key % 7) === 0 &&

                                                    <AdSense.Google
                                                        client='ca-pub-9126030075206824'
                                                        slot='1861909959'
                                                        style={{ display: 'flex' }}
                                                        format='fluid'
                                                        responsive='true'
                                                        layoutKey='-gw-3+1f-3d+2z'
                                                    />
                                                }

                                            </div>

                                        )
                                    })
                                }
                            </div>
                        }
                    </InfiniteScroll>) : null
            }
        </div >
    );
}

export default Latest


