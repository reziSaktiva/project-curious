import React, { useContext, useEffect, useRef, useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_MUTED_POSTS, GET_POSTS } from '../GraphQL/Queries'
import { PostContext } from '../context/posts'
import PostCard from '../components/PostCard/index'
import { AuthContext } from '../context/auth'
import AppBar from '../components/AppBar'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import NotificationMobile from '../components/NotificationMobile'
import SidebarMobile from '../components/SidebarMobile'
import BackDrop from '../components/BackDrop'

function MutedPost() {
  const { data } = useQuery(GET_MUTED_POSTS);
  const _isMounted = useRef(false);
  const { mutedPost, setNavMobileOpen, setMutedPost, loadingData, loading } = useContext(PostContext)
  const { user } = useContext(AuthContext)

  const [burger, setBurger] = useState({
    toggle: false
  })

  const path = useHistory().location.pathname

  const { setPathname } = useContext(AuthContext)

  const handleBurger = () => {
    setBurger(prevState => {
      return {
        toggle: !prevState.toggle
      }
    })
  }

  const handleNotif = () => {
    setNavMobileOpen(true)
  }
  const handleBackdropClose = () => {
    setBurger({ toggle: false })
  }
  useEffect(() => {
    setPathname(path)
  }, [])

  useEffect(() => {
    if (!_isMounted.current && data) { // check if doesn't fetch data
      if (!data) {
        loadingData();

        return;
      }

      setMutedPost(data.mutedPosts)

      // set did mount react
      _isMounted.current = true;

      return;
    }
  }, [data, _isMounted])

  useEffect(() => {
    setPathname(path)
    window.scrollTo(0, 0);
}, [])
  return (
    <div>
      <AppBar title="Muted Post" />
      <NotificationMobile />
      <SidebarMobile show={burger.toggle} />

      {burger.toggle ? <BackDrop click={handleBackdropClose} /> : null}
      {user ? (<div>
        {!mutedPost || mutedPost.length < 1 ? (
          <div className="centering-flex">
            <div className="mute_noPost" />
            <h4 style={{ textAlign: 'center' }}>Here you can mute a post u dont like</h4>
            <h4 style={{ textAlign: 'center' }}>and unmute to see it again</h4>
          </div>
        )
          : mutedPost.map((post, key) => {
            return (
              <div key={`posts${post.id} ${key}`} style={key === 0 ? { marginTop: 8 } : { marginTop: 0 }}>
                <PostCard post={post} type="muted_posts" loading={loading} />
              </div>
            )
          })}
      </div>) : <p className='centeringButton'>test</p>}
    </div>
  );
}

export default MutedPost