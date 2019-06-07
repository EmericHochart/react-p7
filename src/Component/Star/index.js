import React, { Component } from 'react';

class Star extends Component {    
    handleClick = () => {
        // We send the index of the star        
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