TripOrganizer.TripList = OpenLayers.Class({

    listId: null,
    map:null,
    tripLayer:null,
    trips: null,
    centroidDisplayer: null,
    imageLoader: null,
    carousel: null,

    initialize: function(listId,map,tripLayer,clayer,options){
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        this.listId=listId;
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

        this.createCarousel();
        //console.log(this.carousel);
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
            var trip = new TripOrganizer.Trip(trips[i].id,trips[i].title,trips[i].type,trips[i].date,trips[i].geom,this.tripLayer,false,this); //id,title,type,centroid,tripLayer,visible
            tripObjects.push(trip);
        }
        return tripObjects;
    },

    redraw: function(){
        var that = this;
        $('#'+this.listId).html("");
        var active = false;
        this.carousel.reset();
        for(var i=0;i<this.trips.length;i++){
            var trip = this.trips[i];
            
            var $item;

            var title = trip.title;
            if(trip.title==""){
                title="Uten navn";
            }
            if(trip.title.length>23){
                ;;;console.log("shortening");
                title = trip.title.substring(0,23);
            }
            if(trip.isActive()){
                $item = $("<li id='head_for_"+ trip.id +"'><a href='#!' class='active trip_type_"+trip.type+"'>"+title+"<br /><span class='trip_metadata'>"+trip.date+"</span></a></li>");
                //$head = $("<div class='triphead open' id='head_for_"+ trip.id +"'>").html("<h4>"+trip.title+"</h4>");
                active=true;
            }
            else {
                $item = $("<li id='head_for_"+ trip.id +"'><a href='#!' class='trip_type_"+trip.type+"'>"+title+"<br /><span class='trip_metadata'>"+trip.date+"</span></a></li>");
            }

            $item.click(function(){
                var id = this.id.replace("head_for_","");
                that.toggle(id);
            });
            //$('#'+this.listId).append($item);
            //console.log("add ", $item, " to carousel at ", i);
            this.carousel.add(i, $item);
        }

        if(!active){
            $('#tripdetail').html($("<p class='customtext'>Velg en tur i menyen eller kartet</p>"));
            $("#toolbar").addClass("hidden");
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
        var trip = new TripOrganizer.Trip(tripData.id,tripData.title,tripData.type,tripData.date,tripData.geom,this.tripLayer,false,this); //id,title,type,centroid,tripLayer,visible
        this.trips.unshift(trip);
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


    createCarousel: function(){
        var that = this;
        function mycarousel_initCallback(carousel) {
/*
            jQuery('.jcarousel-control a').bind('click', function() {
                carousel.scroll(jQuery.jcarousel.intval(jQuery(this).text()));
                return false;
            });

            jQuery('.jcarousel-scroll select').bind('change', function() {
                carousel.options.scroll = jQuery.jcarousel.intval(this.options[this.selectedIndex].value);
                return false;
            });
*/
            jQuery('#mycarousel-next').bind('click', function() {
                carousel.next();
                return false;
            });

            jQuery('#mycarousel-prev').bind('click', function() {
                carousel.prev();
                return false;
            });

            that.carousel = carousel;
        }



            $("#trips_list").jcarousel({
                scroll: 5,
                vertical: true,
                initCallback: mycarousel_initCallback,
                // This tells jCarousel NOT to autobuild prev/next buttons
                //buttonNextHTML: null,
                //buttonPrevHTML: null,
                itemFallbackDimension:32,
                itemFirstOutCallback: {
                    onBeforeAnimation: function(){

                    },
                    onAfterAnimation: function(){
                        $(".jcarousel-prev").removeClass("jcarousel-prev-disabled");
                        $(".jcarousel-prev").removeClass("jcarousel-prev-disabled-vertical");
                    }
                },
                itemLastOutCallback: {
                    onBeforeAnimation: function(){

                    },
                    onAfterAnimation: function(){
                        $(".jcarousel-next").removeClass("jcarousel-next-disabled");
                        $(".jcarousel-next").removeClass("jcarousel-next-disabled-vertical");
                    }
                }

            });

    },
    CLASS_NAME: "TripOrganizer.TripList"

});