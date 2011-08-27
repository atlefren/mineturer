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