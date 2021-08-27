import React, { useContext, useEffect, useRef, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard/index'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'

import SkeletonLoading from '../components/SkeletonLoading'

import { getSession, getRangeSearch } from '../util/Session';
import AdSense from 'react-adsense';
//gambar
import No_result from '../assets/NoResults/No_posts.png'
import SidebarMobile from '../components/SidebarMobile'
import BackDrop from '../components/BackDrop'
import NotificationMobile from '../components/NotificationMobile'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'



function Latest() {
    const history = useHistory().location.pathname

    const _isMounted = useRef(false);

    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user, setPathname } = useContext(AuthContext)

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
            {user ? (<InfiniteScroll isLoading={loadingPosts} >
                {!_isMounted.current && <SkeletonLoading />}
                {(_isMounted.current && !loading && !posts.length) ? (
                    <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column" }}>
                        <img src={No_result} style={{ width: 300 }} />
                        <h4 style={{ textAlign: 'center' }}>There is no Nearby post around you</h4>
                        <h4 style={{ textAlign: 'center' }}>be the first to post in your area!</h4>
                        <h4 style={{ textAlign: 'center' }}>or change your location to see other post around</h4>
                    </div>
                )
                    :
                    <div>
                        {
                            posts.map((post, key) => {
                                const { muted, id } = post;
                                const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                                return (
                                    <div>
                                        <div className="postCard_container" key={`posts${id} ${key}`} style={key == 0 ? { marginTop: 16 } : { marginTop: 0 }} >
                                            {!isMuted && <PostCard post={post} type="nearby" loading={loading} />}
                                        </div>
                                        {key > 1 && Math.ceil(key % 7) === 0 && <AdSense.Google
                                            key={`latest ${key}`}
                                            client='pub-9126030075206824'
                                            slot='9964874359'
                                            style={{ display: 'block' }}
                                            format='auto'
                                            responsive='true'
                                            layoutKey='-gw-1+2a-9x+5c'
                                        />}
                                    </div>

                                )
                            })
                        }
                    </div>
                }
            </InfiniteScroll>) : null}
        </div>
    );
}

export default Latest


