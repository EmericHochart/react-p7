import React, { Component } from "react";
import "./css/App.css";
import MapGoogle from "./Component/MapGoogle";
import Liste from "./Component/Liste";
import Rating from "./Component/Rating";
import AddRestaurant from "./Component/AddRestaurant";
import geoMarker from "./assets/restaurant.png";

var data = require("./data/restaurant.json");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: data,
      restaurantsDisplayed: [],
      restaurantsFiltered: [],
      starMin: 1,
      starMax: 5,
      starCurrent: [false, false, false, false, false],
      google: null,
      loaded: false,
      displayAddRestaurant: false,
      map: null,
      newName: null,
      newAddress: null,
      newLat: null,
      newLng: null,
      markers: []
    };
  }

  // Arrow fx for binding
  _handleChange = restaurants => {
    let filterMin = this.state.starCurrent.indexOf(true);
    let filterMax = this.state.starCurrent.lastIndexOf(true);
    let restaurantsFiltered = [];

    this._clearMarkers();

    if (filterMin === -1) {
      this.setState({
        restaurantsDisplayed: restaurants,
        restaurantsFiltered: restaurants
      });
    } else {
      restaurants.map(restaurant => {
        // Calcul de la moyenne des commentaires
        let averageRating = 0;
        let numberRatings = restaurant.ratings.length;
        restaurant.ratings.map(rating => (averageRating += rating.stars));
        numberRatings !== 0
          ? (averageRating = averageRating / numberRatings)
          : (averageRating = 0);
        if (averageRating >= filterMin + 1 && averageRating <= filterMax + 1) {
          restaurantsFiltered = [...restaurantsFiltered, restaurant];
        }
      });
      this.setState({
        restaurantsDisplayed: restaurants,
        restaurantsFiltered: restaurantsFiltered
      });
    }
  };

  handleFilter = index => {
    // Manage Filter
    let tampon = null;
    let current = this.state.starCurrent;
    current[index] === true
      ? (current[index] = false)
      : (current[index] = true);

    if (current[index] === true) {
      current.indexOf(true) < index
        ? current.fill(true, current.indexOf(true), index)
        : current.lastIndexOf(true) > index
        ? current.fill(true, index, current.lastIndexOf(true))
        : (tampon = null);
    } else {
      current.indexOf(true) < index && current.indexOf(true) > -1
        ? current.fill(false, index)
        : (tampon = null);
    }

    // Filtered
    let filterMin = this.state.starCurrent.indexOf(true);
    let filterMax = this.state.starCurrent.lastIndexOf(true);
    // Check Restaurants displayed
    let restaurantsDisplayed = [...this.state.restaurantsDisplayed];
    let restaurantsFiltered = [];
    // Cas Particulier : on affiche tous les restaurants même ceux avec une note égale à 0
    if (filterMin === -1) {
      restaurantsFiltered = restaurantsDisplayed;
    } else {
      restaurantsDisplayed.map(restaurant => {
        // Calcul de la moyenne des commentaires
        let averageRating = 0;
        let numberRatings = restaurant.ratings.length;
        restaurant.ratings.map(rating => (averageRating += rating.stars));
        numberRatings !== 0
          ? (averageRating = averageRating / numberRatings)
          : (averageRating = 0);
        if (averageRating >= filterMin + 1 && averageRating <= filterMax + 1) {
          restaurantsFiltered = [...restaurantsFiltered, restaurant];
        }
      });
    }
    this._clearMarkers();
    this._addMarker(restaurantsFiltered, this.state.map);
    this.setState({
      starCurrent: current,
      restaurantsFiltered: restaurantsFiltered
    });
  };

  _addRating = (comment, stars, lat, lng) => {
    let restaurants = this.state.restaurants;
    let index = this.state.restaurants.findIndex(restaurant => {
      if (restaurant.lat === lat && restaurant.long === lng) {
        return restaurant;
      }
    });
    index === -1
      ? console.log("restaurant inexistant")
      : restaurants[index].ratings.push({ stars: stars, comment: comment });
    this.setState({
      restaurants: restaurants
    });
  };

  _addRestaurant = (lat, lng, map) => {
    const google = this.state.google;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          this.setState({
            displayAddRestaurant: true,
            map: map,
            newAddress: results[0].formatted_address,
            newName: "",
            newLat: results[0].geometry.location.lat(),
            newLng: results[0].geometry.location.lng()
          });
        } else {
          window.alert("Pas de résultat connu");
          this.setState({
            displayAddRestaurant: true,
            map: map,
            newName: "",
            newAddress: "",
            newLat: lat,
            newLng: lng
          });
        }
      } else {
        window.alert("Echec du geocoder : " + status);
        this.setState({
          displayAddRestaurant: true,
          map: map,
          newName: "",
          newAddress: "",
          newLat: lat,
          newLng: lng
        });
      }
    });
  };

  _addNewRestaurant = (name, address, lat, lng) => {
    // On construit l'objet restaurant
    let restaurant = {
      restaurantName: name,
      address: address,
      lat: lat,
      long: lng,
      ratings: []
    };

    // Si le restaurant n'existe pas, on l'ajoute sinon on indique qu'il existe déjà
    this.state.restaurants.findIndex(item => {
      if (item.restaurantName === name && item.address === address) {
        return item;
      }
    }) === -1
      ? this.setState({
          displayAddRestaurant: false,
          restaurants: [...this.state.restaurants, restaurant],
          restaurantsDisplayed: [
            ...this.state.restaurantsDisplayed,
            restaurant
          ],
          restaurantsFiltered: [...this.state.restaurantsDisplayed, restaurant],
          starCurrent: [false, false, false, false, false]
        })
      : this.setState({
          displayAddRestaurant: false
        });
  };

  _addRestaurantsAround = restaurant => {
    let restaurantExist = false;
    this.state.restaurants.forEach(function(item) {
      if (item.lat === restaurant.lat && item.long === restaurant.long) {
        restaurantExist = true;
      }
    });
    if (restaurantExist === false) {
      this.setState({
        restaurants: [...this.state.restaurants, restaurant]
      });
    }
  };

  _changeName = value => {
    this.setState({ newName: value });
  };

  _changeAddress = value => {
    this.setState({ newAddress: value });
  };

  _cancelAdd = () => {
    this.setState({
      displayAddRestaurant: false
    });
  };

  _addMarker = (restaurants, map) => {
    const google = this.state.google;
    let markers = [];
    restaurants.map(restaurant => {
      let location = { lat: restaurant.lat, lng: restaurant.long };
      let marker = new google.maps.Marker({
        position: location,
        map: map,
        animation: google.maps.Animation.DROP,
        icon: {
          url: geoMarker
        }
      });
      markers = [...markers, marker];
    });
    this.setState({
      markers: markers,
      map: map
    });
  };

  _clearMarkers = () => {
    let markers = this.state.markers;
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    this.setState({
      markers: []
    });
  };

  componentDidMount() {
    this.setState({
      google: window.google
    });
  }

  componentDidUpdate(prevState) {
    if (window.google !== prevState.google && this.state.loaded === false) {
      this.setState({
        loaded: true
      });
    }
  }

  render() {
    return (
      <div>
        <header>
          <h1>Greedy POV</h1>
        </header>
        <main>
          {this.state.loaded && (
            <MapGoogle
              google={this.state.google}
              map={this.state.map}
              restaurants={this.state.restaurants}
              restaurantsDisplayed={this.state.restaurantsDisplayed}
              restaurantsFiltered={this.state.restaurantsFiltered}
              handleChange={this._handleChange}
              addRestaurant={this._addRestaurant}
              addRestaurantsAround={this._addRestaurantsAround}
              addMarker={this._addMarker}
              clearMarkers={this._clearMarkers}
              markers={this.state.markers}
            />
          )}

          <Rating
            min={this.state.starMin}
            max={this.state.starMax}
            current={this.state.starCurrent}
            onClick={this.handleFilter}
          />

          {this.state.displayAddRestaurant ? (
            <AddRestaurant
              lat={this.state.newLat}
              lng={this.state.newLng}
              address={this.state.newAddress}
              name={this.state.newName}
              changeName={this._changeName}
              changeAddress={this._changeAddress}
              addNewRestaurant={this._addNewRestaurant}
              cancelAdd={this._cancelAdd}
            />
          ) : (
            <Liste
              nameList="Liste des Restaurants"
              restaurants={this.state.restaurantsFiltered}
              addRating={this._addRating}
            />
          )}
        </main>
      </div>
    );
  }
}

export default App;
