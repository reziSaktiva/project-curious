import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { Slider } from 'antd'
import {
    GoogleMap,
    useLoadScript,
    Marker,
    Circle
} from '@react-google-maps/api'
import { Button } from 'antd';
import { AimOutlined, LeftOutlined } from '@ant-design/icons';

import { getRangeSearch } from '../../util/Session';

// Constant
import { LS_LOCATION, R_SEARCH } from '../../context/constant'
import { MAP_API_KEY } from '../../util/ConfigMap';

// Styles
import mapStyle from '../../util/style/mapstyle'
import './style.css';

const libraries = ["places"]
const mapContainerStyle = {
  width: "100%",
  height: '70vh'
}
const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true
}


const sliderValidator = () => {

  if ( !localStorage.getItem('rng') ) {
    return  0
  }
    if ( localStorage.getItem('rng') == 1 ) {
    return  0
  }
   if ( localStorage.getItem('rng') == 5 ) {
      return 33
  }
   if ( localStorage.getItem('rng') == 10 ) {
    return  66
  }
  if ( localStorage.getItem('rng') == 15 ) {
    return 100
  }
}
console.log(sliderValidator());

const MapHeader = props => {
  
  const { onSetCurrentLoc, onBack } = props;

  return (
    <div className="header-map">
      <LeftOutlined
        onClick={onBack}
        className="header-map__navigate-left"
      />
      <div className="header-map__title">Change Location</div>
      <AimOutlined
        onClick={onSetCurrentLoc}
        className="header-map__navigate-right"
      />
    </div>
    
  )
}

const Map = () => {
  
  const currentPosition = localStorage.location && JSON.parse(localStorage.location)
  
  const [position, setPosition] = useState(currentPosition);
  const history = useHistory();
  
  // Hooks Map
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: MAP_API_KEY,
    libraries,
  });

  const [radius, setRadius] = useState(1000)

  const marks = {
    0: "1km",
    33: "5km",
    66: "10km",
    100: "15km"
  }

  const handleBackPage = () => {
    history.push("/");
  };

  const setCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      localStorage.setItem(LS_LOCATION, JSON.stringify(location));
      setPosition(location);
    })
  }

  const oSaveRangePosts = () => {
    localStorage.setItem(R_SEARCH, radius / 1000);
    history.push("/");
  }
    
  const onChangeSlider = (value) => {
    let range = 1000
    if (value == 0) {
      range = 1000
    }  if (value == 33) {
      range = 5000
    }  if (value ==66) {
      range = 10000
    }  if (value == 100) {
      range = 15000
    }

    setRadius(range);
  }

  if (loadError) return 'Error loading page'
  if (!isLoaded) return 'Loading Maps'

  return (
      <div>
        <MapHeader
          onSetCurrentLoc={setCurrentLocation}
          onBack={handleBackPage}
        />
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={radius >= 15000 ? 11 : 15}
          center={position}
          options={options}>
          <Marker 
            position={position}
            icon={{
                url: 'https://firebasestorage.googleapis.com/v0/b/insvire-curious-app12.appspot.com/o/mapRadius%2Fpin-figma.png?alt=media&token=3d842f6c-3338-486c-8605-4940e05b96b6',
                scaledSize: new window.google.maps.Size(15, 18)
          }}/>
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
        <Slider
         style={{margin:"20px 40px 20px 40px"}} 
         marks={marks} 
         step={null} 
         defaultValue={sliderValidator()} 
         onChange={onChangeSlider} tooltipVisible={false}/>
        <div className="footer-map">
          <Button
            onClick={oSaveRangePosts}
            className="footer-map__btn-confirm btn-curious-colors"
            type="primary">
            Confirm
          </Button>
        </div>
      </div>
  )
}

export default Map;