import React, { useContext, useEffect, useRef, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_POPULAR_POSTS } from '../../GraphQL/Queries'
import { PostContext } from '../../context/posts'

import InfiniteScroll from '../../components/InfiniteScroll'
import PostCard from '../../components/PostCard/index'
import { AuthContext } from '../../context/auth'

import { getRangeSearch, getSession } from '../../util/Session';
import SkeletonLoading from '../../components/SkeletonLoading'
import No_result from '../../assets/Noresults/No_posts_home_Profile.png'
import { useHistory } from 'react-router-dom'


function Popular() {
    const {user, setPathname } = useContext(AuthContext)
    const { posts, setPosts, loadingData, loading } = useContext(PostContext)

    const history = useHistory().location.pathname
    useEffect(() => {
        setPathname(history)
    }, [])


    const _isMounted = useRef(false);
    const { location } = getSession();
    const range = getRangeSearch();
    const [ getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_POPULAR_POSTS);
    
    useEffect(() => {
        if (Object.keys(location).length) {
            const loc = JSON.parse(location);
            getPosts({ variables: { ...loc, range: range ? parseFloat(range) : undefined } });
        }
    }, [location]);

    useEffect(() => {
        if (data  && !_isMounted.current) { // check if doesn't fetch data
            if (!data) {
                loadingData();

                return;
            }
            setPosts(data.getPopularPosts)

            _isMounted.current = true
            // set did mount react

            return;
        }
    }, [data, _isMounted])

    return (
        <div>

            {user ? (<InfiniteScroll isLoading={loadingPosts}>
                {!_isMounted.current && <SkeletonLoading />}
                {(_isMounted.current && !loading && !posts.length) ? (
                <div style={{display:"flex", justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                <img src={No_result} style={{ width: 300}} />
                <h4 style={{textAlign: 'center'}}>There is no Nearby post around you</h4>
                <h4 style={{textAlign: 'center'}}>be the first to post in your area!</h4>
                <h4 style={{textAlign: 'center'}}>or change your location to see other post around</h4>
            </div>
                ) 
                    : posts.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                        
                        return (
                            <div key={`posts${id} ${key}`} style={key === 0 ? { marginTop: 16 } : { marginTop: 0 }}>
                                {!isMuted && <PostCard post={post} type="nearby" loading={loading} />}
                            </div>
                        )
                    })}
            </InfiniteScroll>) : null}
        </div>
    );
}

export default Popular