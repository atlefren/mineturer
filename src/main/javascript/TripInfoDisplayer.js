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

        var desc = "n/a";
        if(trip.description){
            desc = trip.description
        }

        var speed = this.round((trip.distance/trip.duration)*3.6,2);

                var $body = $("<div class=\"tripbody\" id=\"body_for_"+ trip.id +"\">").html(
                    "<p><b>Beskrivelse: </b></a>" + desc+"</p>"+
                    "<p><b>Start: </b></a>" + trip.start+"</p>"+
                    "<p><b>Stopp: </b></a>" + trip.stop+"</p>" +
                    "<p><b>Total tid: </b> " + this.convertTime(trip.duration)  + "</p>" +
                    "<p><b>Lengde: </b> " + this.meterToKm(trip.distance)  + " km</p>" +
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
            //console.log("setting params ", paramstring)

        }
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
        return hours +"." + minutes + "." + seconds;
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