import React, { Component } from "react";

class Restaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapse: false
    };
  }

  collapse = () => {
    var collapse = this.state.isCollapse;
    collapse = !collapse;
    this.setState({
      isCollapse: collapse
    });
  };

  render() {
    // Calcul de la moyenne des commentaires
    var averageRating = 0;
    var numberRatings = this.props.ratings.length;
    this.props.ratings.map(rating => (averageRating += rating.stars));
    numberRatings !== 0
      ? (averageRating = averageRating / numberRatings)
      : (averageRating = 0);
    
    var location = this.props.lat+","+ this.props.lng;        
    var url = "https://maps.googleapis.com/maps/api/streetview?size=600x600&location="+location+"&key=APIKEY";

    return (
      <div>
        <br />
        <button
          className={
            this.state.isCollapse
              ? "collapsible trueCollapse"
              : "collapsible falseCollapse"
          }
          onClick={this.collapse}
        >
          {this.props.name} : {averageRating}
        </button>
        {this.state.isCollapse && (
          <div className="content">
            <p>{this.props.address}</p>
            <img src={url}></img>
            <ul>
              {this.props.ratings.map((rating, index) => (
                <li key={"star" + index}>
                  {rating.stars} : {rating.comment}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Restaurant;