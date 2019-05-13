import React, { Component } from "react";
import "./css/App.css";
import MapGoogle from "./Component/MapGoogle";
import Liste from "./Component/Liste";
import Rating from "./Component/Rating";

//import "whatwg-fetch";*/




var data = require("./data/restaurant.json");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurants: data,
      restaurantsDisplayed: [],
      starMin: 1,
      starMax: 5,
      starCurrent : [true,true,true,true,true],
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
  handleRating = (index) => {
    
    let current = this.state.starCurrent;
    current[index]===true?current[index]=false:current[index]=true;
    
    if (current[index]===true) {
      let isExistTrue=false;
      for (let i=0; i<index;i++){
        if (current[i]===true||isExistTrue===true){
          current[i]=true;
          isExistTrue=true;
        };
      };
      if (isExistTrue===false) {
        for (let i=current.length-1; i>index;i--){
          if (current[i]===true||isExistTrue===true){
            current[i]=true;
            isExistTrue=true;
          };
        };  
      }
    }
    else {
      var isExistTrue=false;
      for (let i=0; i<index;i++){
        if (current[i]===true){
          isExistTrue=true;
        };
      };
      if (isExistTrue===true) {
        for (let i=index; i<current.length;i++){
          current[i]=false;
          };
      };      
    }        
    this.setState({
      starCurrent : current
    });
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
                    
          <Rating min={this.state.starMin} max={this.state.starMax} current={this.state.starCurrent} onClick={this.handleRating} />          

          <Liste
            nameList="Liste des Restaurants"
            restaurants={this.state.restaurantsDisplayed}
            filter={this.state.starCurrent}
          />

        </main>
      </div>
    );
  }
}

export default App;