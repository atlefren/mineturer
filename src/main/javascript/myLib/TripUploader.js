TripOrganizer.TripUploader = OpenLayers.Class({


    list: null,

    initialize: function(list){
        this.list = list;
    },

    showUploadForm: function(){
        $.fancybox.hideActivity();

        var select ="";
        var type="hiking";
        for(var key in TripOrganizer.types){
            if(key == type){
                select+="<option value='"+key+"' selected='true'>"+ TripOrganizer.types[key]+"</option>";
            }
            else {
                select+="<option value='"+key+"'>"+ TripOrganizer.types[key]+"</option>";
            }
        }

        var string = "<h3>Last opp GPX-fil:</h3>"+
            "<form accept-charset='UTF-8' enctype='multipart/form-data' method='POST' action='uploadGpx' id='uploadForm'>"+
            "<input type='hidden' value='10000000' name='MAX_FILE_SIZE'>"+
        "<table><tr>"+
            "<td>GPX-fil::</td>"+
            "<td> <input type='file' name='file' id='upload_file'></td>"+
        "</tr>"+
            "<tr>"+
            "<td>Tittel:</td>"+
            "<td><input type='text' value='' name='name' id='upload_name'></td>"+
        "</tr>"+

        "<tr>"+
            "<td>Aktivitetstype:</td>"+
            "<td><select name='type'>"+select+"</select></td>"+
        "</tr>"+
        "<tr>"+
            "<td>Flickr-tags:</td>"+
            "<td><input type='text' value='' name='tags' id='upload_flickr'></td>"+
        "</tr>"+
        "<tr >"+
            "<td>Beskrivelse:</td>"+
            "<td><textarea name='desc' id='upload_desc'></textarea><br></td>"+
        "</tr>"+
        "<tr>"+
            "<td colspan='2'><input type='submit' value='Last opp'/></td>"+
        "</tr>"+
    "</table>"+
    "<div id='uploadLoader' class='hidden'><img src='gfx/ajax-loader.gif'> Laster opp</div>"+
    "<div id='uploadErr' class='error hidden'>";

        $.fancybox({
            content: string
        });

        var that = this;
        $("#uploadForm").ajaxForm({
            beforeSubmit: function(a,f,o) {
                o.dataType = "json";
                $('#uploadLoader').removeClass("hidden");
                $('#uploadErr').addClass("hidden");
                $('#uploadErr').html("");
            },
            success: function(data) {
                if(data.status == "OK"){
                    $.getJSON(
                        "getCentroid",
                        {
                            id:data.id
                        },
                        function(trip) {
                            $('#uploadLoader').addClass("hidden");
                            that.list.addTrip(trip);
                            $.fancybox.close();

                        }
                    );

                }
                else {
                    $('#uploadLoader').addClass("hidden");
                    $('#uploadErr').removeClass("hidden");
                    $('#uploadErr').html("<h5>En feil oppsto</h5><p></p>"+data.errMsg+"</p>");
                }
            }
        });

    },
    CLASS_NAME: "TripOrganizer.TripUploader"
});



