import React, { Component } from 'react';
import Star from '../Star';

class Rating extends Component {
    
    handleLight = (index) => {
        // On envoie l'index de l'étoile sur laquelle on clique        
        this.props.onClick(index)
    }

    render() { 
        const currentStars = this.props.current;
        const listStar = currentStars.map((star,index) =>
        <Star key={index} index={index} light={star} onClick={this.handleLight} />);
        return ( <div id="rating">
            {listStar}
        </div> );
    }
}
 
export default Rating;
