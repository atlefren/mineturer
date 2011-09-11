TripOrganizer.TripFetcher = OpenLayers.Class({

    div: null,
    tripLayer: null,
    trips: [],
    tripMapDisplayer: null,
    imgloader: null,
    //heightDisplayer: null,
    tripDisplayer: null,
    events: null,
    EVENT_TYPES: ["tripadded"],


    initialize: function(div,options){
        OpenLayers.Util.extend(this, options);
        this.events = new OpenLayers.Events(this, null, this.EVENT_TYPES);
        this.div=div;
    },

    addLayer:function(layer){
        this.tripMapDisplayer = new TripOrganizer.TripMapDisplayer(layer);
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

    addImageLoader: function(imgloader){
        this.imgloader = imgloader;
    },

  /*  addHeightDisplayer: function(heightDisplayer){
        this.heightDisplayer= heightDisplayer;
    },
*/
    addAndDisplayTrip: function(trip){
        this.events.triggerEvent("tripadded");
        this.trips.push(trip);
        this.tripMapDisplayer.showTrip(trip);
        this.imgloader.load(trip.id);
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
                "getTripGeom",
                {id:id},
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
        console.log("load img for",trip.id);
        this.imgloader.load(trip.id);
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

    CLASS_NAME: "TripOrganizer.TripFetcher"

});