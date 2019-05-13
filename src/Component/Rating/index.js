import React, { Component } from 'react';
import Star from '../Star';

class Rating extends Component {
    
    handleLight = (index) => {        
        this.props.onClick(index)
    }

    render() { 
        const currentStars = this.props.current;
        const listStar = currentStars.map((star,index) =>
        <Star key={index} index={index} light={star} onClick={this.handleLight} />);
        return ( <div id="rating">Filtre
            {listStar}
        </div> );
    }
}
 
export default Rating;
