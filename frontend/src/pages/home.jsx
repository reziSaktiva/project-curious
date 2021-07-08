import React, { useContext, useEffect, useRef, useState } from 'react'

import { useLazyQuery, useQuery } from '@apollo/client'
import { GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'

import InfiniteScroll from '../components/InfiniteScroll'
import PostCard from '../components/PostCard/index'
import { AuthContext } from '../context/auth'
import NavBar from '../components/NavBar'

import SkeletonLoading from '../components/SkeletonLoading'

import { getSession, getRangeSearch } from '../util/Session';

//gambar
import Radius from '../assets/radius.png'
import SidebarMobile from '../components/SidebarMobile'
import BackDrop from '../components/BackDrop'
import NotificationMobile from '../components/NotificationMobile'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'


function Home() {
    const history = useHistory().location.pathname
    const [burger, setBurger] = useState({
        toggle : false
    })
    const [notif, setNotif] = useState({
        toggle : false
    })

    const _isMounted = useRef(false);
    
    const { posts, setPosts, loadingData, loading } = useContext(PostContext)
    const { user, setPathname } = useContext(AuthContext)

    useEffect(() => {
        setPathname(history)
    }, [])

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
    const handleBackdropClose = () => {
        setBurger({toggle: false})
    }

    const { location } = getSession();
    const range = getRangeSearch();

    const [ getPosts, { data, loading: loadingPosts }] = useLazyQuery(GET_POSTS, {
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
        <div style={{height: "100%"}}>
            <NavBar toggleOpen={handleBurger} toggleOpenNotif={handleNotif} />
            <NotificationMobile show={notif.toggle} />
            <SidebarMobile show={burger.toggle} />
            {burger.toggle ? <BackDrop click={handleBackdropClose} /> : null}

            {user ? (<InfiniteScroll isLoading={loadingPosts}>
                {!_isMounted.current && <SkeletonLoading />}
                {(_isMounted.current && !loading && !posts.length) ? (
                <div className="centeringButton">
                <img src={Radius} style={{ width: 300}} />
                <h4 style={{textAlign: 'center'}}>There is no Nearby post around you</h4>
                <h4 style={{textAlign: 'center'}}>be the first to post in your area!</h4>
                <h4 style={{textAlign: 'center'}}>or change your location to see other post around</h4>
            </div>
                )
                    : posts.map((post, key) => {
                        const { muted, id } = post;
                        const isMuted = user && muted && muted.find((mute) => mute.owner === user.username)
                         return(
                            <div key={`posts${id} ${key}`} style={key == 0 ? { marginTop: 16 }: { marginTop: 0 }} >
                                {!isMuted && <PostCard post={post} type="nearby" loading={loading} />}
                            </div>
                        )
                    })}
            </InfiniteScroll>) : "hai"}
        </div>
    );
}

export default Home


