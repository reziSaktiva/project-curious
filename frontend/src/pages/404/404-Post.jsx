import noPost from '../../assets/Noresults/ErrorNetworking.svg'
const NoPost = () => {
    return (
        <div style={{display: 'flex',justifyContent: 'center', alignItems: 'center', flexDirection: 'column',height: "100vh", textAlign:'center'}}>
            <img src={noPost} />
            <h1>This post is no longer available or deleted</h1>
        </div>
    )
}
 
export default NoPost;