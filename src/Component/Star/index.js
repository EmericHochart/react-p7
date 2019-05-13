import React, { Component } from 'react';

class Star extends Component {
    
    // arrow kx for binding
    handleClick = () => {
        let index = this.props.index;
        this.props.onClick(index);
    }

    render() { 
        const isLight = this.props.light;        
    
        return ( 
           <i className={isLight===true?"fas fa-star":"far fa-star"} onClick={this.handleClick}></i>
            
         );
    }
}
 
export default Star;