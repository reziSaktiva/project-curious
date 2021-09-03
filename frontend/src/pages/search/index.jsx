import { Input, Col } from 'antd';
import { useMutation } from '@apollo/client'
import SkeletonLoading from '../../components/SkeletonLoading'
import { debounce, get } from 'lodash';
import AppBar from '../../components/AppBar';
import PostCard from '../../components/PostCard/index'

import { SEARCH_POSTS } from '../../GraphQL/Mutations';

import { getSession } from '../../util/Session';

import ExplorePlace from './explorePlace';

import './style.css';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/auth';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import NotFound from './NotFound';
import { Helmet } from 'react-helmet'
const Search = () => {
  const [searched, setSearched] = useState(false);
  const [backtoDefault, setbacktoDefault] = useState(false)
  const [getSearch, { data, loading }] =useMutation(SEARCH_POSTS);
  const path = useHistory().location.pathname
  let hits = get(data, 'textSearch.hits') || undefined;
  const { setPathname } = useContext(AuthContext)
  
  useEffect(() => {
      setPathname(path)
  }, [])
  const searchPosts = debounce(
    (value) => {
      setSearched(true)
      if(value === "") {
        setbacktoDefault(true)
      return
      }
      else setbacktoDefault(false)
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

  return (
    <>
    <Helmet>
     <title>Curious - Explore</title>
     <meta name="description" content="Explore Everything All Around The World" />
     <meta name="keywords" description="Social Media, Dating App, Chat App" />
    </Helmet>
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
      {hits && !backtoDefault ? (
        searched && hits.length === 0 ? <NotFound /> : 
                <>
                {hits.map((post, key) => (
                  <div key={`posts${post.id} ${key}`}>
                    <PostCard post={post} loading={loading} />
                  </div>
                ))}
                </>
              ) : (
           <ExplorePlace />
      )}
    </div>
    </>
  )
}

export default Search;
