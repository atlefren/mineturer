TripOrganizer.TripInfoDisplayer = OpenLayers.Class({

    divId: null,
    spinner: null,
    trip: null,
    map: null,
    displayTrip: false,
    graphDisplayer: null,

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
        this.graphDisplayer = new TripOrganizer.GraphDisplayer("ele","graphHeader",trip.id,"");
        this.graphDisplayer.display();

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
                "<dt>Operasjoner:</dt><dd> <a href='#'  id='edit'>Rediger</a> <a href='#' id='del'>Slett</a></dd>"+
                "</dl>"
        );
        var that = this;

        var updater = new TripOrganizer.TripUploader(true,{trip:trip});
        $("#"+this.divId).append("<h3>"+trip.name+"</h3>");
        $("#"+this.divId).append($body);
        this.updateLink();
        $("#del").click(function(){

            var ok = confirm("Vil du virkelig slette denne turen?");
            console.log("delete "+ that.trip.id + " " + ok);
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