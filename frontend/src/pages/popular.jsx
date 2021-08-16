import React, { useContext, useEffect, useRef, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import { GET_POPULAR_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard/index'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'
import SidebarMobile from '../components/SidebarMobile'
import NotificationMobile from '../components/NotificationMobile'

import { getRangeSearch, getSession } from '../util/Session';


function Popular() {
    const _isMounted = useRef(false);
    const [burger, setBurger] = useState({
        toggle : false
    })
    const [notif, setNotif] = useState({
        toggle : false
    })

    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user } = useContext(AuthContext)

    const { location } = getSession();
    const range = getRangeSearch();
    const [ getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_POPULAR_POSTS);

    const handleBurger = () => {
        setBurger(prevState => {
            return {
                toggle : !prevState.toggle
            }
        })
    }
    const handleNotif = () => {
        setNotif(prevState => {
            return {
                toggle : !prevState.toggle
            }
        })
    }
    
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
            <NavBar toggleOpen={handleBurger} toggleOpenNotif={handleNotif} />
            <NotificationMobile show={notif.toggle} />
            <SidebarMobile show={burger.toggle} />
            {user ? (<InfiniteScroll isLoading={loadingPosts}>
                {!posts ? null
                    : posts.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                        
                        return (
                            <div key={`posts${id} ${key}`} style={key == 0 ? { marginTop: 16 } : { marginTop: 0 }}>
                                {!isMuted && <PostCard post={post} loading={loading} />}
                            </div>
                        )
                    })}
            </InfiniteScroll>) : null}
        </div>
    );
}

export default Popular