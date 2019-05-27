import React, { Component } from 'react';

class Star extends Component {    
    // arrow fx for binding
    handleClick = () => {
        // On envoie l'index de l'étoile        
        this.props.onClick(this.props.index);
    }
    render() { 
        const isLight = this.props.light;
        return ( 
           <i className={isLight===true?"fas fa-star":"far fa-star"} onClick={this.handleClick}></i>
         );
    }
}
 
export default Star;