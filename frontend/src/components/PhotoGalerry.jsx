import React, { useState, useEffect, useContext } from "react";
import { List } from "antd";
import { Image } from "antd";
import moment from "moment";
import Geocode from "react-geocode";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/client";
import { DELETE_POST, MUTE_POST } from "../GraphQL/Mutations";
import { PostContext } from "../context/posts";

Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k");

Geocode.setLanguage("id");

export default function PhotoGalerry({ post, loading }) {
  const [address, setAddress] = useState("");
  const { user } = useContext(AuthContext);
  const postContext = useContext(PostContext);

  console.log(address);
  const [deletePost] = useMutation(DELETE_POST, {
    update(_, { data: { deletePost } }) {
      alert(deletePost);
      postContext.deletePost(post.id);
    },
  });

  const [mutePost] = useMutation(MUTE_POST, {
    update(_, { data: { mutePost } }) {
      postContext.mutePost(mutePost);
    },
  });

  const userName = user && user.username;

  useEffect(() => {
    if (post.location) {
      Geocode.fromLatLng(post.location.lat, post.location.lng).then(
        (response) => {
          const address = response.results[0].address_components[1].short_name;
          setAddress(address);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }, [post]);

  return (
    <List itemLayout="vertical" size="large">
      <List.Item>
                {post.media? (
                  post.media.length == 1? (
                    <Image
                      style={{ width: "100%", borderRadius: 10, objectFit: "cover" }}
                      src={post.media}
                    />
                  ) : null
                ) : null}

                {post.media? (
                  post.media.length == 2? (
                    <table className="row-card-2">
                      <Image.PreviewGroup>
                      <td style={{width:"50%"}}>
                      <Image
                      style={{borderRadius: "10px 0px 0px 10px"}}
                      src={post.media[0]}
                    />
                      </td>
                    <td>
                    <Image
                      style={{borderRadius: "0px 10px 10px 0px"}}
                      src={post.media[1]}
                    />
                    </td>
                    </Image.PreviewGroup>
                  </table>
                  ) : null
                ) : null}

                {post.media? (
                  post.media.length >= 3? (
                    <table className="photo-grid-3">
                      <Image.PreviewGroup>
                        <tbody>
                          <tr style={{margin: 0, padding: 0}}>
                            <td rowspan="2" style={{width: "50%", verticalAlign: 'top' }}>
                              <Image
                                className="pict1-3"
                                style={{borderRadius: "10px 0px 0px 10px"}}
                                src={post.media[0]}
                              />
                            </td>
                            <td style={{width: "50%"}}>
                              <Image
                                className="pict2-3"
                                style={{borderRadius: "0px 10px 0px 0px"}}
                                src={post.media[1]}
                              />
                              <div className="text-container" style={{ marginTop: '-6px'}}>
                                <Image
                                  className="pict3-3"
                                  style={post.media.length > 3? {borderRadius: "0px 0px 10px 0px", filter: "blur(2px)" }: {borderRadius: "0px 0px 10px 0px" }}
                                  src={post.media[2]}
                                />
                                <div className="text-center">{post.media.length > 3? ("+" +(post.media.length - 3)) : null}</div>
                              </div>
                            </td>
                          </tr>
                          {post.media.length > 3? (
                            <div>
                              <Image
                                className="pict3-3"
                                style={{display: "none"}}
                                src={post.media[3]}
                              />
                              {post.media.length > 4?(
                                <Image
                                className="pict3-3"
                                style={{display: "none"}}
                                src={post.media[4]}
                              />
                              ) : null}  
                            </div>
                            
                          ) : null }
                        </tbody>
                      </Image.PreviewGroup>
                    </table>
                  ) : null
                ) : null}

          {post.media ? (
          post.media.length >= 3 ? (
            <table className="photo-grid-3">
              <tbody>
                <tr>
                  <td rowSpan="2" style={{ width: "50%" }}>
                    <img
                      className="pict1-3"
                      src={post.media[0]}
                      style={{ borderRadius: "10px 0px 0px 10px" }}
                    />
                  </td>
                  <td style={{ width: "50%" }}>
                    <img
                      className="pict2-3"
                      src={post.media[1]}
                      style={{ borderRadius: "0px 10px 0px 0px" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "50%" }}>
                    <div className="text-container">
                      <img
                        className="pict3-3"
                        src={post.media[2]}
                        style={
                          post.media.length > 3
                            ? {
                                borderRadius: "0px 0px 10px 0px",
                                filter: "blur(2px)",
                              }
                            : { borderRadius: "0px 0px 10px 0px" }
                        }
                      />
                      <div className="text-center">
                        {post.media.length > 3
                          ? "+" + (post.media.length - 3)
                          : null}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : null
          ) : null}
      </List.Item>
    </List>
  );
}
