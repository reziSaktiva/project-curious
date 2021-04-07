import React, { useContext, useState } from 'react'
import {
    GoogleMap,
    useLoadScript,
    Marker,
    Circle
} from '@react-google-maps/api'

import { AuthContext } from '../context/auth'
import mapStyle from '../util/style/mapstyle'

import { Slider } from 'antd'

const libraries = ["places"]
const mapContainerStyle = {
    width: "100%",
    height: '75vh'
}
const options = {
    styles: mapStyle,
    disableDefaultUI: true,
    zoomControl: true
}

const Map = () => {
    const { user } = useContext(AuthContext)
    const position = user.location
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k",
        libraries,
    });

    const [radius, setRadius] = useState(1000)

    const marks = {
        20: "1km",
        40: "5km",
        60: "10km",
        80: "15km"
        }
    
    const onChangeSlider = (value) => {
        if(value <= 40){
            setRadius(1000)
        } else if (value <= 60){
            setRadius(5000)
        } else if (value <= 80){
            setRadius(10000)
        } else if (value <= 100){
            setRadius(15000)
        }
    }

    if (loadError) return 'Error loading page'
    if (!isLoaded) return 'Loading Maps'
    return (
        <div>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={16}
                center={position}
                options={options}>
                    <Marker 
                    position={position}
                    icon={{
                        url: 'https://firebasestorage.googleapis.com/v0/b/insvire-curious-app12.appspot.com/o/mapRadius%2Fpin-figma.png?alt=media&token=3d842f6c-3338-486c-8605-4940e05b96b6',
                        scaledSize: new window.google.maps.Size(15, 18)
                    }} 
                    />
                    <Circle 
                        center={position}
                        radius={radius}
                        options={{
                            fillColor: "#e8e2d8",
                            strokeColor: '#f6c059',
                            strokeWeight: 1
                        }}
                    />
            </GoogleMap>
            <Slider marks={marks} defaultValue={[0, 100]} onChange={onChangeSlider} tooltipVisible={false}/>
        </div>
    )
}

export default Map;