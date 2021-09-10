import { useEffect } from 'react';
import noPost from '../../assets/Noresults/ErrorNetworking.svg'

const PageNotFound = (props) => {
    useEffect(() => {
        
        setTimeout(() => {
            props.history.push('/');
        }, 3000);

    }, [])
    
    return (
        <div style={{display: 'grid', placeItems: 'center', height: "100%", textAlign: 'center'}}>
            <div >
            <div className="network_img" />
            <h1>You seems lost, we will redirect you to homepage</h1>
            </div>
            
        </div>
    )
}

export default PageNotFound;