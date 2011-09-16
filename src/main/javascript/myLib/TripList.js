TripOrganizer.TripList = OpenLayers.Class({

    div: null,
    map:null,
    tripLayer:null,
    trips: null,
    centroidDisplayer: null,
    imageLoader: null,

    initialize: function(div,map,tripLayer,clayer,options){
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        this.div=div;
        this.map=map;
        this.tripLayer=tripLayer;
        this.centroidDisplayer = new TripOrganizer.CentroidDisplayer(clayer);
        this.imageLoader = new TripOrganizer.ImageLoader(map);
        this.graphDisplayer = new TripOrganizer.GraphDisplayer();
        var that = this;
        clayer.events.on({
            'featureselected': function(evt) {
                var id = evt.feature.attributes.tripid;
                that.showTrip(id);
            }
        });
    },

    listTrips:function(){
        var that = this;
        $.getJSON(
            "getCentroids",
            {},
            function(trips) {
                that.trips=that.createTrips(trips);
                that.centroidDisplayer.displayCentroids(trips,false);
                that.redraw();
            }
        );
    },

    createTrips: function(trips){
        var tripObjects = [];
        for(var i=0;i<trips.length;i++){
            var trip = new TripOrganizer.Trip(trips[i].id,trips[i].title,trips[i].type,trips[i].geom,this.tripLayer,false,this); //id,title,type,centroid,tripLayer,visible
            tripObjects.push(trip);
        }
        return tripObjects;
    },

    redraw: function(){
        var that = this;
        $('#'+this.div).html("");
        var active = false;
        for(var i=0;i<this.trips.length;i++){
            var trip = this.trips[i];
            var $head;
            if(trip.isActive()){
                $head = $("<div class='triphead open' id='head_for_"+ trip.id +"'>").html("<h4>"+trip.title+"</h4>");
                active=true;
            }
            else {
                $head = $("<div class='triphead closed' id='head_for_"+ trip.id +"'>").html("<h4>"+trip.title+"</h4>");
            }

        $head.click(function(){
            var id = this.id.replace("head_for_","");
            that.toggle(id);
        });
            $('#'+this.div).append($head);
        }

        if(!active){
            $('#tripdetail').html($("<div class='vertContainer'><p class='customtext'>Velg en tur i menyen eller kartet</p></div>"));
            this.tripLayer.map.setCenter(new OpenLayers.LonLat(1932453.2623743,9735786.7850962),5);
        }
    },

    showTrip: function(id){
        for(var i=0;i<this.trips.length;i++){
            if(this.trips[i].id == id){
                this.trips[i].showTrip();
            }
            else {
                this.trips[i].hideTrip();
            }
        }
        this.redraw();
    },

    toggle: function(id){
        for(var i=0;i<this.trips.length;i++){
            if(this.trips[i].id == id){
                this.trips[i].toggle();
            }
            else {
                this.trips[i].hideTrip();
            }
        }
        this.redraw();
    },


    addTrip: function(tripData){
        var trip = new TripOrganizer.Trip(tripData.id,tripData.title,tripData.type,tripData.geom,this.tripLayer,false,this); //id,title,type,centroid,tripLayer,visible
        this.trips.push(trip);
        this.centroidDisplayer.addTrip(tripData);
        this.showTrip(trip.id);
    },

    deleteTrip: function(id){
        for(var i=0;i<this.trips.length;i++){
            if(this.trips[i].id == id){
                var del = this.trips.splice(i, 1);
                del[0].hideTrip();
            }
        }
        this.centroidDisplayer.removeFeature(id);
        this.redraw();
    },

    updateTrip: function(trip){
        for(var i=0;i<this.trips.length;i++){
            if(this.trips[i].id == trip.id){

            }
        }
    },
    CLASS_NAME: "TripOrganizer.TripList"

});