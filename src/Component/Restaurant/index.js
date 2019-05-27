import React, { Component } from "react";
import PropTypes from "prop-types";
import Rating from "../Rating";
import {MERCI_DE_METTRE_UN_COMMENTAIRE, API_KEY}  from "../../constants";

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
      valueTextArea: "Merci de donner un commentaire"
    };
  }

  collapse = () => {
    // Mise à jour de l'état local
    this.setState({
      isCollapse: !this.state.isCollapse,
      displayAddRating: 
        !this.state.displayAddRating && this.state.isCollapse
          ? true
          : false
    });
  };

  displayAddRating = () => {
    // Mise à jour de l'état local
    this.setState({
      displayAddRating: !this.state.displayAddRating
    });
  };

  rate = () => {
    // On récupère la valeur du textarea
    const comment =
      this.state.valueTextArea === MERCI_DE_METTRE_UN_COMMENTAIRE
        ? "Pas de commentaire"
        : this.state.valueTextArea;        
    // Si la première valeur de starCurrent est false alors stars = 0 sinon on récupère le dernier indice dont la valeur est true (remarque : index = -1 => stars = 0)
    const stars =
      this.state.starCurrent[0] === false
        ? 0
        : this.state.starCurrent.lastIndexOf(true) + 1;
    // On passe en paramètre le commentaire, la note et les coordonnées du restaurant
    this.props.addRating(comment, stars, this.props.lat, this.props.lng);
    // Mise à jour de l'état local
    this.setState({
      displayAddRating: !this.state.displayAddRating,
      valueTextArea: MERCI_DE_METTRE_UN_COMMENTAIRE
    });
  };

  handleRating = index => {
    // Mise à jour de l'état local
    // Si l'étoile était allumée, on l'éteint et on éteint les étoiles suivantes
    // Sinon l'étoile était éteinte, on l'allume et on allume les étoiles précédentes
    this.setState({
      starCurrent:
        this.state.starCurrent[index] === true
          ? this.state.starCurrent.fill(
              false,
              index,
              this.state.starCurrent.length
            )
          : this.state.starCurrent.fill(true, 0, index + 1)
    });
  };

  handleChangeTextArea = event => {
    // Mise à jour de l'état local
    this.setState({ valueTextArea: event.target.value });
  };

  render() {
    // Calcul de la moyenne des commentaires
    const numberRatings = this.props.ratings.length;
    let averageRating = 0;    
    this.props.ratings.map(rating => (averageRating += rating.stars));
    // On récupère les coordonnées
    const location = this.props.lat + "," + this.props.lng;
    // On récupère l'url de la photo google street view correspondant aux coordonnées
    let url =
      "https://maps.googleapis.com/maps/api/streetview?size=600x600&location=" +
      location +
      "&key="+API_KEY;

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
          {this.props.name} :{" "}
          {numberRatings !== 0 ? Math.round(averageRating / numberRatings*10) / 10 : "Pas d'avis"}
        </button>
        {this.state.isCollapse && !this.state.displayAddRating && (
          <div className="content">
            <p>
              {this.props.address} <br />{" "}
              <button onClick={this.displayAddRating}>Donner un avis</button>
            </p>

            <img src={url} alt={this.props.name} />
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
              <Rating
                min={this.state.starMin}
                max={this.state.starMax}
                current={this.state.starCurrent}
                onClick={this.handleRating}
              />
              <textarea
                value={this.state.valueTextArea}
                onChange={this.handleChangeTextArea}
              />
              <button onClick={this.rate}>Donner un avis</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Restaurant;
