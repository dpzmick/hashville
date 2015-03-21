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