import axios from 'axios';
import React, { Component } from 'react';
import './App.css';

class App extends Component {

	componentDidMount(){
		this.getVenuesFromAPI();		
	}

	state = {
		venues:[]
	} 
	// keeps track of venues in application using venues array 

	mapRenderer = () => {
		scriptLoader("https://maps.googleapis.com/maps/api/js?key=AIzaSyDXdfy8blk2k0sCJhOeAIfGbRRD0BxfkNQ&callback=initMap");
		window.initMap = this.initMap;
		
	}

	getVenuesFromAPI = () => {
		let fsEndPoint = "https://api.foursquare.com/v2/venues/explore?";
		var params = {
			client_id : "QTKZZQBMCOBKZKY0CH1GJKN3VCIKRBFBQHG4KSWYOPIQCZNC",
			client_secret : "ADEAW5I1J0OAZ3AY0BQ0HHHTH5DUCBI4XGBBEBYZRACLNLOY",
			query : "food",
			near : "Sydney",
			v : "20182507"
		}

		axios.get(fsEndPoint+ new URLSearchParams(params)).then(res=>{
			this.setState({
				venues: res.data.response.groups[0].items 
			},this.mapRenderer())  
			console.log(res)
		}).catch(error=>{
			console.log("error "+error)
		})
	}

	initMap = () => {
        let map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });

        this.state.venues.map(data => {

	        var marker = new window.google.maps.Marker({
			    position: {lat: data.venue.location.lat, lng: data.venue.location.lng},
			    map: map,
			    title: 'Hello World!'
			  });
        });
    }

	render() {
	    return (
	      <main>
	      	<div id='map'></div>
	      </main>
	    );
	}
}


function scriptLoader(toLoad){
	var script0 = window.document.getElementsByTagName('script')[0];
	var scriptElem = window.document.createElement('script');
	scriptElem.src = toLoad;
	scriptElem.async = true;
	scriptElem.defer = true;
	script0.parentNode.insertBefore(scriptElem, script0);
}


export default App;