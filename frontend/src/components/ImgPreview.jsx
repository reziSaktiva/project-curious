import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { TagRemove } from "../library/Icon"

const ImgPreview = ({children, photo }) => {
    console.log(photo);
    const { setLoginLoader } = useContext(AuthContext)
    return (
        <div style={{
            position: 'fixed',
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0, 0.3)',
            zIndex: 200,
            top:0,
            left:0
        }}
        >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: "100%"}}>
                <div className="x_button" onClick={() => setLoginLoader(false)}>
                <TagRemove />
                </div>
                <div>
                {photo[0].split(".")[5].split("?")[0] === "mp4" ? (
            <video  onClick={() => setLoginLoader(true)} controls>
              <source src={photo[0]} />
            </video>
              ) : (
            <img
            onClick={() => setLoginLoader(true)}
             width={"100%"}
              style={{
                width: "100%",
                borderRadius: 10,
                objectFit: "cover",
                maxHeight: 300,
              }}
              src={photo[0]}
            />
              )}
                </div>
            
                </div>
        </div>
    );
}
 
export default ImgPreview;