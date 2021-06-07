import Geocode from "react-geocode";

// Initialize
Geocode.setApiKey("AIzaSyBM6YuNkF6yev9s3XpkG4846oFRlvf2O1k");
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