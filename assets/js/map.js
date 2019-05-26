var map, infoWindow, marker;

function initMap() {
    // Google map settings
    map = new google.maps.Map(document.querySelector("#map"), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 14,
        gestureHandling: "greedy"
    })

    marker = new google.maps.Marker({
        position: new google.maps.LatLng(-34.397, 150.644),
        map: map,
        title: "Your position"
    })

    infoWindow = new google.maps.InfoWindow;

    // try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent("You are here");

            // Apply the map configurations on opening of the map
            infoWindow.open(map, marker);

            // Set the variables to user's current location on agreement
            map.setCenter(pos);
            marker.setPosition(pos);

        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        })

        // Automatically call this function on device location change
        navigator.geolocation.watchPosition(function(position) {
            setMarkerPosition(marker, position);
        })
    } else {
        // return error if browser does not support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
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
    var R = 6371;
    // Convert lat and lon diff to rad
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var dist = R * c;
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
        startPos = pos;
        document.querySelector("#current_lat").textContent = startPos.coords.latitude;
        document.querySelector("#current_lon").textContent = startPos.coords.longitude;
        
        // Calculate distance between original and current location
        document.querySelector("#stat_distance").textContent = calculateDistance(startPos.coords.latitude, startPos.coords.longitude, pos.coords.latitude, pos.coords.longitude);
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

    if (seconds >= 60) {
        minutes++;
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
