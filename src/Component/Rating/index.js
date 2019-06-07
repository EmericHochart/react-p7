import React from 'react';
import Star from '../Star';
import PropTypes from "prop-types";

const Rating = (props) => { 
    const listStar = props.current.map((star,index) =>
    <Star key={index} index={index} light={star} onClick={props.onClick} />);
    return ( <div id="rating">
        {listStar}
    </div> );
}
// TODO PropTypes
// Rating.propTypes = 
export default Rating;
