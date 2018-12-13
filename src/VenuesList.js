import React, { Component } from 'react';
import {PropTypes} from 'prop-types'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'

class VenuesList extends Component{

	static propTypes = {
    	venues: PropTypes.array.isRequired,
    	
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
	    let showingVenues=[]    

	    	if (query) {
			    const match = new RegExp(escapeRegExp(query), 'i')

			    props.venues.forEach(function(data){ 
				    if(match.test(data.venue.name)){
				    	data.marker.setVisible(true);
				    	showingVenues.push(data);
				    	
				    	props.closeInfow();
					}else{
				    	data.marker.setVisible(false);
				    	props.zoomOut();				    	
					} 
				});
			}else {
				   showingVenues = props.venues;
			}
				  
	    showingVenues.sort(sortBy('name'));
	   

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
						if(i<11){ 
							return <li role="button" onClick={props.openInfow.bind(this,data.marker,data.venue.name)} onKeyPress={props.openInfow.bind(this,data.marker,data.venue.name)} key={i} tabIndex='0'>{data.venue.name}</li>
						}
					})}
		        </ul>
		    </div>
        );
	}
}

export default VenuesList;