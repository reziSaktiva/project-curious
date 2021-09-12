import { Image } from "antd";
import cn from "classnames";
import IconCrash from "../../assets/ic-crash.png";
const styleState = {
    gallery__img : {
        borderRadius: 20,
        width: "100%",
        height: "100%",
        objectFit: "cover"
      },
      gallery_item_right : {
        borderRadius: 20,
        width: "100%",
        height: "100%",
        objectFit: "cover",

        gridColumnStart: 2,
        gridColumnEnd: 3,
        gridRowStart: 1,
        gridRowEnd: 3
      },
      gallery_item_left : {
        borderRadius: 20,
        width: "100%",
        height: "100%",
        objectFit: "cover",

        gridColumnStart: 1,
        gridColumnEnd: 2,
        gridRowStart: 2,
        gridRowEnd: 4
      }
}
const {gallery__img, gallery_item_left, gallery_item_right} = styleState
const Media = ({gallery}) => {
    return (  
        gallery.map((media) => (
            
            <div className="gallery">
              {media.length &&
                media.map((photo, idx) => {
                   const filter = photo.media.filter((data) => !(data.split(".")[5].split("?")[0] === "mp4"))
                  const result = filter.map((media) => {
                    const imgClass = cn({
                      gallery_item_right: idx === 1,
                      gallery_item_left: idx === 2,
                      gallery__img: idx != 1 || idx != 2,
                    });
                    return <Image
                      key={`Media${idx}`}
                      src={media}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = IconCrash;
                      }}
                      
                      style={idx === 1 ?(
                        gallery_item_right
                      ) : (
                        idx === 2 ? (
                            gallery_item_left
                            ) : (
                                gallery__img
                            )
                      )}
                      alt={`Image ${idx}`}
                    />
                    
                  })
                  return (
                    result
                  )
                })}
            </div>
          ))
    )
}
 
export default Media;