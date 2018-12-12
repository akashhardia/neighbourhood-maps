import React, { Component } from 'react';
import {PropTypes} from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class VenuesList extends Component{

	static propTypes = {
    	venues: PropTypes.array.isRequired,
    	filter: PropTypes.func.isRequired
  	}

  	state={
  		query: ""
  	}
  	 
  	updateQuery = (query) => {
	    this.setState({ query: query })
	}

	render(){

		let props = this.props;
		const { query } = this.state


	    let showingVenues
	    if (query) {
	      const match = new RegExp(escapeRegExp(query), 'i')
	      showingVenues = props.venues.filter((data) => match.test(data.venue.name))
	    } else {
	      showingVenues = props.venues
	    }

	    showingVenues.sort(sortBy('name'))


		 return (

            <div className="side-bar">
		        <h1>Restaurant Locations</h1>
		        
		        
		        <input
		            className='filter-input'
		            type='text'
		            placeholder='search'
		            value={query}
		            onChange={(event) => this.updateQuery(event.target.value)}
		        />
		        
		        <ul className='venue-list'>
		        	{ 
		        		showingVenues.map((data,i)=>{
						if(i<15){ 
							return <li onClick={ function(j) { return function() {props.setVenue(j)} }(data) } key={i}>{data.venue.name}</li>
						}
					})}
		        </ul>
		      </div>
        );
	}
}

export default VenuesList;