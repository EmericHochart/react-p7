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

    return (
      <li>
        {this.props.name} : {averageRating}
      </li>
    );
  }
}

export default Restaurant;
