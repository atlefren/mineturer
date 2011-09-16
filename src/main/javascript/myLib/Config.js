window.TripOrganizer = {};

        TripOrganizer.types ={
            "hiking":"Fjelltur",
            "jogging":"Jogging",
            "walking":"Gåtur",
            "cycling":"Sykling",
            "nordicski":"Skitur",
            "car":"Biltur",
            "swimming":"Svømming",
            "rollerskate":"Rulleskøyter",
            "snowshoeing":"Truger",
            "motorbike":"Motorsykkel",
            "atv":"ATV",
            "snowmobiling":"Snøscooter",
            "default":"Annet"
        };

TripOrganizer.Util = {};
TripOrganizer.Util.convertTime= function(a){
    var hours=Math.floor(a/3600);
    var minutes=Math.floor(a/60)-(hours*60);
    var seconds=a-(hours*3600)-(minutes*60);
    return hours +"t " + minutes + "m " + seconds +"s";
};

TripOrganizer.Util.meterToKm= function(meter){
    var km = meter/1000;
    return this.round(km,2);
};

TripOrganizer.Util.round=function(n,d){
    var factor = Math.pow(10,d);
    return Math.round(n * factor) / factor;
};

TripOrganizer.Util.calcSpeed= function(dist,time){
    return this.round((dist/time)*3.6,2)
};

TripOrganizer.Util.getMapParams = function(map){

        var center = map.getCenter();
        var params = {};
        params.zoom = map.getZoom();
        params.lat = center.lat;
        params.lon = center.lon;

        params.layerId = map.baseLayer.layerId;

        return params;

};

TripOrganizer.Util.createFeatures = function(tripDetails){
    var format = new OpenLayers.Format.WKT();
    var features = [];

    if(tripDetails.tracks){
        for(var i=0;i<tripDetails.tracks.length;i++){
            var feature = format.read(tripDetails.tracks[i]);
            feature.attributes.trip = tripDetails.id;
            features = features.concat(feature);
        }
    }
    if(tripDetails.routes){
        for(var j=0;j<tripDetails.routes.length;j++){
            var routefeature = format.read(tripDetails.routes[j]);
            routefeature.attributes.trip = tripDetails.id;
            features = features.concat(routefeature);
        }
    }
    if(tripDetails.waypoints){
        for(var k=0;k<tripDetails.waypoints.length;k++){
            var wpfeature = format.read(tripDetails.waypoints[k]);
            wpfeature.attributes.trip = tripDetails.id;
            features = features.concat(wpfeature);
        }
    }

    return features
};