import React from 'react';
import Star from '../Star';

const Rating = (props) => { 
    const listStar = props.current.map((star,index) =>
    <Star key={index} index={index} light={star} onClick={props.onClick} />);
    return ( <div id="rating">
        {listStar}
    </div> );
}
 
export default Rating;
