import React, { Component } from "react";
import PropTypes from "prop-types";

class MapGoogle extends Component {
  static propTypes = {
    restaurants: PropTypes.array.isRequired,
    restaurantsDisplayed: PropTypes.array.isRequired,
    restaurantsFiltered: PropTypes.array.isRequired,
    handleChange: PropTypes.func.isRequired,
    google: PropTypes.object,
    addRestaurant: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      map: null,
      loaded: false,
      eventBounds: false,
      markers: []
    };
  }

  // Sets the map on all markers in the array.
  setMapOnAll(map) {
    var markers = this.state.markers;
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  // Clear Markers
  clearMarkers() {
    this.setMapOnAll(null);
    this.setState({
      markers: []
    });
  }

  addMarker(restaurant) {
    var google = this.props.google;
    var map = this.state.map;
    var location = { lat: restaurant.lat, lng: restaurant.long };
    
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      animation: google.maps.Animation.DROP
    });    
    this.setState({
      markers: [...this.state.markers,marker]
    });
    //map.panTo(location);
    // A placer ailleurs !!!!!! sinon minor bug
  }

  handleBoundsChanged = event => {
    var map = this.state.map;
    var limite = map.getBounds();
    var restaurantDisplayed = [];
    var that = this;
    // Remove all Markers
    this.clearMarkers();

    // On parcourt la liste des restaurants
    this.props.restaurants.forEach(function(restaurant) {
      let coordRestaurant = { lat: restaurant.lat, lng: restaurant.long };
      // Affiche le restaurant dans la liste si celui-ci est sur la carte
      if (limite.contains(coordRestaurant)) {
        // On ajoute le restaurant dans la liste des restaurants à afficher
        restaurantDisplayed.push(restaurant);
      }
    });
    this.props.handleChange(restaurantDisplayed);
    this.props.restaurantsFiltered.forEach(function(restaurant) {
      that.addMarker(restaurant);
    });
  };

  init() {
    var google = this.props.google;
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: { lat: 48.8737815, lng: 2.3501649 },
      mapTypeId: "roadmap"
    });

    // Fenêtre d'information type tooltip sur la position géolocalisée de l'utilisateur
    var infoWindow = new google.maps.InfoWindow();

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
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
      var lat = e.latLng.lat();
      var lng = e.latLng.lng();
      this.props.addRestaurant(lat, lng);
    });

    this.setState({
      map: map,
      loaded: true
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
      let google = this.props.google;
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
