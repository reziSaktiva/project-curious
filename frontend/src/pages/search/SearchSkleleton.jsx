import { Skeleton } from "antd"
import MoreForYou from "./moreForYou"

const SearchSkeleton = () => {
    return (
             <>
            <div className="explore-place">
                <span className="title">Explore Place</span>
                <div className="list-place">
                <Skeleton.Input active style={{ width: 200, height: 180, borderRadius: "15px 15px 0 0", margin:"0 16px 16px 16px" }}/>
                <Skeleton.Input active style={{ width: 200, height: 180, borderRadius: "15px 15px 0 0", margin: "0 16px 16px 16px" }}/>
                <Skeleton.Input active style={{ width: 200, height: 180, borderRadius: "15px 15px 0 0", margin: "0 16px 16px 16px" }}/>
                </div>
            </div>

            <div className="popular-section">
                <MoreForYou />
            </div>
        </>

    );
}
 
export default SearchSkeleton;