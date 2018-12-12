import React, { Component } from 'react';

class VenuesList extends Component{



	render(){

		 return (
            <div class="options-box">
		        <h1>Find Your New NYC Home</h1>
		        
		        <div> 
		          <span class="text">Search for nearby places</span>
		          <input id="places-search" type="text" placeholder="Ex: Pizza delivery in NYC"/>
		          <input id="go-places" type="button" value="Go"/>
		        </div>
		      </div>
        );

	}
}

export default VenuesList;