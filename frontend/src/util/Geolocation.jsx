import Geocode from "react-geocode";
import { MAP_API_KEY } from './ConfigMap'

// Initialize
Geocode.setApiKey(MAP_API_KEY);
Geocode.setLanguage("id");

const getAddress = ({ lat, lng }) => {
  Geocode.fromLatLng(lat, lng).then(
    (response) => {
      console.log('address: ', response.results[0])
      const address = response.results[0].address_components[1].short_name;

      return address;
    }
  ).catch(
    err => {
      return err;
    }
  )
}

export default {
  getAddress
}