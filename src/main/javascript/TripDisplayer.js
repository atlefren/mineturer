TripOrganizer.TripDisplayer = OpenLayers.Class({
    layer: null,
    trips: null,
    format: new OpenLayers.Format.WKT(),

    initialize: function(layer,options){
        OpenLayers.Util.extend(this, options);
        this.layer= layer;

    },

    /*
    setTrips: function(trips){
        this.trips = trips;
    },
    */
    /*
    addTrip: function(trip){
        if(this.trips){
            this.trips.push(trip);
        }
        else {
            this.trips = [trip];
        }
    },
    */

    showTrip: function(trip){

        this.doDisplayTrip(trip);

    },

    doDisplayTrip: function(trip){
        //console.log("display", trip);

        var features = [];

        var bounds =  new OpenLayers.Bounds();
        if(trip.tracks){
            for(var i=0;i<trip.tracks.length;i++){
                var feature =this.format.read(trip.tracks[i]);
                bounds.extend(feature.geometry.getBounds());
                feature.attributes.trip=trip.id;
                features = features.concat(feature);
            }
        }
        if(trip.routes){
            for(var j=0;j<trip.routes.length;j++){
                var routefeature =this.format.read(trip.routes[j]);
                bounds.extend(routefeature.geometry.getBounds());
                routefeature.attributes.trip=trip.id;
                features = features.concat(routefeature);
            }
        }
        if(trip.waypoints){
            for(var k=0;k<trip.waypoints.length;k++){
                var wpfeature =this.format.read(trip.waypoints[k]);
                bounds.extend(wpfeature.geometry.getBounds());
                wpfeature.attributes.trip=trip.id;
                features = features.concat(wpfeature);
            }
        }

        if(features.length >0){
            //console.log("ft ", features);
            //featureLayer.destroyFeatures();
            this.layer.addFeatures(features);
            this.layer.map.zoomToExtent(bounds);
            //console.log(this.layer.features);
        }
        else {
            var that = this;
            //console.log("no features, fetch them!");
            $.getJSON(
                        "getTripGeom",
                        {id:trip.id},
                        function(trips) {
                            //console.log(trips);
                            that.replaceTrip(trips);
                        }
                );
        }
    },

/*
    replaceTrip: function(trip){
        for(var i=0;i<this.trips.length;i++){
            if(this.trips[i].id == trip.id){
                this.trips[i] = trip;
                this.doDisplayTrip(this.trips[i]);
            }
        }
    },
*/
    hideTrip: function(){
        //console.log("hide trip ", id);
        var rem = [];
        for(var i=0;i<this.layer.features.length;i++){

                rem.push(this.layer.features[i]);

        }
        this.layer.destroyFeatures(rem);
    },



    CLASS_NAME: "TripOrganizer.TripDisplayer"

});