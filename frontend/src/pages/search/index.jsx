import { Input } from 'antd';
import { useMutation } from '@apollo/client'
import SkeletonLoading from '../../components/SkeletonLoading'
import { debounce, get } from 'lodash';
import AppBar from '../../components/AppBar';
import PostCard from '../../components/PostCard/index'

import { SEARCH_POSTS } from '../../GraphQL/Mutations';

import { getSession } from '../../util/Session';

import ExplorePlace from './explorePlace';

import './style.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import NotFound from './NotFound';

const Search = () => {
<<<<<<< HEAD
  const [getSearch, { data, loading }] = useMutation(SEARCH_POSTS);
=======
  const [searched, setSearched] = useState(false);

  const [getSearch, { data, loading }] =useMutation(SEARCH_POSTS);
>>>>>>> 1d80d3ba0b33581138c8907dcdd7de42b4d694d4
  const history = useHistory().location.pathname
  let hits = get(data, 'textSearch.hits') || undefined;

  const searchPosts = debounce(
    (value) => {
      setSearched(true)
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

  // useEffect(() => {
  //   if ( data == undefined) setnotFound(false);
  // }, [])
  

  const { setPathname } = useContext(AuthContext)

  // useEffect(() => {

  // }, [hits])
  return (
    <>
    <AppBar title="Seach" />
    
    <div className="search_page">
<<<<<<< HEAD
    <Input placeholder="seach something.." className="test" onPressEnter={searchPosts} prefix={<SearchOutlined />} style={{marginBottom: 10}} />
      {doSearchData ? (
        <>{hits.map((post, key) => (
          <div key={`posts${post.id} ${key}`}>
            <PostCard post={post} loading={loading} />
          </div>
        ))}</>
      ) : (
        <ExplorePlace />
=======
    <Input.Search
      className="search_input_wrapper"
      placeholder="input search text"
      allowClear
      size="large"
      onSearch={searchPosts}
      loading={loading}
    />
    {loading && <SkeletonLoading />}
      {console.log("hits", hits)}
      {hits ? (
        searched && hits.length == 0 ? <NotFound /> : 
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
>>>>>>> 1d80d3ba0b33581138c8907dcdd7de42b4d694d4
      )}
    </div>
    </>
  )
}

export default Search;
