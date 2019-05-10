import React, { Component } from 'react';
import Rating from './Rating';


class StarRating extends Component {

  constructor(props) {
    super(props);
    this.state = {
      starMin : 1,
      starMax : 5,
      starCurrent : [true,true,true,false,false]
    }
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

  render() {
    return (
      <div className="starRating">        
        <Rating min={this.state.starMin} max={this.state.starMax} current={this.state.starCurrent} onClick={this.handleRating} />
      </div>
    );
  }
}

export default StarRating;
