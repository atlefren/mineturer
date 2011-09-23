TripOrganizer.TripUploader = OpenLayers.Class({


    list: null,

    initialize: function(list){
        this.list = list;
    },

    showUploadForm: function(){
      

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

        var string = "<div id='upload_form_wrapper'>" +
            "<h3>Last opp GPX-fil:</h3>"+
            "<form accept-charset='UTF-8' enctype='multipart/form-data' method='POST' action='uploadGpx' id='uploadForm'>"+
            "<input type='hidden' value='10000000' name='MAX_FILE_SIZE'>"+
            "<p><label>GPX-fil:</label>"+
            "<input type='file' name='file' id='upload_file'></p>"+
            "<p><label>Tittel:</label>"+
            "<input type='text' value='' name='name' id='upload_name'></p>"+
            "<p><label>Aktivitetstype:</label>"+
            "<select id='upload_type' name='type'>"+select+"</select></p>"+
            "<p><label>Flickr-tags:</label>"+
            "<input type='text' value='' name='tags' id='upload_flickr'></p>"+
            "<p><label>Beskrivelse:</label>"+
            "<textarea name='desc' id='upload_desc'></textarea></p>"+
            "<input type='submit' value='Last opp' id='update'/>" +
            "<div id='uploadLoader' class='hidden'><img src='gfx/ajax-loader.gif'> Laster opp</div>"+
            "<div id='uploadErr' class='error hidden'>"+
            "</div>";
        $.fancybox({
            content: string,
            overlayShow: false
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



