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
    event.preventDefault();
    var name = this.state.valueName;
    var address = this.state.valueAddress;
    var lat = this.props.lat;
    var lng = this.props.lng;
    this.props.addNewRestaurant(name,address,lat,lng);
  }

  handleChangeName = (event) => {
    this.setState({valueName: event.target.value});
  }

  handleChangeAddress = (event) => {
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
