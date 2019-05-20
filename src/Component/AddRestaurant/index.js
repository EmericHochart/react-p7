import React, { Component } from "react";

class AddRestaurant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueName: '',
      valueAddress: ''
    }
  }
  
  submitNewRestaurant = (event) => {
    //  On annule l'action implicite d'envoi au serveur du formulaire concerné.
    event.preventDefault();
    // On envoie en paramètre les coordonnées et les valeurs du formulaire    
    this.props.addNewRestaurant(this.state.valueName,this.state.valueAddress,this.props.lat,this.props.lng);
  }

  handleChangeName = (event) => {
    // Mise à jour de l'état local
    this.setState({valueName: event.target.value});
  }

  handleChangeAddress = (event) => {
    // Mise à jour de l'état local
    this.setState({valueAddress: event.target.value});
  }

  render() {
    return (
      <div id="addRestaurant">
        <h2>Ajouter un restaurant</h2>
        <p>Lat : {this.props.lat} | Lng : {this.props.lng}</p>
        <form id="formAddRestaurant" name="formAddRestaurant" onSubmit={this.submitNewRestaurant}>
          <p>
            <label htmlFor="form1">Nom du Restaurant : </label>
            <input type="text" id="addNameRestaurant" name="form1" value={this.state.valueName} onChange={this.handleChangeName} required></input>
          </p>
          <p>
            <label htmlFor="form2">Adresse du Restaurant : </label>
            <input type="text" id="addAddressRestaurant" name="form2" value={this.state.valueAddress} onChange={this.handleChangeAddress} required></input> 
          </p>
          <input id="submitRestaurant" type="submit" value="Ajouter"></input>         
        </form>
      </div>
    );
  }
}

export default AddRestaurant;
