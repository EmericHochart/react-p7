import React, { Component } from "react";

class Restaurant extends Component {
  render() {
    // Calcul de la moyenne des commentaires
    var averageRating = 0;
    var numberRatings = this.props.ratings.length;
    this.props.ratings.map(rating => (averageRating += rating.stars));
    numberRatings !== 0
      ? (averageRating = averageRating / numberRatings)
      : (averageRating = 0);
    // Filtered
    var filter = this.props.filter.map((val, i) => [i, val]).filter(x=>x[1]===true);    
    var filterMin = filter[0][0]+1;
    var filterMax = filter[filter.length-1][0]+1;    
    
    if (averageRating>=filterMin && averageRating<=filterMax) {
      return (<li>
        {this.props.name} : {averageRating}
      </li>);
    }
    else
    {return null;}
    
  }
}

export default Restaurant;
