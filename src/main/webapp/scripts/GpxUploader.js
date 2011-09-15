window.TripOrganizer = {};

        TripOrganizer.types ={
            "hiking":"Fjelltur",
            "jogging":"Jogging",
            "cycling":"Sykling",
            "car":"Biltur",
            "nordicski":"Skitur",
            "swimming":"Svømming",
            "rollerskate":"Rulleskøyter",
            "snowshoeing":"Truger",
            "motorbike":"Motorsykkel",
            "atv":"ATV",
            "snowmobiling":"Snøscooter",
            "default":"Annet"
        };
function setupMap(perma,lon,lat,zoom,layerId,wkt) {


    if(!perma){
        var tripDisplayer = new TripOrganizer.TripInfoDisplayer("tripdetail");
        tripDisplayer.setText("Velg en tur i menyen!");
        var uploader = new TripOrganizer.TripUploader(false);
        var tripFetcher = new TripOrganizer.TripFetcher("trips");
        tripFetcher.addTripDisplayer(tripDisplayer);
        tripFetcher.getTrips();

        tripFetcher.addUploadManager(uploader);
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
    var cLayer = new OpenLayers.Layer.Vector("Turpunkter",{displayInLayerSwitcher:true,styleMap: centroidStyleMap});
    if(!perma){
        tripFetcher.addLayer(featureLayer);
    }

    map.addControl(new OpenLayers.Control.LayerSwitcher());

    if(typeof(google) != "undefined"){
        map.addLayers([wms,wms2, gmap, mapnik,gsat,cLayer, featureLayer]);
    }
    else {
        map.addLayers([wms,wms2, mapnik, cLayer, featureLayer]);
    }



    if(!perma){
        var flickr = new TripOrganizer.FlickrLoader(map);
        tripFetcher.addImageLoader(flickr);
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
            //console.log(wkt[j]);
            features.push(format.read(wkt[j]));
        }
        featureLayer.addFeatures(features);

    }
    else {
        map.setCenter(new OpenLayers.LonLat(1932453.2623743,9735786.7850962),5);
        var centroidFetcher = new TripOrganizer.TripCentroidDisplayer(cLayer);
        centroidFetcher.displayCentroids(false);

        cLayer.events.on({
                        'featureselected': function(evt) {
                            var id = evt.feature.attributes.tripid;
                            tripFetcher.displayTrip(id);
                        }
                    });
        tripFetcher.events.on({
            'tripadded':function(evt){
                centroidFetcher.displayCentroids(true);
            }
        });
        tripFetcher.events.on({
            'tripdeleted':function(evt){
                centroidFetcher.displayCentroids(false);
            }
        });
        tripFetcher.events.on({
            'tripupdated':function(evt){
                centroidFetcher.displayCentroids(true);
            }
        });


    }

}
TripOrganizer.TripFetcher = OpenLayers.Class({

    div: null,
    tripLayer: null,
    trips: [],
    tripMapDisplayer: null,
    tripDisplayer: null,
    events: null,
    map: null,
    EVENT_TYPES: ["tripadded","tripdeleted","tripupdated"],


    initialize: function(div,options){
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        this.div=div;
    },

    setMap: function(map){
      this.map=map;
    },

    addLayer:function(layer){
        this.tripMapDisplayer = new TripOrganizer.TripMapDisplayer(layer,{parent:this});
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
        displayer.parent = this;
      this.tripDisplayer = displayer;
    },

    addUploadManager: function(uploader){
        uploader.addFetcher(this);
    },

    addImageLoader: function(imgloader){
        this.tripDisplayer.addImageLoader(imgloader);
    },

  /*  addHeightDisplayer: function(heightDisplayer){
        this.heightDisplayer= heightDisplayer;
    },
*/
    addAndDisplayTrip: function(trip){
        this.events.triggerEvent("tripadded");
        this.trips.push(trip);
        this.tripMapDisplayer.showTrip(trip);

        this.createItem(trip,false,true,this);
        this.tripDisplayer.displayTripInfo(trip);
  //      this.heightDisplayer.displayProfileFortrack(trip.id);
        this.activeTrip=trip.id;
        //this.heightDisplayer.hideHeightProfile();
        this.redraw();
    },


    displayTrip: function(id){
        if(id!=this.activeTrip){
            $('#head_for_'+id).removeClass("closed").addClass("open");
            this.activeTrip=id;
            this.redraw();
            this.tripDisplayer.showSpinner();
    //        this.heightDisplayer.hideHeightProfile();
            this.tripMapDisplayer.hideTrip();
            var that = this;
            $.getJSON(
                "getTrip",
                {
                    id:id,
                    geom: true
                },
                function(trip) {
                    //console.log(trip);
                    that.doDisplayTrip(trip);
                }
            );
        }
    },

    doDisplayTrip: function(trip){
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
                //$('#body_for_'+id).removeClass("hidden");

                that.displayTrip(id);


            }
            else {
                that.tripDisplayer.clear();
        //        that.heightDisplayer.hideHeightProfile();
                that.tripMapDisplayer.hideTrip();
                that.activeTrip=null;
                //$('#body_for_'+id).addClass("hidden");
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
          //  that.heightDisplayer.displayProfileFortrack(id);
        });
        $body.append($link);


        return $body;

    },

    deleteTrip: function(id){
        this.activeTrip=null;
        console.log("delete "+ id);
        console.log(this.trips);
        for(var idx in this.trips){
            if(this.trips.hasOwnProperty(idx)){
                console.log(this.trips[idx].id);
                if(this.trips[idx].id == id){
                    console.log("del!");
                    delete this.trips[idx];
                }
            }
        }
        console.log(this.trips);
        $("#head_for_"+id).remove();

        this.tripMapDisplayer.hideTrip();
        this.tripDisplayer.clear();
        this.events.triggerEvent("tripdeleted");
        this.tripDisplayer.setText("Velg en tur i menyen!");
        this.redraw();
    },

    CLASS_NAME: "TripOrganizer.TripFetcher"

});
TripOrganizer.TripMapDisplayer = OpenLayers.Class({
    layer: null,
    trips: null,
    format: new OpenLayers.Format.WKT(),

    initialize: function(layer,options){
        OpenLayers.Util.extend(this, options);
        this.layer= layer;

    },

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
                        "getTrip",
                        {
                            id:trip.id,
                            geom:true
                        },
                        function(trips) {
                            //console.log(trips);
                            that.replaceTrip(trips);
                        }
                );
        }
    },

    hideTrip: function(){
        //console.log("hide trip ", id);
        var rem = [];
        for(var i=0;i<this.layer.features.length;i++){

                rem.push(this.layer.features[i]);

        }
        this.layer.destroyFeatures(rem);
    },

    CLASS_NAME: "TripOrganizer.TripMapDisplayer"

});
TripOrganizer.TripUploader = OpenLayers.Class({

    uploadForm: null,
    update: null,

    initialize: function(update,options){
        OpenLayers.Util.extend(this, options);
        this.update = update;

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
        this.uploadForm = this.createUploadForm();
        $("#"+div).append(this.uploadForm);
    },

    hideUploadForm: function(){
        this.uploadForm.remove();
    },

    createUploadForm: function(){
        var target="uploadGpx";
        var text="Last opp";
        var name ="";
        var desc ="";
        var type="hiking";
        var tags="";
        if(this.update){
            target="updateTrack";
            text="Oppdater";
            name = this.trip.name;
            if(this.trip.tags){
                tags=this.trip.tags;
            }
            if(this.trip.description){
                desc=this.trip.description;
            }
            type=this.trip.type;
        }
        $uplDiv = $("<div id=\"uploadDiv\" class=\"uploadForm\"></div>");


        var formString;
        if(!this.update){
            formString= "<form id='uploadForm' action='"+target+"' method=\"POST\" enctype=\"multipart/form-data\"  accept-charset=\"UTF-8\">";
            formString+= "<input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\"10000000\" />"+
                "GPX-fil: <input id=\"upload_file\" type=\"file\" name=\"file\" /><br />";
        }
        else {
            formString= "<form id='uploadForm' action='"+target+"' method=\"POST\" accept-charset=\"UTF-8\">";
            formString+= "<input type='hidden' name='tripid' value='"+ this.trip.id+"' />";
        }
        formString+="Navn: <input id=\"upload_name\" type=\"text\" name=\"name\" value='"+name+"'><br />"+
        "Flickr-tags: <input id=\"upload_flickr\" type=\"text\" name=\"tags\" value='"+tags+"'><br />"+
            "Aktivitetstype: <select name='type'>";
        for(var key in TripOrganizer.types){
            if(key == type){
                formString+="<option value='"+key+"' selected='true'>"+ TripOrganizer.types[key]+"</option>";
            }
            else {
                formString+="<option value='"+key+"'>"+ TripOrganizer.types[key]+"</option>";
            }

        }
        formString+="</select><br/>"+
            "Beskrivelse: <br /><textarea id=\"upload_desc\" name=\"desc\">"+ desc+ "</textarea><br />"+
            "<input type=\"submit\" value='"+text+"' />"+
            "<div id=\"uploadLoader\" class=\"hidden\"><img src=\"gfx/ajax-loader.gif\"></div>"+
            "</form>";

        var $form = $(formString);
        var that = this;
        $form.ajaxForm({
            beforeSubmit: function(a,f,o) {
                console.log("SUBMIT!!!");
                o.dataType = "json";
                $('#uploadLoader').removeClass("hidden");
                $('#uploadErr').addClass("hidden");
                $('#uploadErr').html("");
            },
            success: function(data) {
                //console.log(data);
                if(that.update){
                    that.hideUploadForm();

                    $.getJSON(
                        "getTrip",
                        {
                            id:that.trip.id,
                            geom: false
                        },
                        function(trip) {
                            //console.log(trips);
                            //that.doDisplayTrip(trips);
                            that.updateTrip(trip);
                        }
                    );
                    //todo: call trip displayer with updated data..
                }
                else {
                    if(data.status == "OK"){
                        that.hideUploadForm();
                        that.getTrip(data.id);
                        that.fetcher.tripDisplayer.showSpinner();
                    }
                    else {
                        $('#uploadLoader').addClass("hidden");
                        $('#uploadErr').removeClass("hidden");
                        $('#uploadErr').html("<h5>En feil oppsto</h5><p></p>"+data.errMsg+"</p>");
                    }
                }
            }
        });


        var $close = $("<a class=\"link\">Lukk</a>");
        $close.click(function(){
            console.log("close");
            that.hideUploadForm();
        });
        $uplDiv.append($form);
        $uplDiv.append($("<div id=\"uploadErr\" class=\"error hidden\">"));
        $uplDiv.append($close);


        return $uplDiv;
    },

    updateTrip: function(trip){
        $("#head_for_"+trip.id).html("<h4>"+ trip.name+"</h4>");
        this.parent.displayTripInfo(trip,true);
    },

    getTrip: function(id){
        var that = this;
        $.getJSON(
            "getTrip",
            {
                id:id,
                geom: true
            },
            function(trip) {
                //console.log(trips);
                //that.doDisplayTrip(trips);
                that.fetcher.addAndDisplayTrip(trip);
            }
        );
        //

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
    active: false,

    initialize: function(divId){
        this.divId = divId;

    },

    hideHeightProfile: function(){
        $("#"+this.divId).html("");
        this.active=false;
    },

    displayProfileFortrack: function(trackid){
        this.active=true;
        //console.log("display height");
        $("#"+this.divId).html("");
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

        $.plot($("#"+this.divId), [data]);
    },

    CLASS_NAME: "TripOrganizer.HeightProfileDisplayer"

});
TripOrganizer.SpeedProfileDisplayer = OpenLayers.Class({

    divId: null,
    spinner: null,
    displayingFor: null,
    active: false,

    initialize: function(divId){
        this.divId = divId;

    },

    hideProfile: function(){
        $("#"+this.divId).html("");
        this.active=false;
    },

    displayProfileFortrack: function(trackid){
        this.active=true;
        //console.log("display height");
        $("#"+this.divId).html("");
        var that = this;
        //console.log("sending request");
        $.getJSON(
                        "getTripSpeeds",
                        {id:trackid},
                        function(data) {
                            that.showProfile(data);
                        }
                );

    },

    showProfile: function(data){

        $.plot($("#"+this.divId), [data]);
    },

    CLASS_NAME: "TripOrganizer.SpeedProfileDisplayer"

});
TripOrganizer.TripInfoDisplayer = OpenLayers.Class({

    divId: null,
    spinner: null,
    trip: null,
    map: null,
    displayTrip: false,
    graphDisplayer: null,
    imgloader: null,

    initialize: function(divId){
        this.divId = divId;
    },

    addImageLoader: function(imgloader){
        this.imgloader = imgloader;

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
        console.log(this.graphDisplayer);
        if(this.graphDisplayer){

            this.graphDisplayer.clear();
        }
        if(this.imgloader){
            this.imgloader.clear();
        }
        $("#"+this.divId).html("");
        this.trip=null;
    },

    displayTripInfo: function(trip,update){
        this.clear();
        this.displayTrip=true;
        this.trip=trip;
        if(!update){
            this.graphDisplayer = new TripOrganizer.GraphDisplayer("ele","graphHeader",trip.id,"");
            this.graphDisplayer.display();
        }
        else {
            this.parent.events.triggerEvent("tripupdated");
        }
        this.imgloader.load(trip.id);

        //console.log("display trip info");

        var desc = "";
        if(trip.description){
            desc = "<dd class='descr'>" + trip.description +"</dd>"
        }

        var heightDiff = trip.heights.maxHeight-trip.heights.minHeight;

        var type = "Annet";
        if(trip.type){
            type=TripOrganizer.types[trip.type];
        }

        var $body = $("<div class=\"tripbody\" id=\"body_for_"+ trip.id +"\">").html(
            "<dl>"+
                desc +
                "<dt>Aktivitetstype:</dt> <dd>" + type+"</dd>"+
                "<dt>Start:</dt> <dd>" + trip.start+"</dd>"+
                "<dt>Stopp:</dt> <dd>" + trip.stop+"</dd>" +
                "<dt>Total tid:</dt> <dd>" + this.convertTime(trip.times.totalTime)  + "</dd>" +
                "<dt>Aktiv tid:</dt> <dd>" + this.convertTime(trip.times.activeTime)  + "</dd>" +
                "<dt>Lengde (2d):</dt> <dd>" + this.meterToKm(trip.lenghts.length2d)  + " km</dd>" +
                "<dt>Lengde (3d):</dt> <dd>" + this.meterToKm(trip.lenghts.length3d)  + " km</dd>" +
                "<dt>Gjennomsnittsfart:</dt> <dd> " + this.calcSpeed(trip.lenghts.length3d,trip.times.totalTime) + " km/t</dd>" +
                "<dt>Gjennomsnittsfart uten pauser:</dt> <dd> " + this.calcSpeed(trip.lenghts.length3d,trip.times.activeTime) + " km/t</dd>" +
                "<dt>Stigning opp:</dt> <dd>" + this.meterToKm(trip.lenghts.lengthAsc)  + " km, "+
                        this.convertTime(trip.times.ascTime)  +", "+
                        this.calcSpeed(trip.lenghts.lengthAsc,trip.times.ascTime)  + " km/t</dd>" +
                "<dt>Stigning ned:</dt> <dd>" + this.meterToKm(trip.lenghts.lengthDesc)  + " km, " +
                        this.convertTime(trip.times.descTime)  + ", " +
                        this.calcSpeed(trip.lenghts.lengthDesc,trip.times.descTime)  + " km/t</dd>" +
                "<dt>Flatt terreng:</dt> <dd>" + this.meterToKm(trip.lenghts.lengthFlat)  + " km, " +
                    this.convertTime(trip.times.flatTime)  + ", "+
                        this.calcSpeed(trip.lenghts.lengthFlat,trip.times.flatTime)  + " km/t</dd>" +
                "<dt>Max høyde:</dt> <dd>" + this.round(trip.heights.maxHeight,2)  + " m.o.h.</dd>" +
                "<dt>Min høyde:</dt> <dd>" + this.round(trip.heights.minHeight,2)  + " m.o.h.</dd>" +
                "<dt>Total positiv stigning:</dt> <dd>" + this.round(trip.heights.totalAsc,2)  + " m.</dd>" +
                "<dt>Total negativ stigning:</dt> <dd>" + this.round(Math.abs(trip.heights.totalDesc),2)  + " m</dd>" +
                "<dt>Max høydeforskjell:</dt> <dd>" + this.round(heightDiff,2)  + " m</dd>" +
                "<dt>Permalenke:</dt><dd> <a href='' target='blank' id='perma'>Permalink</a></dd>"+
                "<dt>Operasjoner:</dt><dd> <a id='edit'>Rediger</a> <a id='del'>Slett</a></dd>"+
                "</dl>"
        );
        var that = this;

        var updater = new TripOrganizer.TripUploader(true,{trip:trip,parent:this});
        $("#"+this.divId).append("<h3>"+trip.name+"</h3>");
        $("#"+this.divId).append($body);
        this.updateLink();
        $("#del").click(function(){

            var ok = confirm("Vil du virkelig slette denne turen?");
            console.log("delete "+ that.trip.id + " " + ok);
            if(ok){
                $.getJSON(
                "deleteTrip",
                {
                    id:that.trip.id
                },
                function(ok) {
                    if(ok){
                        that.parent.deleteTrip(that.trip.id);
                    }

                }
            );
            }
        });
        $("#edit").click(function(){
                console.log("edit"+ that.trip.id);
                updater.showUploadForm("upload");
        });
    },

    updateLink: function(){
        //console.log("updateLInk ", this.displayTrip);
        if(this.displayTrip){
            // console.log("map moved! ", this.createParams());
            var perma = document.getElementById("perma");
            var paramstring = OpenLayers.Util.getParameterString(this.createParams());
            perma.innerHTML = "Link";
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
        if(this.graphDisplayer){
            this.graphDisplayer.showSpinner();
        }
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


    //TODO: move to util class
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

    calcSpeed: function(dist,time){
      return this.round((dist/time)*3.6,2)
    },

    CLASS_NAME: "TripOrganizer.TripInfoDisplayer"

});
TripOrganizer.TripCentroidDisplayer = OpenLayers.Class({

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
                                clickout: false,
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

    displayCentroids: function(update){
        var that = this;
       $.getJSON(
            "getCentroids",
            {},
            function(centroids) {
                //console.log(trips);
                that.doDisplayCentroids(centroids,update);
            }
        );
    },

    doDisplayCentroids: function(centroids,update){

        var features = [];
        this.layer.destroyFeatures();
        var bounds =  new OpenLayers.Bounds();
        for(var i=0;i<centroids.length;i++){
            var feature =this.format.read(centroids[i].geom);
                bounds.extend(feature.geometry.getBounds());
                var icon ="gfx/icons/default.png";
                if(centroids[i].type){
                   icon = "gfx/icons/"+centroids[i].type + ".png";
                }
                feature.style = {
                    externalGraphic:icon,
                    graphicWidth:32,
                    graphicHeight:37,
                    cursor: "pointer",
                    graphicTitle: centroids[i].title
                };
                feature.attributes.tripid=centroids[i].id;
                features.push(feature);
        }
        this.layer.addFeatures(features);
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

    CLASS_NAME:"TripOrganizer.TripCentroidDisplayer"
});
TripOrganizer.GraphDisplayer = OpenLayers.Class({

    graphDivId: null,
    headerDivId: null,
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

    initialize: function(graphDivId,headerDivId,trackid,initType){
        this.graphDivId = graphDivId;
        this.headerDivId=headerDivId;
        this.trackid = trackid;
    },

    clear: function(){
        this.hideGraph();
        $("#"+this.headerDivId).html("");
    },

    hideGraph: function(){
        console.log("Hide");
        $("#"+this.graphDivId).html("");
        this.active=false;
    },

    display: function(){
        this.showSpinner();
        this.generateMenu();
        this.active=true;
        //console.log("display height");
        $("#"+this.divId).html("");
        var that = this;
        //console.log("sending request");
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
            var $li = $("<li id='li_for_"+ key+"' class='graphChooserLi'>"+this.types[key].name+"</li>");
            if(key ==this.initType){
                $li.addClass("selectedLi");
            }
            $li.click(function(){

                var id = this.id.replace("li_for_","");
                if(id!=that.initType){
                    that.initType=id;
                    that.generateMenu();
                    that.display();
                }

            });
            $ul.append($li);
        }
        $("#"+this.headerDivId).html($ul);
    },

    showSpinner: function(){
        $("#"+this.graphDivId).html("");
        var img = document.createElement("img");
        img.setAttribute("src","gfx/ajax-loader.gif");
        img.className = "spinner";
        document.getElementById(this.graphDivId).appendChild(img);
    },

    showGraph: function(data){
        $("#"+this.graphDivId).html("");
        $.plot(
            $("#"+this.graphDivId),
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

    CLASS_NAME: ""
});
TripOrganizer.FlickrLoader = OpenLayers.Class({


    url: null,
    layer:null,
    selectCtrl: null,
    map:null,
    initialize: function(map){
        this.map=map;
        var style = {
            externalGraphic:"gfx/photo.png",
            graphicHeight: 16,
            graphicWidth:16
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
                console.log("!!!!", xml);
                that.parseData(xml);
            }
        });
    },

    parseData: function(doc) {
        console.log("loaded", doc);
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
             
             console.log("this, ", this);
         };
         img.src = feature.attributes.imageUrl;


         this.unselect(feature);
     },

    CLASS_NAME: "TripOrganizer.FlickrLoader"

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

        var string ="<table><tr>"+
            "<td>Fullt navn:</td>"+
            "<td> <input id='fullname' type='text' name='fullname' value='"+user.fullname+"' /></td>"+
        "</tr>"+
            "<tr>"+
            "<td>Flickr ID:</td>"+
            "<td> <input id='flickrid' type='text' name='flickrid'  value='"+user.flickrId+"'/> <a href='http://support.statsmix.com/kb/faq/how-do-i-find-my-flickr-id' target='_blank'>Huh?</a></td>"+
        "</tr>"+
        "<tr>"+
            "<td>E-Post:</td>"+
            "<td><input id='email' type='text' name='email' value='"+user.email+"'/></td>"+
        "</tr>"+
        "<tr>"+
            "<td colspan='2'><input type='submit' value='Oppdater' id='updateUser'/></td>"+
        "</tr>"+
    "</table>";



        $.fancybox({
            content: string
        });

        $("#updateUser").click(function(){

            var name = document.getElementById("fullname").value;
            var flickrid = document.getElementById("flickrid").value;
            var email = document.getElementById("email").value;

            console.log(name + " " + flickrid + " " + email);

            $.getJSON(
                "updateUser",
                {
                    name:name,
                    flickrid:flickrid,
                    email:email

                },
                function(response) {
                    $.fancybox.close();
                }
            );

        });

    },




    CLASS_NAME: "TripOrganizer.ProfileEditor"

});




