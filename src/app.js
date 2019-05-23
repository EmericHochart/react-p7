import React, { Component } from "react";
import "./css/App.css";
import MapGoogle from "./Component/MapGoogle";
import Liste from "./Component/Liste";
import Rating from "./Component/Rating";
import AddRestaurant from "./Component/AddRestaurant";

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
      newName: null,
      newAddress: null,      
      newLat: null,
      newLng: null
    };
  }

  // Arrow fx for binding
  _handleChange = (restaurants) => {
    let filterMin = this.state.starCurrent.indexOf(true);
    let filterMax = this.state.starCurrent.lastIndexOf(true);
    let restaurantsFiltered = [];
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
        if (
          averageRating >= filterMin + 1 && averageRating <= filterMax + 1 
        ) {
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
      let isExistTrue = false;
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
    let filterMin = this.state.starCurrent.indexOf(true);
    let filterMax = this.state.starCurrent.lastIndexOf(true);    
    // Check Restaurants displayed
    let restaurantsDisplayed = this.state.restaurantsDisplayed;
    let restaurantsFiltered = [];
    // Cas Particulier : on affiche tous les restaurants même ceux avec une note égale à 0    
    if (filterMin === -1) {
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

        if ((averageRating >= filterMin + 1)  && (averageRating <= filterMax + 1)) {
          restaurantsFiltered = [...restaurantsFiltered,restaurant];
        }
      });
    }
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

  _addRestaurant = (lat, lng) => {
    let that=this;
    let google = this.state.google;
    let geocoder = new google.maps.Geocoder;
    let latLng={lat:lat,lng:lng};
    geocoder.geocode({'location': latLng}, function(results, status) {      
      if (status === 'OK') {
        if (results[0]) {          
          that.setState({
            displayAddRestaurant: true,
            newAddress: results[0].formatted_address,
            newName: '',      
            newLat: results[0].geometry.location.lat(),
            newLng: results[0].geometry.location.lng()
          });
        } else {
          window.alert('Pas de résultat connu');
          that.setState({
            displayAddRestaurant: true, 
            newName: '',
            newAddress: '',     
            newLat: lat,
            newLng: lng
          });          
        }
      } else {
        window.alert('Echec du geocoder : ' + status);
        that.setState({
          displayAddRestaurant: true,
          newName: '', 
          newAddress: '',     
          newLat: lat,
          newLng: lng
        });
      };      
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
          starCurrent: [true, true, true, true, true]
        })
      : console.log("restaurant existant");
  };

  _addRestaurantsAround = (restaurant) => {
    let restaurantExist = false;
    this.state.restaurants.forEach(function(item) {
      if( item.lat === restaurant.lat && item.long === restaurant.long ){
        restaurantExist = true;
      }
    });
    if (restaurantExist === false) {
      this.setState({
      restaurants: [...this.state.restaurants,restaurant]
      })
    }   
    
  }

  _changeName = (value) => {
    this.setState({newName:value})
  }

  _changeAddress = (value) => {
    this.setState({newAddress:value})
  }

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
              addRestaurantsAround={this._addRestaurantsAround}
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
