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
        this.display();
    },

    clear: function(){
        this.hideGraph();
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
        $("#graphHeader").html($ul);
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