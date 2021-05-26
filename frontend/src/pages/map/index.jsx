import React, { useState } from 'react'
import {
    GoogleMap,
    useLoadScript,
    Marker,
    Circle
} from '@react-google-maps/api'
import { Button } from 'antd';
import { AimOutlined, LeftOutlined } from '@ant-design/icons';

import mapStyle from '../../util/style/mapstyle'

import { Slider } from 'antd'

import './style.css';

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
  const position = JSON.parse(localStorage.location)
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
    let range = 1000

    if (value <= 60) {
      range = 5000
    } else if (value <= 80) {
      range = 10000
    } else if (value <= 100) {
      range = 15000
    }

    setRadius(range);
  }

  if (loadError) return 'Error loading page'
  if (!isLoaded) return 'Loading Maps'

  return (
      <div>
        <MapHeader
          onSetCurrentLoc={() => {}}
          onBack={() => {}}
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
        <Slider marks={marks} defaultValue={[0, 100]} onChange={onChangeSlider} tooltipVisible={false}/>
        <div className="footer-map">
          <Button className="footer-map__btn-confirm btn-curious-colors" type="primary" >Confirm</Button>
        </div>
      </div>
  )
}

export default Map;