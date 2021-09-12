import noPost from '../../assets/Noresults/ErrorNetworking.svg'
import AppBar from '../../components/AppBar';
const NoPost = () => {
    return (
        <div style={{height: "100%"}}>
            <AppBar title="Post" />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                <div className="network_img" />
                <h1>This post is no longer available or deleted</h1>
            </div>
        </div>
    )
}

export default NoPost;