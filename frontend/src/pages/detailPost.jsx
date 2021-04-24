import { gql, useQuery } from '@apollo/client';
import { AuthContext } from '../context/auth'
import { Skeleton, List, Avatar, Card } from 'antd';
import { LikeOutlined, MessageOutlined } from '@ant-design/icons';
import React, {useContext} from 'react'
import Meta from 'antd/lib/card/Meta';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const IconText = ({ icon, text }) => (
    <span>
      {React.createElement(icon, { style: { marginRight: 8 } })}
      {text}
    </span>
  );

  const GET_POSTS = gql`
        query($id: String!){
        getPost(id: $id){
            id
            createdAt
            owner
            commentCount
            likeCount
            text
            comments{
                id
                createdAt
                owner
                text
                displayName
                photoProfile
                colorCode
                }
            }
        }
        `


export default function SinglePost(props) {
  
  const {state, setState} = useContext(AuthContext)
  let id = props.match.params.id;
  
  const  {loading , data}  = useQuery(GET_POSTS, {
    variables: { id }
  });
        
    

    let postMarkUp;

    if(!data) postMarkUp = <p>Loading...</p>
    else {
        let {getPost} = data
    let { comments } = getPost
        postMarkUp = (
            <List
          itemLayout="vertical"
          size="large">
               <List.Item
              key={getPost.id}
              actions={
                !loading && [
                  <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                  <IconText  icon={MessageOutlined} text={comments.length} key="list-vertical-message" />,
                ]
              }
              
            >
              <Skeleton loading={loading} active avatar>
                <List.Item.Meta
                  avatar={<Avatar src={getPost.avatar} />}
                  title={<a href={`/post/${getPost.id}`}>{getPost.owner}</a>}
                  description={getPost.createdAt}
                />
                {getPost.text}
              </Skeleton>
            </List.Item>
            <List
          itemLayout="vertical"
          size="large"
          dataSource={comments}
          renderItem={item => (
            <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
          <Meta
            avatar={
              <Link to="/profile">
              <Avatar size={50}  style={{ backgroundColor:item.colorCode, backgroundImage: `url(${item.photoProfile})`, backgroundSize: 50}} />
              </Link>
            }
            title={item.displayName}
            description={item.createdAt}
          />
          {item.text}
        </Card>
          )}
        />
          
          </List>
        )
    }

    return (
        <div>
            {postMarkUp}
        </div>
    )
}
