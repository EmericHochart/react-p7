import React, { Component } from "react";
import "./css/App.css";
import MapGoogle from "./Component/MapGoogle";
import Liste from "./Component/Liste";
import Rating from "./Component/Rating";
import AddRestaurant from "./Component/AddRestaurant";

//import "whatwg-fetch";*/

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
      starCurrent: [true, true, true, true, true],
      google: null,
      loaded: false,
      displayAddRestaurant: false,
      newLat: null,
      newLng: null
    };
  }

  // Arrow fx for binding
  _handleChange = restaurants => {
    // Filtered
    var filter = this.state.starCurrent
      .map((val, i) => [i, val])
      .filter(x => x[1] === true);
    var filterMin = filter.length === 0 ? 0 : filter[0][0] + 1;
    var filterMax = filter.length === 0 ? 0 : filter[filter.length - 1][0] + 1;
    let restaurantsFiltered = [];
    if (filter.length === 5) {      
      restaurantsFiltered = restaurants;
    } else {
      restaurants.map(restaurant => {
        // Calcul de la moyenne des commentaires
        let averageRating = 0;
        let numberRatings = restaurant.ratings.length;
        restaurant.ratings.map(rating => (averageRating += rating.stars));
        numberRatings !== 0
          ? (averageRating = averageRating / numberRatings)
          : (averageRating = 0);

        if (averageRating >= filterMin && averageRating <= filterMax) {
          restaurantsFiltered.push(restaurant);
        }
      });
    };

    // On met à jour la liste des restaurants à afficher
    this.setState({
      restaurantsDisplayed: restaurants,
      restaurantsFiltered: restaurantsFiltered
    });
  };

  handleFilter = index => {
    let current = this.state.starCurrent;
    current[index] === true
      ? (current[index] = false)
      : (current[index] = true);

    if (current[index] === true) {
      let isExistTrue = false;
      for (let i = 0; i < index; i++) {
        if (current[i] === true || isExistTrue === true) {
          current[i] = true;
          isExistTrue = true;
        }
      }
      if (isExistTrue === false) {
        for (let i = current.length - 1; i > index; i--) {
          if (current[i] === true || isExistTrue === true) {
            current[i] = true;
            isExistTrue = true;
          }
        }
      }
    } else {
      var isExistTrue = false;
      for (let i = 0; i < index; i++) {
        if (current[i] === true) {
          isExistTrue = true;
        }
      }
      if (isExistTrue === true) {
        for (let i = index; i < current.length; i++) {
          current[i] = false;
        }
      }
    }

    // Filtered
    var filter = current.map((val, i) => [i, val]).filter(x => x[1] === true);
    var filterMin = filter.length === 0 ? 0 : filter[0][0] + 1;
    var filterMax = filter.length === 0 ? 0 : filter[filter.length - 1][0] + 1;
    // Check Restaurants displayed
    let restaurantsDisplayed = this.state.restaurantsDisplayed;
    let restaurantsFiltered = [];    
    // Cas Particulier : on affiche tous les restaurants même ceux avec une note égale à 0
    if (filter.length === 5) {      
      restaurantsFiltered = this.state.restaurantsDisplayed;
    } else {
      restaurantsDisplayed.map(restaurant => {
        // Calcul de la moyenne des commentaires
        let averageRating = 0;
        let numberRatings = restaurant.ratings.length;
        restaurant.ratings.map(rating => (averageRating += rating.stars));
        numberRatings !== 0
          ? (averageRating = averageRating / numberRatings)
          : (averageRating = 0);
        // Fix Restaurants with 0 ratings

        if (averageRating >= filterMin && averageRating <= filterMax) {
          restaurantsFiltered.push(restaurant);
        }
      });
    }
    this.setState({
      starCurrent: current,
      restaurantsFiltered: restaurantsFiltered
    });
  };

  _addRating = (comment, stars, lat, lng) => {
    var restaurants = this.state.restaurants;

    function isLocation(restaurant) {
      if (restaurant.lat === lat && restaurant.long === lng) {
        return restaurant;
      }
    }

    var index = restaurants.findIndex(isLocation);
    restaurants[index].ratings.push({ stars: stars, comment: comment });
  };

  _addRestaurant = (lat, lng) => {
    this.setState({
      displayAddRestaurant: true,
      newLat: lat,
      newLng: lng
    });
  };

  _addNewRestaurant = (name, address, lat, lng) => {
    var restaurant = {
      restaurantName: name,
      address: address,
      lat: lat,
      long: lng,
      ratings: []
    };
    var restaurants = this.state.restaurants;
    var restaurantsDisplayed = this.state.restaurantsDisplayed;
    var isRestaurantExist = false;
    restaurants.map(item => {
      if (item.restaurantName === name && item.address === address) {
        isRestaurantExist = true;
      }
    });
    if (isRestaurantExist === false) {
      restaurants.push(restaurant);
      restaurantsDisplayed.push(restaurant);
    } else {
      console.log("restaurant existant");
    }

    this.setState({
      displayAddRestaurant: false,
      restaurants: restaurants,
      restaurantsDisplayed: restaurantsDisplayed,
      restaurantsFiltered: restaurantsDisplayed,
      starCurrent: [true, true, true, true, true]
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
              restaurants={this.state.restaurants}
              restaurantsDisplayed={this.state.restaurantsDisplayed}
              restaurantsFiltered={this.state.restaurantsFiltered}
              handleChange={this._handleChange}
              addRestaurant={this._addRestaurant}
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
              addNewRestaurant={this._addNewRestaurant}
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
