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

        var string = "<h3>Last opp GPX-fil:</h3>"+
            "<form accept-charset='UTF-8'  method='POST' action='updateTrack' id='updateForm'>"+
            "<input type='hidden' name='tripid' value='"+ tripData.id+"'/>"+
        "<table>" +
        "<tr>"+
            "<td>Tittel:</td>"+
            "<td><input type='text' name='name' id='update_name' value='"+tripData.name+"'></td>"+
        "</tr>"+

        "<tr>"+
            "<td>Aktivitetstype:</td>"+
            "<td><select name='type'>"+select+"</select></td>"+
        "</tr>"+
        "<tr>"+
            "<td>Flickr-tags:</td>"+
            "<td><input type='text' name='tags' id='update_flickr' value='"+tags+"'></td>"+
        "</tr>"+
        "<tr >"+
            "<td>Beskrivelse:</td>"+
            "<td><textarea name='desc' id='update_desc'>"+ desc+"</textarea><br></td>"+
        "</tr>"+
        "<tr>"+
            "<td colspan='2'><input type='submit' value='Oppdater'/></td>"+
        "</tr>"+
    "</table>"+
    "<div id='updateLoader' class='hidden'><img src='gfx/ajax-loader.gif'> Oppdaterer..</div>";


        $.fancybox({
            content: string
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



