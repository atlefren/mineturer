TripOrganizer.TripUpdater = OpenLayers.Class({


    callerObj: null,
    tripData:null,

    initialize: function(){
    },

    showUpdateForm: function(tripData,callObj){
        this.callObj = callObj;
        var select ="";
        var type=tripData.type;
        this.tripData=tripData;
        for(var key in TripOrganizer.types){
            if(key == type){
                select+="<option value='"+key+"' selected='true'>"+ TripOrganizer.types[key]+"</option>";
            }
            else {
                select+="<option value='"+key+"'>"+ TripOrganizer.types[key]+"</option>";
            }
        }
        var tags ="";
        if(tripData.tags){
            tags=tripData.tags;
        }

        var desc = "";
        if (tripData.description){
            desc=tripData.description;
        }


        var string = "<div id='update_trip_form_wrapper'>" +
            "<h3>Rediger tur</h3>"+
            "<form accept-charset='UTF-8'  method='POST' action='updateTrack' id='updateForm'>"+
            "<input type='hidden' name='tripid' value='"+ tripData.id+"'/>"+
            "<p><label>Tittel:</label>"+
            "<input type='text' value='"+tripData.name+"' name='name' id='update_name'></p>"+
            "<p><label>Aktivitetstype:</label>"+
            "<select name='type' id='update_type'>"+select+"</select></p>"+
            "<p><label>Flickr-tags:</label>"+
            "<input type='text' value='"+tags+"' name='tags' id='update_flickr'></p>"+
            "<p><label>Beskrivelse:</label>"+
            "<textarea name='desc' id='update_desc'>"+ desc+"</textarea></p>"+
            "<input type='submit' value='Rediger' id='update'/>" +
            "</div>";

        $.fancybox({
            content: string,
            overlayShow: false
        });

        var that = this;
        $("#updateForm").ajaxForm({
            beforeSubmit: function(a,f,o) {
                o.dataType = "json";
                $('#updateLoader').removeClass("hidden");
            },
            success: function(data) {
                $.getJSON(
                        "getTrip",
                        {
                            id:that.tripData.id,
                            geom: false
                        },
                        function(tripData) {
                            that.callObj.updateTrip(tripData);
                            $.fancybox.close();
                        }
                    );
            }
        });

    },
    CLASS_NAME: "TripOrganizer.TripUpdater"
});



