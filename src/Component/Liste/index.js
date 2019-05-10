import React, { Component } from "react";
import Restaurant from "../Restaurant";

class Liste extends Component {
  render() {
    return (
      <div id="listeRestaurants">
        <h2>{this.props.nameList}</h2>
        <ul>
          {this.props.restaurants.map(restaurant => (
            <Restaurant
              name={restaurant.restaurantName}
              key={restaurant.restaurantName}
              ratings={restaurant.ratings}
            />
          ))}
        </ul>
      </div>
    );
  }
}

export default Liste;
