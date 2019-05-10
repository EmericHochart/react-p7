import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Slider extends Component {
    
    static defaultProps = {
        minRange: 0,
        maxRange: 5        
    }

    static propTypes = {
        minRange: PropTypes.number.isRequired,
        maxRange: PropTypes.number.isRequired
    }
    
    constructor(props){
        super(props);
        this.state = {
            value: 0
        }
    }

    handleValue = (event) => {

        // On va faire remonter la state au parent App qui descendra celle-ci à Map

        var value = event.target.value;

        // Pas besoin de state interne à slider
        
        this.setState({
            value: value
        })
    }
    
    
    render() { 
        return (<input type="range" min={this.props.minRange} max={this.props.maxRange} step="1" onChange={this.handleValue}/> );
    }
}
 
export default Slider;