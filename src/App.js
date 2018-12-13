import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import VenuesList from './VenuesList.js';

class App extends Component {

	componentDidMount(){
		this.getVenuesFromAPI();		
	}

	constructor(props) {
        super(props);
		this.state = {
			venues:[],
			infowindow: "",
			map: ""
		}; 
		 
		this.initMap = this.initMap.bind(this); 
        this.openInfo = this.openInfo.bind(this);
        this.closeInfo = this.closeInfo.bind(this);
    }

	// keeps track of venues in application using venues array 
 
	mapRenderer = () => {
		scriptLoader("https://maps.googleapis.com/maps/api/js?key=AIzaSyDbAvXdtQstI2-9sAzZYcnFh4kB32mm5vw&callback=initMap");
		window.initMap = this.initMap;
		
	}

	getVenuesFromAPI = () => {
		let fsEndPoint = "https://api.foursquare.com/v2/venues/explore?";
		var params = {
			client_id : "QTKZZQBMCOBKZKY0CH1GJKN3VCIKRBFBQHG4KSWYOPIQCZNC",
			client_secret : "ADEAW5I1J0OAZ3AY0BQ0HHHTH5DUCBI4XGBBEBYZRACLNLOY",
			query : "food",
			near : "Indore",
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

		// creating a map
        let map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: 22.71792, lng: 75.8333},
          zoom: 11,
          styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}]
        });  	

        this.setState({
            'map': map,
        });

       	this.setMarker(map, this.state.venues);	
        // marker	       
       
    }

    // sets the marker
    setMarker =(map, items)=>{
    	var allvenues = [];
     	var self = this;

     	window.google.maps.event.addDomListener(window, "resize", function() {
			 var center = map.getCenter();
			 window.google.maps.event.trigger(map, "resize");
			 map.setCenter(center); 
			});

    	//information window
    	var infowindow = new window.google.maps.InfoWindow();
    	this.setInfoWindowInState(infowindow);
    	infowindow.close();    	

        // looping through venues
        items.map(data => {
	    	var contentString =   data.venue.name ;

	    	console.log(this);
	    	var marker = new window.google.maps.Marker({
				    position: {lat: data.venue.location.lat, lng: data.venue.location.lng},
				    map: map,
				    title: data.venue.name,
				    animation: window.google.maps.Animation.DROP, 
				  });

 	    		function onMarkerClick(e){
	    			//before opening window, change its contents
		        	// infowindow.setContent(contentString);  
		        	
		        	self.setInfoWindowInState(infowindow);
		        	map.setZoom(13);
                 	map.setCenter(e.latLng);
				    // infowindow.open(map,marker);
				    self.openInfo(marker,contentString);
				      
				} 

		        // on clicking marker	
		        marker.addListener('click', onMarkerClick )

		        data.marker = marker;
		        allvenues.push(data); 
		});        
		this.setState({
            'venues': allvenues
        });

    }

    setInfoWindowInState =(info)=>{
    	console.log(this);
    	this.setState({
				    	infowindow: info
				    })
    }

    openInfo=(marker,content)=> {
    	var contentString = `${content}`;
        this.closeInfo();
        let map = this.state.map;

      
         
        map.setZoom(13);
        map.setCenter(marker.getPosition());
       

        this.state.infowindow.setContent(contentString);
        this.state.infowindow.open(map, marker);
    }

    closeInfo=()=> {
    	    this.state.infowindow.close();
    }

    zoomOutFunc = () => {
    	let map = this.state.map;

    	map.setZoom(11);
    }

    toogleListView = () => {
    	var sideBar = document.getElementsByClassName('side-bar')[0];
    	if(sideBar.style.display==="none"){
    		sideBar.style.display = 'block'; 
    		document.getElementById('map').style.left='260px';
    		document.getElementsByClassName("navbar")[0].style.left = '260px';
    	} else if(sideBar.style.display !== "none" ){
    		sideBar.style.display = 'none';
    		document.getElementById('map').style.left='0px';
    		document.getElementsByClassName("navbar")[0].style.left = '0px';

    	}

    }

    
   
	render() {	
		
	    return (
	      <main>
	      	<div className='navbar'> 
	      		<span className='hamburger' onClick={this.toogleListView}>
 					<i className="fas fa-bars"></i>  
 				</span>
	      	</div>

	      	<VenuesList venues={this.state.venues} openInfow={this.openInfo} closeInfow={this.closeInfo} mainState={this.state} zoomOut={this.zoomOutFunc} />

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