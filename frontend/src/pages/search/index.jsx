import { Input, Col } from 'antd';
import { useMutation } from '@apollo/client'
import SkeletonLoading from '../../components/SkeletonLoading'
import { debounce, get } from 'lodash';
import AppBar from '../../components/AppBar';
import PostCard from '../../components/PostCard/index'

import { SEARCH_POSTS } from '../../GraphQL/Mutations';

import { getSession } from '../../util/Session';

import './style.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import NotFound from './NotFound';

const Search = () => {
  const [notFound, setnotFound] = useState(false);

  const [getSearch, { data, loading }] =useMutation(SEARCH_POSTS);
  const history = useHistory().location.pathname
  let hits = get(data, 'textSearch.hits') || [];

  const searchPosts = debounce(
    (value) => {

      const { location } = getSession();
      const { lat, lng } = JSON.parse(location);
      const payload = {
        page: 0,
        perPage: 5,
        range: 15,
        location: {
          lat, lng
        },
        search: value
      };

      getSearch({ variables: payload })
  }, 500)

  useEffect(() => {
    if ( data == undefined) setnotFound(false);
  }, [])
  

  const doSearchData = hits.length == 0
 

  const { setPathname } = useContext(AuthContext)

  useEffect(() => {
      setPathname(history)
  }, [])
console.log(data);
  return (
    <>
    <AppBar title="Seach" />
    
    <div className="search_page">
    <Input.Search
      className="search_input_wrapper"
      placeholder="input search text"
      allowClear
      size="large"
      onSearch={searchPosts}
      loading={loading}
    />
    {loading && <SkeletonLoading />}
      {/* {!loading && (!notFound || hits.length == 0) ? (
        <>
            <div className="explore-place">
              <span className="title">Explore Place</span>
              <div className="explore-place__btn-more">More</div>
              <div className="list-place">
                <Col lg={8} xs={9}>
                  <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg"/>
                  <span className="item-place__title">Karachi</span>
                </Col>
                <Col lg={8} xs={9}>
                  <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg"/>
                  <span className="item-place__title">Karachi</span>
                </Col>
                <Col lg={8} xs={9}>
                  <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg"/>
                  <span className="item-place__title">Karachi</span>
                </Col>
                <Col lg={8} xs={9}>
                  <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg"/>
                  <span className="item-place__title">Karachi</span>
                </Col>
              </div>
              </div>
  
              <div className="popular-section">
                <div className="popular-section__header">
                  <h3>More For You</h3>
                  <span>The most popular posts around the world</span>
                </div>
              </div>
          </>
      ) : (
        !loading && (!notFound && hits.length !== 0) ? (
          <>
                {hits.map((post, key) => (
                  <div key={`posts${post.id} ${key}`}>
                    <PostCard post={post} loading={loading} />
                  </div>
                ))}
                </>
        ) : (
          <NotFound />
        )
      )} */}
      {/* {notFound ? (
            <NotFound />
          ) : (
            loading ? (<SkeletonLoading />) : (
              doSearchData  ? (
                <>
                {hits.map((post, key) => (
                  <div key={`posts${post.id} ${key}`}>
                    <PostCard post={post} loading={loading} />
                  </div>
                ))}
                </>
              ) : (
            <>
            <div className="explore-place">
              <span className="title">Explore Place</span>
              <div className="explore-place__btn-more">More</div>
              <div className="list-place">
                <Col lg={8} xs={9}>
                  <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg"/>
                  <span className="item-place__title">Karachi</span>
                </Col>
                <Col lg={8} xs={9}>
                  <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg"/>
                  <span className="item-place__title">Karachi</span>
                </Col>
                <Col lg={8} xs={9}>
                  <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg"/>
                  <span className="item-place__title">Karachi</span>
                </Col>
                <Col lg={8} xs={9}>
                  <img className="item-place__image" src="https://i.pinimg.com/originals/40/fa/a6/40faa6ee309d8a420f54f6420fd28955.jpg"/>
                  <span className="item-place__title">Karachi</span>
                </Col>
              </div>
              </div>
  
              <div className="popular-section">
                <div className="popular-section__header">
                  <h3>More For You</h3>
                  <span>The most popular posts around the world</span>
                </div>
              </div>
          </>
            )
          
        )
      )} */}
    </div>
    </>
  )
}

export default Search;
