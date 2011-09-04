TripOrganizer.GraphDisplayer = OpenLayers.Class({

    graphDivId: null,
    headerDivId: null,
    spinner: null,
    trackid: null,
    active: false,
    initType:"height_dist",
    types: {
        "height_dist":{name:"Høyde-Avstand"},
        "height_time":{name:"Høyde-Tid"},
        "speed_dist":{name:"Fart-Avstand"},
        "speed_time":{name:"Fart-Tid"},
        "dist_time":{name:"Avstand-Tid"}
        },

    initialize: function(graphDivId,headerDivId,trackid,initType){
        this.graphDivId = graphDivId;
        this.headerDivId=headerDivId;
        this.trackid = trackid;
    },

    hideGraph: function(){
        $("#"+this.divId).html("");
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
                    color: "#1E13FF",
                    lines: {
                        show: true,
                        lineWidth: 1
                    }
                }
            }
        );
    },

    CLASS_NAME: ""
});