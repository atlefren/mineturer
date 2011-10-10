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
function setupMap(perma,lon,lat,zoom,layerId,wkt) {

     OpenLayers.ImgPath = "gfx/oltheme/";

    OpenLayers.Lang.setCode("nb");

    var maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
        restrictedExtent = maxExtent.clone(),
        maxResolution = 156543.0339;

    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        units: "m",
        numZoomLevels: 18,
        maxResolution: maxResolution,
        maxExtent: maxExtent,
        restrictedExtent: restrictedExtent
    };
    var map = new OpenLayers.Map('map', options);

    if(typeof(google) != "undefined"){
        // create Google Mercator layers
        var gmap = new OpenLayers.Layer.Google(
            "Google Maps",
            {
                sphericalMercator: true,
                layerId: "gm"
            }
        );

        var gsat = new OpenLayers.Layer.Google(
            "Google Satellite",
            {
                type: google.maps.MapTypeId.SATELLITE,
                sphericalMercator: true,
                layerId: "gs"
            }
        );
    }
    // create OSM layer
    var mapnik = new OpenLayers.Layer.OSM();
    mapnik.layerId = "osm";
    
    // create WMS layer
    var wms = new OpenLayers.Layer.WMS(
        "SK, Topografisk norgeskart",
        "http://opencache.statkart.no/gatekeeper/gk/gk.open?",
        {'layers': 'topo2', 'format':'image/png'},
        {
            //visibility: true,
            visibility:false,
            'isBaseLayer': true,
            'wrapDateLine': true,
             layerId: "topo2"
        }
    );

    //wms.toporaster2

    var wms2 = new OpenLayers.Layer.WMS(
        "SK, Topografisk rasterkart",
        "http://opencache.statkart.no/gatekeeper/gk/gk.open?",
        {'layers': 'toporaster2', 'format':'image/png'},
        {
            //visibility: true,
            visibility:false,
            'isBaseLayer': true,
            'wrapDateLine': true,
             layerId: "raster2"
        }
    );

    // create a vector layer for drawing
    var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                    strokeColor: "#1E13FF",
                    strokeWidth: 2
                    },
                OpenLayers.Feature.Vector.style["default"]));

    var centroidStyleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                    strokeColor: "green",
                    fillColor: "red",
                    strokeWidth: 2},
                OpenLayers.Feature.Vector.style["default"]));


    var featureLayer = new OpenLayers.Layer.Vector("test",{displayInLayerSwitcher:false,styleMap: styleMap});
    var cLayer = new OpenLayers.Layer.Vector("Turpunkter",{displayInLayerSwitcher:false,styleMap: centroidStyleMap});

    map.addControl(new OpenLayers.Control.LayerSwitcher({roundedCornerColor:"black"}));

    if(typeof(google) != "undefined"){
        map.addLayers([wms,wms2, gmap, mapnik,gsat,cLayer, featureLayer]);
    }
    else {
        map.addLayers([wms,wms2, mapnik, cLayer, featureLayer]);
    }





    if(perma){
        map.setCenter(new OpenLayers.LonLat(lon,lat),zoom);
        for(var i =0;i<map.layers.length;i++){
            var layer = map.layers[i];
            if(layer.isBaseLayer && layer.layerId==layerId){
                map.setBaseLayer(layer);
            }
        }
        var format = new OpenLayers.Format.WKT();
        var features = [];
        for(var j = 0;j<wkt.length;j++){
            features.push(format.read(wkt[j]));
        }
        featureLayer.addFeatures(features);

    }
    else {

        var list = new TripOrganizer.TripList("trips_list",map,featureLayer,cLayer);
        list.listTrips();

        var uploader = new TripOrganizer.TripUploader(list);
        $("#uploadfile").click(function(){
            uploader.showUploadForm();
        });


        map.setCenter(new OpenLayers.LonLat(1932453.2623743,9735786.7850962),5);

    }

}
TripOrganizer.TripList = OpenLayers.Class({

    listId: null,
    map:null,
    tripLayer:null,
    trips: null,
    centroidDisplayer: null,
    imageLoader: null,
    carousel: null,
    nextBtnActive: null,

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

        this.nextBtnActive = true;
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

    redraw: function(scrollIdx){
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
                //;;;console.log("shortening");
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
            this.carousel.add(i, $item);
        }

        if(scrollIdx){
            this.carousel.scroll(scrollIdx-5);
        }

        if(!active){
            $('#tripdetail').html($("<p class='customtext'>Velg en tur i menyen eller kartet</p>"));
            $("#toolbar").addClass("hidden");
            this.tripLayer.map.setCenter(new OpenLayers.LonLat(1932453.2623743,9735786.7850962),5);
        }
    },

    showTrip: function(id){
        var idx = 0;
        for(var i=0;i<this.trips.length;i++){
            if(this.trips[i].id == id){
                this.trips[i].showTrip();
                idx = i;
            }
            else {
                this.trips[i].hideTrip();
            }
        }
        this.redraw(idx);
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

    },

    disableLast: function(){
        this.nextBtnActive = false;
    },

    enableLast: function(){
        this.nextBtnActive = true;
    },


    createCarousel: function(){
        var that = this;
        function mycarousel_initCallback(carousel) {



            jQuery('#mycarousel-next').bind('click', function() {
                if(that.nextBtnActive){
                    carousel.next();
                }
                if(carousel.last >that.trips.length){
                    that.disableLast();
                }
                else {
                    that.enableLast();
                }
                return false;
            });

            jQuery('#mycarousel-prev').bind('click', function() {
                carousel.prev();
                return false;
            });

            that.carousel = carousel;
            TripOrganizer.carousel = carousel;
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
TripOrganizer.Trip = OpenLayers.Class({

    id:null,
    title:null,
    type: null,
    centroid: null,
    tripLayer:null,
    visible: null,
    list: null,
    date:null,


    initialize: function(id,title,type,date,centroid,tripLayer,visible,list,options){
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        this.id=id;
        this.title=title;
        this.type=type;
        this.date=date;
        this.centroid=centroid;
        this.tripLayer=tripLayer;
        this.visible = visible;
        this.list = list;
        this.registerMapMove(tripLayer.map);
    },

    registerMapMove:function(map){
        map.events.on({
            'moveend': this.updateLink,
            'changelayer': this.updateLink,
            'changebaselayer': this.updateLink,
            scope: this
        });
    },

     updateLink: function(){
        //console.log("updateLInk ", this.displayTrip);

         if(this.visible){

        if(document.getElementById("perma")){
            // console.log("map moved! ", this.createParams());
            var perma = document.getElementById("perma");
            var params = TripOrganizer.Util.getMapParams(this.tripLayer.map);
            params.trip = this.id;
            var paramstring = OpenLayers.Util.getParameterString(params);
            //perma.innerHTML = "Link";
            perma.href="showTrip?"+paramstring;

          //  var fb = document.getElementById("facebook");
          //  fb.href= "http://www.facebook.com/sharer.php?u=" + encodeURIComponent(TripOrganizer.baseUrl + "showTrip?"+paramstring)+"&t="+encodeURIComponent(this.title);
        }
             }
    },

    toggle: function(){
        if(this.isActive()){
            this.hideTrip();
        }
        else{
            this.showTrip();
        }
    },

    isActive: function(){
        return this.visible;
    },

    showTrip: function(){
        if(!this.visible){
            this.visible = true;
            var that = this;
            this.showSpinner();
             $.getJSON(
                "getTrip",
                {
                    id:this.id,
                    geom: true
                },
                function(tripData) {
                    that.displayTripInfo(tripData,true);
                }
            );
        }

    },

    updateTrip:function(tripData){
        //this.list.updateTrip(tripData);
        this.title=tripData.name;
        this.type=tripData.type;
        this.list.redraw();
        this.list.centroidDisplayer.changeType(tripData.id,tripData.type);
        tripData.tracks = this.tripData.tracks;
        tripData.routes = this.tripData.routes;
        tripData.waypoints = this.tripData.waypoints;
        this.displayTripInfo(tripData,false);
    },

    displayTripInfo: function(tripData,geom){
        this.tripData = tripData;

        //setup map
        if(geom){
            var features = TripOrganizer.Util.createFeatures(this.tripData);
            this.tripLayer.destroyFeatures();
            this.tripLayer.addFeatures(features);
            this.tripLayer.map.zoomToExtent(this.tripLayer.getDataExtent());
        }
        //images
        this.list.imageLoader.load(tripData.id);

        //graph
        this.list.graphDisplayer.setTrackId(tripData.id);

        var desc = "";
        if(this.tripData.description){
            desc = "<dd class='descr'>" + this.tripData.description +"</dd>"
        }

        var heightDiff = this.tripData.heights.maxHeight-this.tripData.heights.minHeight;

        var type = "Annet";
        if(this.tripData.type){
            type=TripOrganizer.types[this.tripData.type];
        }

        $("#toolbar").removeClass("hidden");

        var $table = $("<table>"+
					"<tr>"+
						"<td colspan='2' class='text_large'>"+this.tripData.name+"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Type</td>"+
						"<td class='align_right'>"+type+"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Start</td>"+
						"<td class='align_right'>"+this.tripData.start+"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Stopp</td>"+
						"<td class='align_right'>"+this.tripData.stop+"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Total tid</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.convertTime(this.tripData.times.totalTime) + "</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Aktiv tid</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.convertTime(this.tripData.times.activeTime)  + "</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Lengde (2d)</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.length2d)  + " km</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Lengde (3d)</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.length3d)  + " km</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Snittfart</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.calcSpeed(this.tripData.lenghts.length3d,this.tripData.times.totalTime) + " km/t</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Snittsfart uten pauser</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.calcSpeed(this.tripData.lenghts.length3d,this.tripData.times.activeTime) + " km/t</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Oppstigning</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.lengthAsc)  + " km, "+
                        TripOrganizer.Util.convertTime(this.tripData.times.ascTime)  +", "+
                        TripOrganizer.Util.calcSpeed(this.tripData.lenghts.lengthAsc,this.tripData.times.ascTime)  + " km/t</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Nedstigning</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.lengthDesc)  + " km, " +
                        TripOrganizer.Util.convertTime(this.tripData.times.descTime)  + ", " +
                        TripOrganizer.Util.calcSpeed(this.tripData.lenghts.lengthDesc,this.tripData.times.descTime)  + " km/t</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Flatt terreng</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.lengthFlat)  + " km, " +
                    TripOrganizer.Util.convertTime(this.tripData.times.flatTime)  + ", "+
                        TripOrganizer.Util.calcSpeed(this.tripData.lenghts.lengthFlat,this.tripData.times.flatTime)  + " km/t</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Maks høyde</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.round(this.tripData.heights.maxHeight,2)  + " m.o.h.</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Min høyde</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.round(this.tripData.heights.minHeight,2)  + " m.o.h.</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Total oppstigning</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.round(this.tripData.heights.totalAsc,2)  + " m</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Total nedstigning</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.round(Math.abs(this.tripData.heights.totalDesc),2)  + " m</td>"+
					"</tr>"+
					"<tr>"+
						"<td>Høydeforskjell</td>"+
						"<td class='align_right'>" + TripOrganizer.Util.round(heightDiff,2)  + " m</td>"+
					"</tr>"+
				    "</table>");
/*

        var $body = $("<div class=\"tripbody\" id=\"body_for_"+ this.tripData.id +"\">").html(
            "<dl>"+
                desc +
                "<dt>Aktivitetstype:</dt> <dd>" + type+"</dd>"+
                "<dt>Start:</dt> <dd>" + this.tripData.start+"</dd>"+
                "<dt>Stopp:</dt> <dd>" + this.tripData.stop+"</dd>" +
                "<dt>Total tid:</dt> <dd>" + TripOrganizer.Util.convertTime(this.tripData.times.totalTime)  + "</dd>" +
                "<dt>Aktiv tid:</dt> <dd>" + TripOrganizer.Util.convertTime(this.tripData.times.activeTime)  + "</dd>" +
                "<dt>Lengde (2d):</dt> <dd>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.length2d)  + " km</dd>" +
                "<dt>Lengde (3d):</dt> <dd>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.length3d)  + " km</dd>" +
                "<dt>Gjennomsnittsfart:</dt> <dd> " + TripOrganizer.Util.calcSpeed(this.tripData.lenghts.length3d,this.tripData.times.totalTime) + " km/t</dd>" +
                "<dt>Gjennomsnittsfart uten pauser:</dt> <dd> " + TripOrganizer.Util.calcSpeed(this.tripData.lenghts.length3d,this.tripData.times.activeTime) + " km/t</dd>" +
                "<dt>Stigning opp:</dt> <dd>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.lengthAsc)  + " km, "+
                        TripOrganizer.Util.convertTime(this.tripData.times.ascTime)  +", "+
                        TripOrganizer.Util.calcSpeed(this.tripData.lenghts.lengthAsc,this.tripData.times.ascTime)  + " km/t</dd>" +
                "<dt>Stigning ned:</dt> <dd>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.lengthDesc)  + " km, " +
                        TripOrganizer.Util.convertTime(this.tripData.times.descTime)  + ", " +
                        TripOrganizer.Util.calcSpeed(this.tripData.lenghts.lengthDesc,this.tripData.times.descTime)  + " km/t</dd>" +
                "<dt>Flatt terreng:</dt> <dd>" + TripOrganizer.Util.meterToKm(this.tripData.lenghts.lengthFlat)  + " km, " +
                    TripOrganizer.Util.convertTime(this.tripData.times.flatTime)  + ", "+
                        TripOrganizer.Util.calcSpeed(this.tripData.lenghts.lengthFlat,this.tripData.times.flatTime)  + " km/t</dd>" +
                "<dt>Max høyde:</dt> <dd>" + TripOrganizer.Util.round(this.tripData.heights.maxHeight,2)  + " m.o.h.</dd>" +
                "<dt>Min høyde:</dt> <dd>" + TripOrganizer.Util.round(this.tripData.heights.minHeight,2)  + " m.o.h.</dd>" +
                "<dt>Total positiv stigning:</dt> <dd>" + TripOrganizer.Util.round(this.tripData.heights.totalAsc,2)  + " m.</dd>" +
                "<dt>Total negativ stigning:</dt> <dd>" + TripOrganizer.Util.round(Math.abs(this.tripData.heights.totalDesc),2)  + " m</dd>" +
                "<dt>Max høydeforskjell:</dt> <dd>" + TripOrganizer.Util.round(heightDiff,2)  + " m</dd>" +
                "<dt>Permalenke:</dt><dd> <a href='' target='blank' id='perma'>Permalink</a></dd>"+
                "<dt>Del: </dt><dd> <a href='' target='_blank' id='facebook' title='Del på Facbook'><img src='gfx/facebook.gif' class='noborder'/></a></dd>"+
                "<dt>Operasjoner:</dt><dd> <a id='edit'>Rediger</a> <a id='del'>Slett</a></dd>"+
                "</dl>"
        );
        */
        var that = this;

        $("#tripdetail").html("");
        //$("#tripdetail").append("<h3>"+this.tripData.name+"</h3>");
        $("#tripdetail").append($table);

        $("#delete_btn").unbind();
        $("#delete_btn").click(function(){

            var ok = confirm("Vil du virkelig slette denne turen?");
            if(ok){
                that.list.deleteTrip(that.id);

                $.getJSON(
                "deleteTrip",
                {
                    id:that.id
                },
                function(ok) {
                    if(ok){
                        that.list.deleteTrip(that.id);
                    }
                }
            );

            }
        });

        $("#edit_btn").unbind();
        $("#edit_btn").click(function(){
            var updater = new TripOrganizer.TripUpdater();
            updater.showUpdateForm(that.tripData,that);

        });

        //this.updateLink();

    },

    hideTrip: function(){
        if(this.visible){
            this.visible = false;
            this.tripData = null;
            this.tripLayer.destroyFeatures();
            $("#tripdetail").html("");
            this.list.imageLoader.clear();
            this.list.graphDisplayer.clear();
        }
    },

     showSpinner: function(){
        $("#tripdetail").html("");
        var img = document.createElement("img");
        img.setAttribute("src","gfx/ajax-loader.gif");
        img.className = "spinner";
        document.getElementById("tripdetail").appendChild(img);
    },

    CLASS_NAME: "TripOrganizer.Trip"

});
TripOrganizer.CentroidDisplayer = OpenLayers.Class({

    format: new OpenLayers.Format.WKT(),
    layer: null,
    select: null,

    initialize: function(layer){
        this.layer = layer;
        this.setUpSelect();
    },

    setUpSelect: function(){
        this.select= new OpenLayers.Control.SelectFeature(
            this.layer,
            {
                clickout: true,
                toggle: false,
                multiple: false,
                hover: false,
                toggleKey: "ctrlKey", // ctrl key removes from selection
                multipleKey: "shiftKey", // shift key adds to selection
                box: false
            }
        );

        this.layer.map.addControl(this.select);
    },

    addTrip: function(trip){
        this.layer.addFeatures([this.generateFeature(trip)]);
    },

    displayCentroids: function(centroids,update){

        var features = [];
        this.layer.destroyFeatures();
        for(var i=0;i<centroids.length;i++){
            features.push(this.generateFeature(centroids[i]));
        }
        this.layer.addFeatures(features);
        var bounds = this.layer.getDataExtent();
        if(features.length >0){
            var mapExt =this.layer.map.getExtent();
            if(!update){
                if(!mapExt.containsBounds(bounds)){
                    this.layer.map.zoomToExtent(bounds);
                }
            }
        }
        this.select.activate();
    },

    generateFeature: function(trip){
        var feature =this.format.read(trip.geom);

        var icon ="gfx/icons/default.png";
        if(trip.type){
            icon = "gfx/icons/"+trip.type + ".png";
        }
        feature.style = {
            externalGraphic:icon,
            graphicWidth:32,
            graphicHeight:37,
            cursor: "pointer",
            graphicTitle: trip.title
        };
        feature.attributes.tripid=trip.id;

        return feature;
    },

    removeFeature: function(id){
        this.layer.removeFeatures(this.layer.getFeaturesByAttribute("tripid",id));
    },

    changeType: function(id,type){
        var feature;
        for(var i=0;i<this.layer.features.length;i++){
            if(this.layer.features[i].attributes.tripid==id){
                feature =this.layer.features[i];
                break;
            }
        }
        feature.style.externalGraphic = "gfx/icons/"+type + ".png";
        this.layer.drawFeature(feature);
    },

    CLASS_NAME:"TripOrganizer.CentroidDisplayer"
});
TripOrganizer.ImageLoader = OpenLayers.Class({


    url: null,
    layer:null,
    selectCtrl: null,
    map:null,
    initialize: function(map){
        this.map=map;
        var style = {
            externalGraphic:"gfx/photo.png",
            graphicHeight: 16,
            graphicWidth:16,
            cursor:"pointer"
        };
        this.layer = new OpenLayers.Layer.Vector("Images", {style:style});
        map.addLayer(this.layer);
        this.selectCtrl = new OpenLayers.Control.SelectFeature(this.layer,{onSelect: this.onFeatureSelect});
        map.addControl(this.selectCtrl);
        this.clear();
    },

    clear: function(){
        this.selectCtrl.deactivate();
        this.layer.destroyFeatures();
        if(this.layer.map){
            this.map.removeLayer(this.layer);
        }
    },

    load: function(tripid){
        this.clear();
        var that = this;
        $.ajax({
            type: "GET",
            url: "getGeoRSS?tripid="+tripid,
            dataType: "xml",
            success: function(xml) {
                that.parseData(xml);
            }
        });
    },

    parseData: function(doc) {
        if (!doc || !doc.documentElement) {
            doc = OpenLayers.Format.XML.prototype.read(ajaxRequest.responseText);
        }

        var options ={
            externalProjection: new OpenLayers.Projection("EPSG:4326"),
            internalProjection:new OpenLayers.Projection("EPSG:900913"),
            createFeatureFromItem: function(item) {
                        var feature = OpenLayers.Format.GeoRSS.prototype.createFeatureFromItem.apply(this, arguments);
                        var links =this.getElementsByTagNameNS(item, "*", "link");
                        for(var i=0;i<links.length;i++){
                            var isImage = false;
                            for(var j=0;j<links[i].attributes.length;j++){
                                if(links[i].attributes[j].localName=="rel" && links[i].attributes[j].nodeValue=="enclosure"){
                                    isImage=true;
                                }
                                if(links[i].attributes[j].localName=="href" && isImage){
                                    feature.attributes.imageUrl =links[i].attributes[j].nodeValue;
                                }
                            }
                        }
                        return feature;
                    }
        };

        var format = new OpenLayers.Format.GeoRSS(options);
        var features = format.read(doc);
        if(features.length >0){
            this.map.addLayer(this.layer);
            this.layer.addFeatures(features);
            this.selectCtrl.activate();
        }
    },

     onFeatureSelect: function(feature) {
        $.fancybox.showActivity();
         var img = new Image();
         img.onload = function() {
             $.fancybox.hideActivity();
             $.fancybox({
                 content: "<div><img src='"+feature.attributes.imageUrl+"' ></div>",
                 width: this.width,
                 height: this.height
             });
         };
         img.src = feature.attributes.imageUrl;


         this.unselect(feature);
     },

    CLASS_NAME: "TripOrganizer.ImageLoader"

});




TripOrganizer.GraphDisplayer = OpenLayers.Class({



    spinner: null,
    trackid: null,
    active: false,
    initType:"height_dist",
    types: {
        "height_dist":{name:"Høyde-Avstand",fill:true,color:"#1E13FF",xlabel:"Distanse (Kmr)",ylabel:"Høyde over havet (Meter)"},
        "height_time":{name:"Høyde-Tid",fill:true,color:"#1E13FF",xlabel:"Tid (Timer)",ylabel:"Høyde over havet (Meter)"},
        "speed_dist":{name:"Fart-Avstand",fill:false,color:"#008000",xlabel:"Distanse (Km)",ylabel:"Fart (km/h)"},
        "speed_time":{name:"Fart-Tid",fill:false,color:"#008000",xlabel:"Tid (Timer)",ylabel:"Fart (km/h)"},
        "dist_time":{name:"Avstand-Tid",fill:false,color:"#C05800",xlabel:"Tid (Timer)",ylabel:"Distanse (Km)"},
        "hr_dist":{name:"HR - Avstand",fill:false,color:"#C05800",xlabel:"Distanse (Km)",ylabel:"Hr"},
        "hr_time":{name:"HR - Tid",fill:false,color:"#C05800",xlabel:"Tid (Timer)",ylabel:"Hr"}
        },

    initialize: function(){

    },

    setTrackId: function(id){
        this.trackid=id;
        //console.log("display", id);
        this.display();
    },

    clear: function(){

        this.hideGraph();
        $("#graphContainer").addClass("hidden");
        $("#graph").html("");
        $("#graphHeader").html("");
        this.trackid=null;
        this.initType="height_dist";
    },

    hideGraph: function(){
        $("#graph").html("");
        this.active=false;
    },

    display: function(){
        this.showSpinner();
        this.generateMenu();
         $("#graphContainer").removeClass("hidden");
        this.active=true;
        $("#"+this.divId).html("");
        var that = this;

        $.getJSON(
            "getGraphSeries",
            {
                id:this.trackid,
                type:this.initType
            },
            function(data) {
                that.showGraph(data);
            }
        );
    },

    generateMenu: function(){
        var $ul = $("<ul class='graphChooser'></ul>");
        var that = this;
        for(var key in this.types){
            var $li = $("<li class='graphChooserLi'></li>");
            var $a = $("<a href='#!' id='link_for_"+ key+"'>"+this.types[key].name+"</a>");
            $li.append($a);
            if(key ==this.initType){
                $a.addClass("selected");
            }
            $a.click(function(){
                var id = this.id.replace("link_for_","");
                $("#"+this.id).addClass("selected");
                if(id!=that.initType){
                    that.initType=id;
                    that.generateMenu();
                    that.display();
                }

            });
            $ul.append($li);
        }
        $("#graphHeader").html($ul);
        //console.log("generated header");
    },

    showSpinner: function(){
        $("#graph").html("");
        var img = document.createElement("img");
        img.setAttribute("src","gfx/ajax-loader.gif");
        img.className = "spinner";
        document.getElementById("graph").appendChild(img);
    },

    showGraph: function(data){
        $("#graph").html("");
        $.plot(
            $("#graph"),
            [data],
            {
                series: {
                    color: this.types[this.initType].color,
                    lines: {
                        show: true,
                        lineWidth: 1,
                        fill: this.types[this.initType].fill
                    }
                }
            }
        );
    },

    CLASS_NAME: "TripOrganizer.GraphDisplayer"
});
TripOrganizer.TripUploader = OpenLayers.Class({


    list: null,

    initialize: function(list){
        this.list = list;
    },

    showUploadForm: function(){
      


        var select ="";
        var type="hiking";
        for(var key in TripOrganizer.types){
            if(key == type){
                select+="<option value='"+key+"' selected='true'>"+ TripOrganizer.types[key]+"</option>";
            }
            else {
                select+="<option value='"+key+"'>"+ TripOrganizer.types[key]+"</option>";
            }
        }

        var string = "<div id='upload_form_wrapper'>" +
            "<h3>Last opp GPX-fil:</h3>"+
            "<form accept-charset='UTF-8' enctype='multipart/form-data' method='POST' action='uploadGpx' id='uploadForm'>"+
            "<input type='hidden' value='10000000' name='MAX_FILE_SIZE'>"+
            "<p><label>GPX-fil:</label>"+
            "<input type='file' name='file' id='upload_file'></p>"+
            "<p><label>Tittel:</label>"+
            "<input type='text' value='' name='name' id='upload_name'></p>"+
            "<p><label>Aktivitetstype:</label>"+
            "<select id='upload_type' name='type'>"+select+"</select></p>"+
            "<p><label>Flickr-tags:</label>"+
            "<input type='text' value='' name='tags' id='upload_flickr'></p>"+
            "<p><label>Beskrivelse:</label>"+
            "<textarea name='desc' id='upload_desc'></textarea></p>"+
            "<input type='submit' value='Last opp' id='update'/>" +
            "<div id='uploadLoader' class='hidden'><img src='gfx/ajax-loader.gif'> Laster opp</div>"+
            "<div id='uploadErr' class='error hidden'>"+
            "</div>";
        $.fancybox({
            content: string,
            overlayShow: false
        });



        var that = this;
        $("#uploadForm").ajaxForm({
            beforeSubmit: function(a,f,o) {
                o.dataType = "json";
                $('#uploadLoader').removeClass("hidden");
                $('#uploadErr').addClass("hidden");
                $('#uploadErr').html("");
            },
            success: function(data) {
                if(data.status == "OK"){
                    $.getJSON(
                        "getCentroid",
                        {
                            id:data.id
                        },
                        function(trip) {
                            $('#uploadLoader').addClass("hidden");
                            that.list.addTrip(trip);
                            $.fancybox.close();

                        }
                    );

                }
                else {
                    $('#uploadLoader').addClass("hidden");
                    $('#uploadErr').removeClass("hidden");
                    $('#uploadErr').html("<h5>En feil oppsto</h5><p></p>"+data.errMsg+"</p>");
                }
            }
        });

    },
    CLASS_NAME: "TripOrganizer.TripUploader"
});




TripOrganizer.TripUpdater = OpenLayers.Class({


    callerObj: null,
    tripData:null,

    initialize: function(){
    },

    showUpdateForm: function(tripData,callObj){
        this.callObj = callObj;
        var select ="";
        var type=tripData.type;
        this.tripData=tripData;
        for(var key in TripOrganizer.types){
            if(key == type){
                select+="<option value='"+key+"' selected='true'>"+ TripOrganizer.types[key]+"</option>";
            }
            else {
                select+="<option value='"+key+"'>"+ TripOrganizer.types[key]+"</option>";
            }
        }
        var tags ="";
        if(tripData.tags){
            tags=tripData.tags;
        }

        var desc = "";
        if (tripData.description){
            desc=tripData.description;
        }


        var string = "<div id='update_trip_form_wrapper'>" +
            "<h3>Rediger tur</h3>"+
            "<form accept-charset='UTF-8'  method='POST' action='updateTrack' id='updateForm'>"+
            "<input type='hidden' name='tripid' value='"+ tripData.id+"'/>"+
            "<p><label>Tittel:</label>"+
            "<input type='text' value='"+tripData.name+"' name='name' id='update_name'></p>"+
            "<p><label>Aktivitetstype:</label>"+
            "<select name='type' id='update_type'>"+select+"</select></p>"+
            "<p><label>Flickr-tags:</label>"+
            "<input type='text' value='"+tags+"' name='tags' id='update_flickr'></p>"+
            "<p><label>Beskrivelse:</label>"+
            "<textarea name='desc' id='update_desc'>"+ desc+"</textarea></p>"+
            "<input type='submit' value='Rediger' id='update'/>" +
            "</div>";

        $.fancybox({
            content: string,
            overlayShow: false
        });

        var that = this;
        $("#updateForm").ajaxForm({
            beforeSubmit: function(a,f,o) {
                o.dataType = "json";
                $('#updateLoader').removeClass("hidden");
            },
            success: function(data) {
                $.getJSON(
                        "getTrip",
                        {
                            id:that.tripData.id,
                            geom: false
                        },
                        function(tripData) {
                            that.callObj.updateTrip(tripData);
                            $.fancybox.close();
                        }
                    );
            }
        });

    },
    CLASS_NAME: "TripOrganizer.TripUpdater"
});




TripOrganizer.ProfileEditor = OpenLayers.Class({

    initialize: function(){

    },

    editProfile: function(){
        $.fancybox.showActivity();
        var that = this;
        $.getJSON(
                "getUserInfo",
                {
                },
                function(user) {
                    //console.log(trip);
                    that.showEditForm(user);
                }
            );
    },

    showEditForm: function(user){
        $.fancybox.hideActivity();

        var string ="<div id='profile_update_form_wrapper'>"+
            "<h3>Rediger profil</h3>"+
            "<form accept-charset='UTF-8'  method='POST' action='editMyUser' id='updateUserForm'>"+
            "<p><label>Fullt navn:</label>"+
            "<input id='fullname' type='text' name='fullname' value='"+user.fullname+"' /></p>"+

            "<p><label>Flickr ID:</label>"+
            "<input id='flickrid' type='text' name='flickrid'  value='"+user.flickrId+"'/> <a target='_blank' href='http://support.statsmix.com/kb/faq/how-do-i-find-my-flickr-id' style='margin-top: 3px;'><img src='gfx/question.png' alt='Hva er dette?' style='border: 0'/></a></p>"+
            "<p><label>E-Post:</label>"+
            "<input id='email' type='text' name='email' value='"+user.email+"'/></p>"+

            "<input type='submit' value='Rediger' id='updateUser'/>"+

            "</div" +
            "</form>";

        $.fancybox({
            content: string,
            overlayShow: false
        });

        $("#updateUserForm").ajaxForm({
            success: function() {
                $.fancybox.close();
            }
        });


    },
    CLASS_NAME: "TripOrganizer.ProfileEditor"
});




