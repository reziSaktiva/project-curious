import React from 'react'

import {Image } from "antd";

export default function Photo({photo}) {

    return (
        <div style={{
          width: "100%",
        }}>
            {photo ? (
          photo.length == 1 ? (
            <div>
              {photo[0].split(".")[5].split("?")[0] === "mp4" ? (
                <video width={"100%"} height={400} controls>
              <source src={photo} />
            </video>
              ) : (
            <Image width={"100%"}
              style={{
                width: "100%",
                borderRadius: 10,
                objectFit: "cover",
                maxHeight: 300,
              }}
              src={photo}
            />
              )}
            </div>
            
            
          ) : null
        ) : null}

        {photo ? (
          photo.length == 2 ? (
            <table className="row-card-2">
              <tbody>
                <tr>
                  <Image.PreviewGroup>
                    <td style={{ width: "50%" }}>
                      {photo[0].split(".")[5].split("?")[0] === "mp4" ? (
                        <video width={"100%"} height={"100%"} style={{objectFit:"cover", height: '20%'}} controls>
                        <source src={photo[0]} />
                      </video>
                        
                      ) : (
                      <Image
                        style={{ borderRadius: "10px 0px 0px 10px" }}
                        src={photo[0]}
                      />
                      )}
                      
                    </td>
                    <td>
                      <Image
                        style={{ borderRadius: "0px 10px 10px 0px" }}
                        src={photo[1]}
                      />
                    </td>
                  </Image.PreviewGroup>
                </tr>
              </tbody>
            </table>
          ) : null
        ) : null}

{photo ? (
          photo.length >= 3 ? (
            <table className="photo-grid-3">
              <Image.PreviewGroup>
                <tbody>
                  <tr style={{ margin: 0, padding: 0 }}>
                    <td
                      rowspan="2"
                      style={{ width: "50%", verticalAlign: "top" }}
                    >
                      <Image
                        className="pict1-3"
                        style={{ borderRadius: "10px 0px 0px 10px" }}
                        src={photo[0]}
                      />
                    </td>
                    <td style={{ width: "50%" }}>
                      <Image
                        className="pict2-3"
                        style={{ borderRadius: "0px 10px 0px 0px" }}
                        src={photo[1]}
                      />
                      <div
                        className="text-container"
                        style={{ marginTop: "-6px" }}
                      >
                        <Image
                          className="pict3-3"
                          style={
                            photo.length > 3
                              ? {
                                  borderRadius: "0px 0px 10px 0px",
                                  filter: "blur(2px)",
                                }
                              : { borderRadius: "0px 0px 10px 0px" }
                          }
                          src={photo[2]}
                        />
                        <div className="text-center">
                          {photo.length > 3
                            ? "+" + (photo.length - 3)
                            : null}
                        </div>
                      </div>
                    </td>
                  </tr>
                  {photo.length > 3 ? (
                    <div>
                      <Image
                        className="pict3-3"
                        style={{ display: "none" }}
                        src={photo[3]}
                      />
                      {photo.length > 4 ? (
                        <Image
                          className="pict3-3"
                          style={{ display: "none" }}
                          src={photo[4]}
                        />
                      ) : null}
                    </div>
                  ) : null}
                </tbody>
              </Image.PreviewGroup>
            </table>
          ) : null
        ) : null}
        </div>
    )
}