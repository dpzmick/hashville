function getLocation(map) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            actualLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(actualLocation);
        });
    }
}

function parseJSON(data) {
    var itinPoints = [];
    var suggestPoints = []

    $.each(data.itinerary, function(index, value) {
        var loc = new google.maps.LatLng(value.lat, value.lon);
        itinPoints.push({ location: loc });
    });

    $.each(data.suggestions, function(index, value) {
        var loc = new google.maps.LatLng(value.lat, value.lon);
        suggestPoints.push({ location: loc });
    });
    
    return { itinerary: itinPoints, suggestions: suggestPoints };
}

function plotRoute(map, directionsDisplay, org, dest, itin, mode,  update) {
    directionsDisplay.setMap(null);
    
    var travel_mode = null;
    switch (mode) {
        case "driving":
            travel_mode = google.maps.DirectionsTravelMode.DRIVING;
            break;
        case "bicycling":
            travel_mode = google.maps.DirectionsTravelMode.BICYCLING;
            break;
        case "transit":
            travel_mode = google.maps.DirectionsTravelMode.TRANSIT;
            break;
        case "walking":
        default:
            travel_mode = google.maps.DirectionsTravelMode.WALKING;
            break;
    }
    
    var request = {
        origin: org,
        destination: dest,
        waypoints: itin,
        travelMode: travel_mode
    };

    var directionsService = new google.maps.DirectionsService();
    
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
            update(response);
        } else {
            console.log('Failed to get route..');
        }
    });
}