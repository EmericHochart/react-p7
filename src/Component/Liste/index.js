import React, { Component } from "react";
import Restaurant from "../Restaurant";

class Liste extends Component {
  
  addRating = (comment, stars, lat, lng) => {      
    this.props.addRating(comment,stars,lat,lng);
  }
  
  render() {
    return (
      <div id="listeRestaurants">
        <h2>{this.props.nameList}</h2>

        {this.props.restaurants.map(restaurant => (          
          <Restaurant
            name={restaurant.restaurantName}
            address={restaurant.address}
            key={restaurant.lat+":"+restaurant.long}
            ratings={restaurant.ratings}
            lat={restaurant.lat}
            lng={restaurant.long}
            addRating={this.addRating}
          />
        ))}
      </div>
    );
  }
}

export default Liste;
