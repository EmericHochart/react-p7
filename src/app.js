import React, { Component } from "react";
import "./css/App.css";
import MapGoogle from "./Component/MapGoogle";
import Liste from "./Component/Liste";
import Rating from "./Component/Rating";
import AddRestaurant from "./Component/AddRestaurant";
import geoMarker from "./assets/restaurant.png";
import newRestaurantMarker from "./assets/newRestaurant.png";

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
  
  _handleChange = restaurants => {
    // We recover the filtering data
    let filterMin = this.state.starCurrent.indexOf(true);
    let filterMax = this.state.starCurrent.lastIndexOf(true);
    let restaurantsFiltered = [];
    // We empty the markers
    this._clearMarkers();
    // If no star is selected, we display all the restaurants
    // otherwise we only display restaurants with an average between the filter terminals
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
    let tampon = null;
    let current = this.state.starCurrent;
    // If the star is on it is turned off or it is turned on
    current[index] === true
      ? (current[index] = false)
      : (current[index] = true);
    // Manage Filter
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
    // We recover the filtering data
    let filterMin = this.state.starCurrent.indexOf(true);
    let filterMax = this.state.starCurrent.lastIndexOf(true);
    // Check Restaurants displayed
    let restaurantsDisplayed = [...this.state.restaurantsDisplayed];
    let restaurantsFiltered = [];
    // If no star is selected, we display all the restaurants
    // otherwise we only display restaurants with an average between the filter terminals
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
    // We empty the markers
    this._clearMarkers();
    // Add a marker for each restaurant in the filtered list
    this._addMarker(restaurantsFiltered, this.state.map);
    this.setState({
      starCurrent: current,
      restaurantsFiltered: restaurantsFiltered
    });
  };

  _addRating = (comment, stars, lat, lng) => {
    let restaurants = this.state.restaurants;
    // We recover the restaurant thanks to these coordinates
    let index = this.state.restaurants.findIndex(restaurant => {
      if (restaurant.lat === lat && restaurant.long === lng) {
        return restaurant;
      }
    });
    // Then save the comment and note if the restaurant is in the list of restaurants
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
    // We use the geocoding API to retrieve the nearest address and we put a specific marker
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          let marker = new google.maps.Marker({
            position: {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            },
            map: map,
            animation: google.maps.Animation.DROP,
            icon: {
              url: newRestaurantMarker
            }
          });
          this.setState({
            displayAddRestaurant: true,
            map: map,
            newAddress: results[0].formatted_address,
            newName: "",
            newLat: results[0].geometry.location.lat(),
            newLng: results[0].geometry.location.lng(),
            markers: [...this.state.markers, marker]
          });
        } else {
          window.alert("Pas de résultat connu");
          let marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            animation: google.maps.Animation.DROP,
            icon: {
              url: newRestaurantMarker
            }
          });
          this.setState({
            displayAddRestaurant: true,
            map: map,
            newName: "",
            newAddress: "",
            newLat: lat,
            newLng: lng,
            markers: [...this.state.markers, marker]
          });
        }
      } else {
        window.alert("Echec du geocoder : " + status);
        let marker = new google.maps.Marker({
          position: { lat: lat, lng: lng },
          map: map,
          animation: google.maps.Animation.DROP,
          icon: {
            url: newRestaurantMarker
          }
        });
        this.setState({
          displayAddRestaurant: true,
          map: map,
          newName: "",
          newAddress: "",
          newLat: lat,
          newLng: lng,
          markers: [...this.state.markers, marker]
        });
      }
    });
  };

  _addNewRestaurant = (name, address, lat, lng) => {
    // We build the restaurant object
    let restaurant = {
      restaurantName: name,
      address: address,
      lat: lat,
      long: lng,
      ratings: []
    };
    // If the restaurant does not exist, add it otherwise it indicates that it already exists
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
    // If the restaurant is not in the list of restaurants, add it
    // TODO : code optimization
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
    // For each restaurant on the list, add a marker
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
    // The list of markers is updated
    this.setState({
      markers: markers,
      map: map
    });
  };

  _clearMarkers = () => {
    // Remove the markers from the map and update the list of markers
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
          <hr></hr>
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
        <footer>© 2019 Copyright <a href="https://emeric.hochart.info/">Emeric Hochart</a>
        </footer>
      </div>
    );
  }
}

export default App;
