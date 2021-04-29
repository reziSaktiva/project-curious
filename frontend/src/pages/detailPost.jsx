//GQL
import { GET_POST } from '../GraphQL/Queries'
import moment from 'moment'
import Geocode from 'react-geocode'
import { useQuery } from '@apollo/client';
import { AuthContext } from '../context/auth'
import React, {useContext, useState} from 'react'
import Meta from 'antd/lib/card/Meta';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

//antd
import { Skeleton, List, Avatar, Card, Row, Col, Dropdown, Menu, Input } from 'antd';


//component
import Pin from '../assets/pin-svg-25px.svg'
import LikeButton from '../components/LikeButton';
import CommentButton from '../components/CommentButton';
import RepostButton from '../components/RepostButton';
import { EllipsisOutlined } from '@ant-design/icons';

//location
Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k")
Geocode.setLanguage("id");


const IconText = ({ icon, text }) => (
    <span>
      {React.createElement(icon, { style: { marginRight: 8 } })}
      {text}
    </span>
  );


export default function SinglePost(props) {
  const [address, setAddress] = useState('')
  
  const {state, setState} = useContext(AuthContext)
  let id = props.match.params.id;
  
  const  {loading , data}  = useQuery(GET_POST, {
    variables: { id }
  });
  
  const { Search } = Input


    let postMarkUp;

    if(!data) postMarkUp = <p>Loading...</p>
    else {
        let {getPost} = data

    //translate location

    Geocode.fromLatLng(getPost.location.lat, getPost.location.lng).then(
      (response) => {
        const address = response.results[0].address_components[1].short_name;
        setAddress(address);

      },
      (error) => {
        console.error(error);
      }
    );
  
    //post card start here

    let { comments } = getPost
        postMarkUp = (
            <List
          itemLayout="vertical"
          size="large">
               <List.Item
              key={getPost.id}
              actions={
                !loading && [
                  <Row gutter={[48, 0]}>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                  <LikeButton likeCount={ getPost.likeCount? getPost.likeCount: 0 } likes={getPost.likes} id={ getPost.id } />
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                        <CommentButton commentCount={ getPost.commentCount? getPost.commentCount : 0 } />
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                        <RepostButton />
                        </Col>
                      </Row>
                ]
              }
              
            >
              <Skeleton loading={loading} active avatar>
                <List.Item.Meta
                  title={<div>
                    <Row>
                      <Col span={12}>
                      <img src={Pin} style={{width: 20, position: "center"}}/>{address}
                      </Col>
                      <Col span={12} style={{textAlign: "right"}}>
                        <Dropdown overlay={
                          <Menu>
                          <Menu.Item key="0">
                            Subscribe
                          </Menu.Item>
                          <Menu.Item key="1" onClick={e=> console.log(e)}>
                            Mute
                          </Menu.Item>
                          <Menu.Item key="3">
                            Report
                          </Menu.Item>
                        </Menu>
                        } trigger={['click']} placement="bottomRight">
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                          <EllipsisOutlined />
                        </a>
                      </Dropdown>
                      </Col>
                  </Row>
                    </div>}
                  description={moment(getPost.createdAt).fromNow()}
                />
                {getPost.text}
              </Skeleton>
            </List.Item>
            {comments.length == 0 ? null : (
              <List
              itemLayout="vertical"
              size="large"
              dataSource={comments}
              renderItem={
                item => (
                <Card style={{ width: 300, marginTop: 16 }} loading={loading}>
              <Meta
                avatar={
                  <Link to="/profile">
                  <Avatar size={50}  style={{ backgroundColor:item.colorCode, backgroundImage: `url(${item.photoProfile})`, backgroundSize: 50}} />
                  </Link>
                }
                title={item.displayName}
                description={moment(item.createdAt).fromNow()}
              />
              {item.text}
            </Card>)
            }
            />
            ) }
            
        <Search
      placeholder="Input comment here..."
      allowClear
      enterButton="Post"
      size="large"
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
