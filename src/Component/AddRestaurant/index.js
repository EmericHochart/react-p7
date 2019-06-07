import React, { Component } from "react";
import PropTypes from "prop-types";

class AddRestaurant extends Component {
  static propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    changeName: PropTypes.func.isRequired,
    changeAddress: PropTypes.func.isRequired,
    addNewRestaurant: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      valueName: '',
      valueAddress: ''
    }
  }
  
  submitNewRestaurant = (event) => {
    //  We cancel the implicit action of sending to the server of the concerned form
    event.preventDefault();
    const {name,address,lat,lng} = this.props;
    // We send as parameter the coordinates and values ​​of the form   
    this.props.addNewRestaurant(name,address,lat,lng);
  }

  handleChangeName = (event) => {    
    this.props.changeName(event.target.value);
  }

  handleChangeAddress = (event) => {    
    this.props.changeAddress(event.target.value);
  }

  handleClick = (event) => {
    event.stopPropagation();
    this.props.cancelAdd();
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
        <button onClick={this.handleClick}>Annuler</button> 
      </div>
    );
  }
}
// TODO PropTypes
export default AddRestaurant;
