TripOrganizer.Trip = OpenLayers.Class({

    id:null,
    title:null,
    type: null,
    centroid: null,
    tripLayer:null,
    visible: null,
    list: null,


    initialize: function(id,title,type,centroid,tripLayer,visible,list,options){
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        this.id=id;
        this.title=title;
        this.type=type;
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
        if(document.getElementById("perma")){
            // console.log("map moved! ", this.createParams());
            var perma = document.getElementById("perma");

            var params = TripOrganizer.Util.getMapParams(this.tripLayer.map);
            params.trip = this.id;
            var paramstring = OpenLayers.Util.getParameterString(params);
            perma.innerHTML = "Link";
            perma.href="showTrip?"+paramstring;
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
                "<dt>Operasjoner:</dt><dd> <a id='edit'>Rediger</a> <a id='del'>Slett</a></dd>"+
                "</dl>"
        );
        var that = this;

        $("#tripdetail").html("");
        $("#tripdetail").append("<h3>"+this.tripData.name+"</h3>");
        $("#tripdetail").append($body);

        $("#del").click(function(){

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

        $("#edit").click(function(){
            var updater = new TripOrganizer.TripUpdater();
            updater.showUpdateForm(that.tripData,that);

        });

        this.updateLink();
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