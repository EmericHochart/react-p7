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
    this.props.addNewRestaurant(this.props.name,this.props.address,this.props.lat,this.props.lng);
  }

  handleChangeName = (event) => {    
    this.props.changeName(event.target.value);
  }

  handleChangeAddress = (event) => {    
    this.props.changeAddress(event.target.value);
  }

  render() {
    return (
      <div id="addRestaurant">
        <h2>Ajouter un restaurant</h2>
        <p>Lat : {this.props.lat} | Lng : {this.props.lng}</p>
        <form id="formAddRestaurant" name="formAddRestaurant" onSubmit={this.submitNewRestaurant}>
          <p>
            <label htmlFor="form1">Nom du Restaurant : </label>
            <input type="text" id="addNameRestaurant" name="form1" value={this.props.name} onChange={this.handleChangeName} required></input>
          </p>
          <p>
            <label htmlFor="form2">Adresse du Restaurant : </label>
            <input type="text" id="addAddressRestaurant" name="form2" value={this.props.address} onChange={this.handleChangeAddress} required></input> 
          </p>
          <input id="submitRestaurant" type="submit" value="Ajouter"></input>         
        </form>
      </div>
    );
  }
}

export default AddRestaurant;
