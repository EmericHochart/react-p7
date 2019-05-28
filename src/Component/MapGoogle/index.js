import React, { Component } from "react";
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

    // Si le service est chargé, on appelle la méthode nearbySearch
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

    // On parcourt la liste des restaurants
    this.props.restaurants.forEach(function(restaurant) {
      let coordRestaurant = { lat: restaurant.lat, lng: restaurant.long };
      // Affiche le restaurant dans la liste si celui-ci est sur la carte
      if (limite.contains(coordRestaurant)) {
        // On ajoute le restaurant dans la liste des restaurants à afficher
        restaurantsDisplayed = [...restaurantsDisplayed, restaurant];
      }
    });

    this.props.handleChange(restaurantsDisplayed);

    this.props.addMarker(this.props.restaurantsFiltered, map);
  };

  searchAround = (results, status) => {
    const google = this.props.google;

    let restaurantsAround = [];

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // We go through the list
      for (let i = 0; i < results.length; i++) {
        restaurantsAround[i] = results[i];
      }
    }

    const service = this.state.service;
    const addRestaurantsAround = this.props.addRestaurantsAround;

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
          addRestaurantsAround(restaurant);
        }
      });
    }
  };

  init() {
    const google = this.props.google;
    let map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: 48.8737815, lng: 2.3501649 },
      mapTypeId: "roadmap"
    });

    // Fenêtre d'information type tooltip sur la position géolocalisée de l'utilisateur
    let infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Informations du petit popup
        infoWindow.setPosition(pos);
        infoWindow.setContent("Votre position");
        infoWindow.open(map);

        // On centre la map sur la position de l'utilisateur
        map.setCenter(pos);

        // Marker pour la position de l'utilisateur avec marker personnalisé
        new google.maps.Marker({
          position: pos,
          map: map,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/grn-pushpin.png"
          }
        });
        ////////////////////////////////////////////
      }, this.handleLocationError(true, infoWindow, map.getCenter()));
    } else {
      // Browser doesn't support Geolocation
      this.handleLocationError(false, infoWindow, map.getCenter());
    }

    // Add event on click
    map.addListener("click", e => {
      let lat = e.latLng.lat();
      let lng = e.latLng.lng();
      this.props.addRestaurant(lat, lng, this.state.map);
    });

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
      // On écoute si la map bouge pour vérifier
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
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(this.state.map);
  }

  render() {
    return <div id="map" />;
  }
}

export default MapGoogle;
