window.TripOrganizer = {};
function setupMap(perma,lon,lat,zoom,layerId,wkt) {




    if(!perma){
        var heightDisplayer = new TripOrganizer.HeightProfileDisplayer("ele");
        var tripDisplayer = new TripOrganizer.TripInfoDisplayer("tripdetail");
        tripDisplayer.setText("Velg en tur i menyen!");
        var uploader = new TripOrganizer.TripUploader();
        var tripFetcher = new TripOrganizer.TripFetcher("trips");
        tripFetcher.addTripDisplayer(tripDisplayer);
        tripFetcher.getTrips();

        tripFetcher.addUploadManager(uploader);
        tripFetcher.addHeightDisplayer(heightDisplayer);
        uploader.createLink("upload");
    }
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
    if(!perma){
        tripDisplayer.setMap(map);
    }
    // create Google Mercator layers
    var gmap = new OpenLayers.Layer.Google(
        "Google Maps",
        {
            sphericalMercator: true,
            layerId: "gm"
        }
    );

    // create OSM layer
    var mapnik = new OpenLayers.Layer.OSM();
    mapnik.layerId = "osm";

    var gsat = new OpenLayers.Layer.Google(
            "Google Satellite",
            {
                type: google.maps.MapTypeId.SATELLITE,
                sphericalMercator: true,
                layerId: "gs"
            }
        );

    
    // create WMS layer
    var wms = new OpenLayers.Layer.WMS(
        "Statens Kartverk, topo2",
        "http://opencache.statkart.no/gatekeeper/gk/gk.open?",
        {'layers': 'topo2', 'format':'image/png'},
        {
            visibility: true,
            'isBaseLayer': true,
            'wrapDateLine': true,
             layerId: "topo2"
        }
    );

    // create a vector layer for drawing
    var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                    strokeColor: "green",
                    strokeWidth: 2},
                OpenLayers.Feature.Vector.style["default"]));


    var featureLayer = new OpenLayers.Layer.Vector("test",{displayInLayerSwitcher:false,styleMap: styleMap});
    if(!perma){
        tripFetcher.addLayer(featureLayer);
    }
    map.addLayers([wms, gmap, mapnik,gsat, featureLayer]);
    map.addControl(new OpenLayers.Control.LayerSwitcher());

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
            //console.log(wkt[j]);
            features.push(format.read(wkt[j]));
        }
        featureLayer.addFeatures(features);

    }
    else {
        map.setCenter(new OpenLayers.LonLat(1932453.2623743,9735786.7850962),5);
        //TODO get point representation of all tracks, and add to map, Zoom map to extent
        //map.zoomToMaxExtent()
    }



}
TripOrganizer.TripFetcher = OpenLayers.Class({

    div: null,
    tripLayer: null,
    trips: [],
    tripMapDisplayer: null,
    heightDisplayer: null,
    tripDisplayer: null,



    initialize: function(div,options){
        OpenLayers.Util.extend(this, options);
        this.div=div;
    },

    addLayer:function(layer){
        this.tripMapDisplayer = new TripOrganizer.TripDisplayer(layer);
    },

    getTrips: function(){
        var that = this;
        $.getJSON(
                        "getTrips",
                        {},
                        function(trips) {
                            //console.log(trips);
                            that.showTrips(trips);
                        }
                );
    },

    showTrips: function(trips){
        var that = this;
        this.trips = trips;
        //this.tripMapDisplayer.setTrips(trips);
        $('#'+that.div).html("");
        $.each(trips, function(index, trip) {
            that.createItem(trip,true,false,that);
            //console.log(trip);
        });
    },

    addTripDisplayer: function(displayer){
      this.tripDisplayer = displayer;
    },

    addUploadManager: function(uploader){
        uploader.addFetcher(this);
    },

    addHeightDisplayer: function(heightDisplayer){
        this.heightDisplayer= heightDisplayer;
    },

    addAndDisplayTrip: function(trip){
        this.trips.push(trip);
        //console.log("this:", this);
        //console.log("displaying ", trip , " from tripFetcher");

        /*
        this.tripMapDisplayer.addTrip(trip);
        this.tripMapDisplayer.showTrip(trip.id);
        */
        this.tripMapDisplayer.showTrip(trip);
        this.createItem(trip,false,true,this);
        this.tripDisplayer.displayTripInfo(trip);
        this.heightDisplayer.displayProfileFortrack(trip.id);
        this.activeTrip=trip.id;
        //this.heightDisplayer.hideHeightProfile();
        this.redraw();
    },


    displayTrip: function(id){
        this.tripDisplayer.showSpinner();
        this.heightDisplayer.hideHeightProfile();
        this.tripMapDisplayer.hideTrip();
        var that = this;
        $.getJSON(
            "getTripGeom",
            {id:id},
            function(trips) {
                //console.log(trips);
                that.doDisplayTrip(trips);
            }
        );
    },

    doDisplayTrip: function(trip){
        console.log("do display: ", trip);
        this.heightDisplayer.displayProfileFortrack(trip.id);
        this.tripDisplayer.displayTripInfo(trip);
        this.tripMapDisplayer.showTrip(trip);
    },

    createItem: function(trip,append,open,that){
        var $head;
        if(open){
            $head = $("<div class=\"triphead open\" id=\"head_for_"+ trip.id +"\">").html("<h4>"+trip.name+"</h4>");
        }else {
            $head = $("<div class=\"triphead closed\" id=\"head_for_"+ trip.id +"\">").html("<h4>"+trip.name+"</h4>");
        }

        $head.click(function(){
            var id = this.id.replace("head_for_","");
            if($('#'+this.id).hasClass("closed")){
                $('#body_for_'+id).removeClass("hidden");
                $('#'+this.id).removeClass("closed").addClass("open");

                that.displayTrip(id);
                //that.tripMapDisplayer.showTrip(id);

                /*
                 for(var i=0;i<that.trips.length;i++){
                    if(that.trips[i].id == id){
                        that.tripDisplayer.displayTripInfo(that.trips[i]);
                    }
                }
                */
                //that.heightDisplayer.displayProfileFortrack(id);
                that.activeTrip=id;

            }
            else {
                that.tripDisplayer.clear();
                that.heightDisplayer.hideHeightProfile();
                that.tripMapDisplayer.hideTrip();
                that.activeTrip=null;
                $('#body_for_'+id).addClass("hidden");
                $('#'+this.id).removeClass("open").addClass("closed");

            }
            that.redraw();

        });

        if(append){
            $('#'+that.div).append($head);
        }
        else {
            $('#'+that.div).prepend($head);
        }

    },


    redraw: function(){
        var trips = document.getElementsByClassName("triphead");
            for(var j=0;j<trips.length;j++){
                if (trips[j].id !="head_for_"+this.activeTrip){
                    $('#'+trips[j].id).removeClass("open").addClass("closed");
                }
            }
    },

    createBody: function(trip,hidden){
        var bodyclass = "tripbody";
        if(hidden){
            bodyclass = "tripbody hidden";
        }
        var $body = $("<div class=\"" + bodyclass + "\" id=\"body_for_"+ trip.id +"\">").html(
                    "<p><b>Beskrivelse: </b></a>" + trip.description+"</p>"+
                    "<p><b>Start: </b></a>" + trip.start+"</p>"+
                    "<p><b>Stopp: </b></a>" + trip.stop+"</p>"
                );
        var $link = $("<a class=\"link\" id=\"height_link_for_"+ trip.id +"\">Høydeprofil</a>");
        var that = this;
        $link.click(function(){
           var id = this.id.replace("height_link_for_","");
            that.heightDisplayer.displayProfileFortrack(id);
        });
        $body.append($link);


        return $body;

    },

    CLASS_NAME: "TripOrganizer.TripFetcher"

});
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
TripOrganizer.TripUploader = OpenLayers.Class({

    uploadForm: null,
    callback: null,

    initialize: function(callback,options){
        OpenLayers.Util.extend(this, options);

        this.callback = callback;
    },

    createLink: function(div){

        var $link = $("<a class=\"link\">Last opp .gpx</a>");
        var that = this;
        $link.click(function(){
           //console.log("display upload form!");
            that.showUploadForm(div);
        });
        $("#"+div).append($link);

    },


    showUploadForm: function(div){

        if(!this.uploadForm){

            $("#"+div).append(this.createUploadForm());
            this.uploadForm = $uplDiv;
        }
        else {
            this.uploadForm.removeClass("hidden");
        }

    },

    createUploadForm: function(){
        $uplDiv = $("<div id=\"uploadDiv\" class=\"uploadForm\"></div>");


        var formString= "<form id=\"uploadForm\" action=\"/uploadGpx\" method=\"POST\" enctype=\"multipart/form-data\">"+
                        "<input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\"10000000\" />"+
                        "GPX-fil: <input type=\"file\" name=\"file\" /><br />"+
                        "Navn: <input type=\"text\" name=\"name\"><br />"+
                        "Beskrivelse: <br /><textarea name=\"desc\"></textarea><br />"+
                         "<input type=\"submit\" value=\"Last opp\" />"+
                        "<div id=\"uploadLoader\" class=\"hidden\"><img src=\"gfx/ajax-loader.gif\"></div>"
                        "</form>";

        var $form = $(formString);
        var that = this;
        $form.ajaxForm({
            beforeSubmit: function(a,f,o) {

                o.dataType = "json";
                $('#uploadLoader').removeClass("hidden");
            },
            success: function(data) {
                $('#uploadDiv').addClass("hidden");
                $('#uploadLoader').addClass("hidden");
                that.fetcher.addAndDisplayTrip(data);
            }
        });


        var $close = $("<a class=\"link\">Lukk</a>");
        $close.click(function(){

            $('#uploadDiv').addClass("hidden");
        });
        $uplDiv.append($form);
        $uplDiv.append($close);



        return $uplDiv;
    },


    addFetcher: function(fetcher){
        this.fetcher = fetcher;
    },

    CLASS_NAME: "TripOrganizer.TripUploader"

});
TripOrganizer.HeightProfileDisplayer = OpenLayers.Class({

    divId: null,
    spinner: null,
    displayingFor: null,

    initialize: function(divId){
        this.divId = divId;

    },

    hideHeightProfile: function(){
        $("#"+this.divId).html("");
    },

    displayProfileFortrack: function(trackid){
        //console.log("display height");
        $("#"+this.divId).html("");
        /*
        var opts = {
            lines: 12, // The number of lines to draw
            length: 7, // The length of each line
            width: 5, // The line thickness
            radius: 10, // The radius of the inner circle
            color: '#000', // #rbg or #rrggbb
            speed: 1, // Rounds per second
            trail: 100, // Afterglow percentage
            shadow: true // Whether to render a shadow
        };
        var target = document.getElementById(this.divId);
        //console.log("starting spinner");
        this.spinner = new Spinner(opts).spin(target);
        */
        var that = this;
        //console.log("sending request");
        $.getJSON(
                        "getTripHeights",
                        {id:trackid},
                        function(data) {
                            that.showHeightProfile(data);
                        }
                );

    },

    showHeightProfile: function(data){
        //this.spinner.stop();
        //console.log("display!");
        $.plot($("#"+this.divId), [data]);
    },

    CLASS_NAME: "TripOrganizer.HeightProfileDisplayer"

});
TripOrganizer.TripInfoDisplayer = OpenLayers.Class({

    divId: null,
    spinner: null,
    trip: null,
    map: null,
    displayTrip: false,

    initialize: function(divId){
        this.divId = divId;
    },

    setMap: function(map){
        this.map =map;
                this.map.events.on({
            'moveend': this.updateLink,
            'changelayer': this.updateLink,
            'changebaselayer': this.updateLink,
            scope: this
        });
    },

    clear: function(){
        this.displayTrip= false;
        $("#"+this.divId).html("");
        this.trip=null;
    },

    displayTripInfo: function(trip){
        this.clear();
        this.displayTrip=true;
        this.trip=trip;

        //console.log("display trip info");

        var desc = "";
        if(trip.description){
            desc = "<div class='descr'>" + trip.description +"</div>"
        }

        var speed = this.round((trip.distance/trip.duration)*3.6,2);

                var $body = $("<div class=\"tripbody\" id=\"body_for_"+ trip.id +"\">").html(
                    desc +
                    "<p><b>Start:</b> " + trip.start+"</p>"+
                    "<p><b>Stopp:</b> " + trip.stop+"</p>" +
                    "<p><b>Total tid:</b> " + this.convertTime(trip.duration)  + "</p>" +
                    "<p><b>Lengde:</b> " + this.meterToKm(trip.distance)  + " km</p>" +
                    "<p><b>Gjennomsnittsfart:</b> " + speed + " km/t</p>" +
                    "<p><b>Permalenke:</b><br /><a href='' target='blank' id='perma'>Permalink</a></p>"
                );
        $("#"+this.divId).append("<h3>"+trip.name+"</h3>");
        $("#"+this.divId).append($body);
        this.updateLink();
    },

    updateLink: function(){
        //console.log("updateLInk ", this.displayTrip);
        if(this.displayTrip){
           // console.log("map moved! ", this.createParams());
            var perma = document.getElementById("perma");
            var paramstring = OpenLayers.Util.getParameterString(this.createParams());
            perma.innerHTML = "showTrip?"+paramstring;
            perma.href="showTrip?"+paramstring;
        }
    },


    setText: function(text){
        var div = document.createElement("div");
        div.className="vertContainer";
        var p = document.createElement("p");
        p.innerHTML=text;
        p.className="customtext";
        div.appendChild(p);
        document.getElementById(this.divId).appendChild(div);
    },


    showSpinner: function(){
        this.clear();
        var img = document.createElement("img");
        img.setAttribute("src","gfx/ajax-loader.gif");
        img.className = "spinner";
        document.getElementById(this.divId).appendChild(img);
    },

    createParams: function() {
        var center = this.map.getCenter();
        var params = {};
        params.zoom = this.map.getZoom();
        params.lat = center.lat;
        params.lon = center.lon;

        params.layerId = this.map.baseLayer.layerId;
        params.trip = this.trip.id;
        return params;
    },

    convertTime: function(a){
        var hours=Math.floor(a/3600);
        var minutes=Math.floor(a/60)-(hours*60);
        var seconds=a-(hours*3600)-(minutes*60);
        return hours +"t " + minutes + "m " + seconds +"s";
    },

    meterToKm: function(meter){
        var km = meter/1000;
        return this.round(km,2);
    },

    round: function(n,d){
        var factor = Math.pow(10,d);
        return Math.round(n * factor) / factor;
    },

    CLASS_NAME: "TripOrganizer.TripInfoDisplayer"

});
