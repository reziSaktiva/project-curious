import notFound_img from "../../assets/NoResults/No_posts.png"
const NotFound = () => {
    return (
        <div style={{display: 'flex', justifyContent: "center", alignItems: 'center', flexDirection: "column"}}>
            <img src={notFound_img} width={200} />
            <h1>Sorry but there is no related post</h1>
            <p>You can try another keyword anyway :)</p>
        </div>
    );
}
 
export default NotFound;