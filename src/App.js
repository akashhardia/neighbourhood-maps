import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import VenuesList from './VenuesList.js';

class App extends Component {

	// when componentdidmount, get venues from foursquare api
	componentDidMount(){
		this.getVenuesFromAPI();
	}

	constructor(props) {
        super(props);
		this.state = {
			venues:[],
			infowindow: "",
			map: "",
			currentMarker: ''				// to remove animation
		};

		this.initMap = this.initMap.bind(this); 		// binding this
        this.openInfo = this.openInfo.bind(this);
        this.closeInfo = this.closeInfo.bind(this);
        this.fetchDetails = this.fetchDetails.bind(this);
    }

	// keeps track of venues in application using venues array


	// loads script and calls initmap
	mapRenderer = () => {
		scriptLoader("https://maps.googleapis.com/maps/api/js?key=AIzaSyDbAvXdtQstI2-9sAzZYcnFh4kB32mm5vw&callback=initMap");
		window.initMap = this.initMap;
	}


	// fetches details of venues requested by user
	fetchDetails(marker, venue) {
        var outerthis = this;
        var clientId = "QTKZZQBMCOBKZKY0CH1GJKN3VCIKRBFBQHG4KSWYOPIQCZNC";
        var clientSecret = "ADEAW5I1J0OAZ3AY0BQ0HHHTH5DUCBI4XGBBEBYZRACLNLOY";
        var markerlat = marker.getPosition().lat();
        var markerlng = marker.getPosition().lng();
        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20130815&ll=" + markerlat + "," + markerlng + "&limit=1";
        fetch(url).then((res)=> {
                    if (res.status !== 200) {
                        outerthis.state.infowindow.setContent("Sorry data can't be loaded");
                        return;
                    }
                    res.json().then(function (data) {
                    	var data1 = data.response.venues[0];
                        var name = '<b>Name : </b>' + venue.name + '<br>';
                        let address
                        if(!data1.location.address){				// if address is not available, show not available
                        	address = `not available`
                        }else{
                        	address = data1.location.address;
                        }
                        address = '<b>address: </b>' + address + '<br>';
                        let foursq =`<a href='https://foursquare.com'>Know more on Four Square</a>`;
                        outerthis.state.infowindow.setContent(name + address+foursq);
                    });
                }).catch((err)=> {
                outerthis.state.infowindow.setContent("data not loaded properly");
            });
    }


    //getting venues for first time to initialise state
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
		}).catch(error=>{
			console.log("error "+error)
		})
	}

	//iitialises the map
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
        items.forEach(data=>{
	    	var marker = new window.google.maps.Marker({
				    position: {lat: data.venue.location.lat, lng: data.venue.location.lng},
				    map: map,
				    title: data.venue.name,
				    animation: window.google.maps.Animation.DROP,
				  });

 	    		function onMarkerClick(e){

		        	self.setInfoWindowInState(infowindow);
		        	map.setZoom(13);
                 	map.setCenter(e.latLng);
				    // infowindow.open(map,marker);
				    self.openInfo(marker, data);

				}

		        // on clicking marker
		        marker.addListener('click', onMarkerClick)

		        data.marker = marker;
		        allvenues.push(data);
		});
		this.setState({
            'venues': allvenues
        });
    }


    setInfoWindowInState =(info)=>{
    	this.setState({
				    	infowindow: info
				    })
    }

    openInfo=(marker,data)=> {
        this.closeInfo();
        let map = this.state.map;

        if (this.state.currentMarker) {
            this.state.currentMarker.setAnimation(null);
            this.setState({
            'currentMarker': ''
        });
        }
                this.state.infowindow.open(map, marker);

        this.state.infowindow.setContent(`details loading...`);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
            'currentMarker': marker
        });

        map.setZoom(13);
        map.setCenter(marker.getPosition());

        // if (this.state.currentMarker) {
        //     this.state.currentMarker.setAnimation(null);
        // }
        // this.setState({
        //     'currentMarker': ''
        // });



        this.fetchDetails(marker, data.venue);
    }

    closeInfo=()=> {						// closes infowindow
    	this.state.infowindow.close();
    }

    zoomOutFunc = () => {					//zooms out the map
    	let map = this.state.map;

    	map.setZoom(11);
    }

    toogleListView = () => {				// hamburger button for sidebar
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

	      	<div role='application' id='map'></div>

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