import React, { Component } from "react";
import Restaurant from "../Restaurant";

class Liste extends Component {
  render() {
    return (
      <div id="listeRestaurants">
        <h2>{this.props.nameList}</h2>

        {this.props.restaurants.map(restaurant => (
          <Restaurant
            name={restaurant.restaurantName}
            address={restaurant.address}
            key={restaurant.restaurantName}
            ratings={restaurant.ratings}
            lat={restaurant.lat}
            lng={restaurant.long}
          />
        ))}
      </div>
    );
  }
}

export default Liste;
