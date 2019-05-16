import React, { Component } from "react";
import PropTypes from "prop-types";
import Rating from "../Rating";

class Restaurant extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    ratings: PropTypes.array.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      isCollapse: false,
      displayAddRating: false,
      starCurrent: [false, false, false, false, false],
      starMin: 1,
      starMax: 5,
      valueTextArea: 'Merci de donner un commentaire'
    };
  }

  collapse = () => {
    var collapse = this.state.isCollapse;
    collapse = !collapse;
    var display = this.state.displayAddRating;
    if (display === true) {
      display = !display;
    }
    this.setState({
      isCollapse: collapse,
      displayAddRating: display
    });
  };

  displayAddRating = () => {
    var display = this.state.displayAddRating;
    display = !display;
    this.setState({
      displayAddRating: display
    });
  }

  rate = () => {
    var display = this.state.displayAddRating;
    display = !display;
    var comment = this.state.valueTextArea;
    comment = comment=='Merci de donner un commentaire'?'Pas de commentaire':comment;
    var current = this.state.starCurrent;
    var index = current[0]==false ? 0 : current.map((val, i) => [i, val]).filter(([i, val]) => val === true).pop()[0];
    // TO DO s'il n'existe pas de true !!!
    var stars = current[0]==false ? 0 : (index + 1);
    var lat = this.props.lat;
    var lng = this.props.lng;
   
    this.props.addRating(comment,stars,lat,lng);
    
    this.setState({
      displayAddRating: display,
      valueTextArea: 'Merci de donner un commentaire'
    });
  }

  handleRating = index => {
    var current = this.state.starCurrent;
    current[index]===true?current[index]=false:current[index]=true;
    
    if (current[index]===true) {
      for (let i=0; i<index;i++){
        current[i]=true;
        };
    }
    else {      
      for (let i=index; i<current.length;i++){
        current[i]= false;
      };
    };
        
    this.setState({
      starCurrent : current
    });

  }

  handleChangeTextArea = event => {
    this.setState({valueTextArea: event.target.value});
  }

  render() {
    // Calcul de la moyenne des commentaires
    var averageRating = 0;
    var numberRatings = this.props.ratings.length;
    this.props.ratings.map(rating => (averageRating += rating.stars));
    numberRatings !== 0
      ? (averageRating = averageRating / numberRatings)
      : (averageRating = 0);
    // On récupère les coordonnées
    var location = this.props.lat + "," + this.props.lng;
    // On récupère l'url de la photo google street view correspondant aux coordonnées
    var url =
      "https://maps.googleapis.com/maps/api/streetview?size=600x600&location=" +
      location +
      "&key=APIKEY";

    var current = this.state.starCurrent;
    var min = this.state.starMin;
    var max = this.state.starMax;

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
        {this.state.isCollapse && !this.state.displayAddRating && (
          <div className="content">
            <p>{this.props.address} <br></br> <button onClick={this.displayAddRating}>Donner un avis</button></p>
                        
            <img src={url} />
            <ul>
              {this.props.ratings.map((rating, index) => (
                <li key={"star" + index}>
                  {rating.stars} : {rating.comment}
                </li>
              ))}
            </ul>
          </div>
        )}
        {this.state.isCollapse && this.state.displayAddRating && (
          <div className="content">
            <div className="addRating">
              Merci de noter le restaurant :
              <Rating min={min} max={max} current={current} onClick={this.handleRating} />
              <textarea value={this.state.valueTextArea} onChange={this.handleChangeTextArea} />
              <button onClick={this.rate}>Donner un avis</button>
            </div> 
          </div>
        )}
              

      </div>
    );
  }
}

export default Restaurant;
