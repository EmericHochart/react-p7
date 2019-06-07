import React from "react";
import Restaurant from "../Restaurant";

const Liste = (props) => (
<div id="listeRestaurants">
        <h2>{props.nameList}</h2>
        {props.restaurants.map(restaurant => (          
          <Restaurant
            name={restaurant.restaurantName}
            address={restaurant.address}
            key={restaurant.lat+":"+restaurant.long}
            ratings={restaurant.ratings}
            lat={restaurant.lat}
            lng={restaurant.long}
            addRating={props.addRating}
          />
        ))}
      </div>
);
// TODO PropTypes
export default Liste;
