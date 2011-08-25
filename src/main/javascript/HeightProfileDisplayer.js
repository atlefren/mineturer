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