import React, { Component } from "react";
import "../../css/App.css";
import MapGoogle from "../MapGoogle";
import Liste from "../Liste";
import StarRating from "../StarRating";

//import "whatwg-fetch";*/




var data = require("../../data/restaurant.json");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: data,
      restaurantsDisplayed: [],
      starMin: 1,
      starMax: 5,
      starCurrent : [true,true,true,false,false],
      google: null,
      loaded: false      
    };    
  }
  
  // Arrow fx for binding
  _handleChange = (restaurants) => {    
    // On met à jour la liste des restaurants à afficher
    this.setState({
      restaurantsDisplayed: restaurants
    })
  }

  // VERIFIER ICI L'UTILITE ET LA PERTINENCE
  componentDidMount() {
      
    this.setState({
      google: window.google
    })
  }

  componentDidUpdate(prevState) {
    
    if(window.google !== prevState.google && this.state.loaded === false) {
      
      this.setState({
        loaded: true
      })
    }
  }

  

  render() {
    
    return (
      
      <div>
        <header>
          <h1>Greedy POV</h1>
        </header>
        <main>
            
          {this.state.loaded && <MapGoogle google={this.state.google} restaurants={this.state.restaurants} handleChange={this._handleChange}/>}
            
          
          <StarRating starMin={this.state.starMin} starMax={this.state.starMax} starCurrent={this.state.starCurrent} />
          
          <Liste
            nameList="Liste des Restaurants"
            restaurants={this.state.restaurantsDisplayed}
          />

        </main>
      </div>
    );
  }
}

export default App;