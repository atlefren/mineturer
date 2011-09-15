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