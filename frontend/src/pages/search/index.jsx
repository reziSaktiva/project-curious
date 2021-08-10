import { Input } from 'antd';
import { useMutation } from '@apollo/client'
import { SearchOutlined } from '@ant-design/icons';
import { debounce, get } from 'lodash';
import AppBar from '../../components/AppBar';
import PostCard from '../../components/PostCard/index'

import { SEARCH_POSTS } from '../../GraphQL/Mutations';

import { getSession } from '../../util/Session';

import ExplorePlace from './explorePlace';

import './style.css';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/auth';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Search = () => {
  const [getSearch, { data, loading }] = useMutation(SEARCH_POSTS);
  const history = useHistory().location.pathname
  const hits = get(data, 'textSearch.hits') || [];

  const searchPosts = debounce(
    ({ target: { value }}) => {
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

  const doSearchData = hits.length && !loading;

  const { setPathname } = useContext(AuthContext)
  useEffect(() => {
      setPathname(history)
  }, [])
console.log(hits);
  return (
    <>
    <AppBar title="Seach" />
    
    <div className="search_page">
    <Input placeholder="seach something.." className="test" onPressEnter={searchPosts} prefix={<SearchOutlined />} style={{marginBottom: 10}} />
      {doSearchData ? (
        <>{hits.map((post, key) => (
          <div key={`posts${post.id} ${key}`}>
            <PostCard post={post} loading={loading} />
          </div>
        ))}</>
      ) : (
        <ExplorePlace />
      )}
    </div>
    </>
  )
}

export default Search;
