import React, { Component } from 'react';
import {PropTypes} from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class VenuesList extends Component{

	static propTypes = {
    	venues: PropTypes.array.isRequired,
    	hide: PropTypes.func.isRequired,
    	show: PropTypes.func.isRequired
  	}

  	state={
  		query: ""
  	}
  	 
  	updateQuery = (query) => {
	    this.setState({ query: query })
	}

	showMarkers=(markers)=>{
		markers.forEach(marker=>marker.setVisible(true));
	}

	hideMarkers=()=>{
		this.props.venues.forEach(marker=>marker.setVisible(false));
	}

	render(){
		let props = this.props;
		const { query } = this.state
	    let showingVenues=[]    

	    	if (query) {
			    const match = new RegExp(escapeRegExp(query), 'i')

			    props.venues.forEach(function(data){ 
				    if(match.test(data.venue.name)){
				    	data.marker.setVisible(true);
				    	showingVenues.push(data);
					}else{
				    	data.marker.setVisible(false);
					} 
				});
			}else {
				   showingVenues = props.venues;
			}
				  
	    showingVenues.sort(sortBy('name'));
	    // this.hideMarkers();
	    // this.showMarkers(showingVenues);
	    // this.props.show(showingVenues);


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