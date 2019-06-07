import React, { Component } from "react";
import homeMarker from "../../assets/home.png";
import PropTypes from "prop-types";

class MapGoogle extends Component {
  static propTypes = {
    restaurants: PropTypes.array.isRequired,
    restaurantsDisplayed: PropTypes.array.isRequired,
    restaurantsFiltered: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    google: PropTypes.object,
    addRestaurant: PropTypes.func.isRequired,
    addRestaurantsAround: PropTypes.func.isRequired,
    addMarker: PropTypes.func.isRequired,
    clearMarkers: PropTypes.func.isRequired,
    markers: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      map: null,
      service: null,
      loaded: false,
      eventBounds: false
    };
  }

  handleBoundsChanged = event => {
    let map = this.state.map;
    let limite = map.getBounds();
    let restaurantsDisplayed = [];
    // Remove all Markers
    this.props.clearMarkers();
    // If the service is loaded, we call the proximitySearch method
    if (this.state.service && this.props.google) {
      let center = map.getCenter();
      let lat = center.lat();
      let lng = center.lng();
      let location = { lat: lat, lng: lng };
      // Request : find restaurant around location
      let request = {
        location: location,
        radius: "800",
        type: ["restaurant"]
      };
      this.state.service.nearbySearch(request, this.searchAround);
    }
    // We go through the list of restaurants
    this.props.restaurants.forEach(function(restaurant) {
      let coordRestaurant = { lat: restaurant.lat, lng: restaurant.long };
      // Display the restaurant in the list if it is on the map
      if (limite.contains(coordRestaurant)) {
        // Add the restaurant to the list of restaurants to display
        restaurantsDisplayed = [...restaurantsDisplayed, restaurant];
      }
    });
    // We list the list of restaurants to display
    this.props.handleChange(restaurantsDisplayed);
    // We add the markers filtered restaurants on the map
    this.props.addMarker(this.props.restaurantsFiltered, map);
  };

  searchAround = (results, status) => {
    const google = this.props.google;
    let restaurantsAround = [];
    // If the service is available
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // We go through the list
      for (let i = 0; i < results.length; i++) {
        restaurantsAround[i] = results[i];
      }
    }
    const service = this.state.service;
    const addRestaurantsAround = this.props.addRestaurantsAround;
    // For each restaurant around
    for (let i = 0; i < restaurantsAround.length; i++) {
      // Create Object Restaurant
      let restaurant = {};
      restaurant.restaurantName = restaurantsAround[i].name;
      restaurant.address = restaurantsAround[i].vicinity;
      restaurant.lat = restaurantsAround[i].geometry.location.lat();
      restaurant.long = restaurantsAround[i].geometry.location.lng();
      restaurant.ratings = [];
      // Request : Recovery of rewiews and ratings
      let request = {
        placeId: restaurantsAround[i].place_id,
        fields: ["reviews"]
      };
      service.getDetails(request, function(place, status) {
        // If the service is available
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // add condition on reviews
          let reviews =
            place.reviews !== null || !place.reviews ? place.reviews : [];
          if (reviews !== undefined) {
            reviews.forEach(function(review) {
              let view = {};
              view.stars = review.rating;
              view.comment = review.text;
              restaurant.ratings.push(view);
            });
          }
          // We add the restaurant
          addRestaurantsAround(restaurant);
        }
      });
    }
  };

  init() {
    // Initializing the map
    const google = this.props.google;
    // We create the map and center it on a default location
    let map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: 48.8737815, lng: 2.3501649 },
      mapTypeId: "roadmap"
    });
    // Information window type tooltip on the map
    let infoWindow = new google.maps.InfoWindow();
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Update of the popup
        infoWindow.setPosition(pos);
        infoWindow.setContent("Votre position");
        infoWindow.open(map);
        // We center the map on the user's position
        map.setCenter(pos);
        // We add a custom marker for the user's position
        new google.maps.Marker({
          position: pos,
          map: map,
          icon: {
            url: homeMarker
          }
        });        
      }, this.handleLocationError(true, infoWindow, map.getCenter()));
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, infoWindow, map.getCenter());
    }
    // Add event on click : addition of a restaurant
    map.addListener("click", e => {
      let lat = e.latLng.lat();
      let lng = e.latLng.lng();
      this.props.addRestaurant(lat, lng, this.state.map);
    });
    // Update local state
    this.setState({
      map: map,
      loaded: true,
      service: new google.maps.places.PlacesService(map)
    });
  }

  componentDidMount() {
    if (this.props.google && this.state.loaded === false) {
      this.init();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.state.map && this.state.eventBounds === false) {
      // We listen if the map moves to check
      const google = this.props.google;
      google.maps.event.addListener(
        this.state.map,
        "bounds_changed",
        this.handleBoundsChanged
      );
      this.setState({
        eventBounds: true
      });
    }
  }

  // Manage Location Error
  handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Erreur: le service de géolocalisation a échoué."
        : "Erreur: votre navigateur ne prend pas en charge la géolocalisation."
    );
    infoWindow.open(this.state.map);
  }

  render() {
    return <div id="map" />;
  }
}

export default MapGoogle;
