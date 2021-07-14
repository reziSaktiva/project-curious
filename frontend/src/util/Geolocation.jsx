import Geocode from "react-geocode";

// Initialize
Geocode.setApiKey("AIzaSyCbj90YrmUp3iI_L4DRpzKpwKGCFlAs6DA");
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