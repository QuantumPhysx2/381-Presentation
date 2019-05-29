var map, infoWindow, marker;

function initMap() {
    // Google map settings
    // MapTypeId = https://developers.google.com/maps/documentation/javascript/maptypes
    map = new google.maps.Map(document.querySelector("#map"), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 20,
        tilt: 45,
        gestureHandling: "greedy",
        heading: 90,
        mapTypeId: "hybrid"
    })
    
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(-34.397, 150.644),
        map: map,
        title: "Your position"
    })
    
    // Create our Google Map
    infoWindow = new google.maps.InfoWindow;

    // try HTML5 geolocation (if Browser supports Geolocation API)
    if (navigator.geolocation) {
        // Setting the position of the map marker
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            
            // Map marker properties
            infoWindow.setPosition(pos);
            infoWindow.setContent("You are here");

            // Apply the map configurations on opening of the map
            infoWindow.open(map, marker);

            // Set the variables to user's current location on agreement
            map.setCenter(pos);
            marker.setPosition(pos);

        }, function() {
            // Set the map marker to the set position if failed
            // E.g. GPS not turned on | didn't allow location services
            handleLocationError(true, infoWindow, map.getCenter());
        })

        // Automatically call this function on device location change
        navigator.geolocation.watchPosition(function(position) {
            // Updates the marker based on current position
            setMarkerPosition(marker, position);
        })
    } else {
        // return error if browser does not support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}

function randomMarker(boundary) {
    var latMin = boundary.getSouthWest().lat(),
        latRange = boundary.getNorthEast().lat() - latMin,
        lonMin = boundary.getSouthWest().lng(),
        lonRange = boundary.getNorthEast().lng - lonMin;

    return new google.maps.LatLng(latMin + (Math.random() * latRange), lonMin + (Math.random() * lonRange));
}

function setMarkerPosition(marker, position) {
    marker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
}

// Reference: https://www.html5rocks.com/en/tutorials/geolocation/trip_meter/
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? "Error: Geolocation service failed," : "Error: Your browser does not support Geolocation");
    infowWindow.open(map);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    // Radius of Earth in km
    var R = 6371;
    // Convert lat and lon diff to radians
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var dist = R * distance;
    return dist;
}

Number.prototype.toRad = function() {
    return this * Math.PI / 180;
}

// Distance tracking
window.onload = function() {
    var startPos;

    navigator.geolocation.getCurrentPosition(function(pos) {
        // Set var to become the current Lat and Lon values to radians
        startPos = pos;
        // Set innerHTML to current Lat and Lon values
        document.querySelector("#start_lat").textContent = startPos.coords.latitude;
        document.querySelector("#start_lon").textContent = startPos.coords.longitude;
    }, function(err) {
        // Error handling
        alert("You must allow access to track your distance: " + err.code);
        // 0 = unknown error
        // 1 = permission denied
        // 2 = position unavailable
        // 3 = timed out
    })

    navigator.geolocation.watchPosition(function(pos) {
        // Updating innerHTML with current coordinates
        startPos = pos;
        document.querySelector("#current_lat").textContent = startPos.coords.latitude;
        document.querySelector("#current_lon").textContent = startPos.coords.longitude;
        
        // Calculate distance between original and current location
        document.querySelector("#distance").textContent = calculateDistance(startPos.coords.latitude, startPos.coords.longitude, pos.coords.latitude, pos.coords.longitude);
    })
}

// Timer tracker
var hours = 0;
var minutes = 0;
var seconds = 0;
var timer = document.querySelector("#stat_time");

window.setInterval(function() {
    seconds++;
    timer.textContent = hours + ":" + minutes + ":" + seconds;

    // Checking if seconds exceeds 60 seconds
    if (seconds >= 60) {
        // Append by +1
        minutes++;
        // Round off value to nearest whole number divided by 60 (seconds)
        seconds = Math.floor(seconds / 60);
    }

    if (minutes >= 60) {
        hours++;
        minutes = Math.floor(minutes / 3600);
    }
}, 1000)

// Check for Geolocation support
if (navigator.geolocation) {
    console.log("Geolocation is supported");
} else {
    console.log("Geolocation is not supported for this browser");
}
