TripOrganizer.TripUploader = OpenLayers.Class({

    uploadForm: null,
    callback: null,

    initialize: function(callback,options){
        OpenLayers.Util.extend(this, options);

        this.callback = callback;
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

        if(!this.uploadForm){

            $("#"+div).append(this.createUploadForm());
            this.uploadForm = $uplDiv;
        }
        else {
            this.uploadForm.removeClass("hidden");
        }

    },

    createUploadForm: function(){
        $uplDiv = $("<div id=\"uploadDiv\" class=\"uploadForm\"></div>");


        var formString= "<form id=\"uploadForm\" action=\"uploadGpx\" method=\"POST\" enctype=\"multipart/form-data\"  accept-charset=\"UTF-8\">"+
                        "<input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\"10000000\" />"+
                        "GPX-fil: <input id=\"upload_file\" type=\"file\" name=\"file\" /><br />"+
                        "Navn: <input id=\"upload_name\" type=\"text\" name=\"name\"><br />"+
                        "Beskrivelse: <br /><textarea id=\"upload_desc\" name=\"desc\"></textarea><br />"+
                         "<input type=\"submit\" value=\"Last opp\" />"+
                        "<div id=\"uploadLoader\" class=\"hidden\"><img src=\"gfx/ajax-loader.gif\"></div>"
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
                that.getTrip(data.id);
                that.fetcher.tripDisplayer.showSpinner();
                //console.log(data);
                if(data.status == "OK"){
                    $('#uploadErr').addClass("hidden");
                    $('#uploadErr').html("");
                    $('#upload_file').val('');
                    $('#upload_name').val('');
                    $('#upload_desc').val('');
                    $('#uploadDiv').addClass("hidden");
                    $('#uploadLoader').addClass("hidden");
                }
                else {
                    $('#uploadLoader').addClass("hidden");
                    $('#uploadErr').removeClass("hidden");
                    $('#uploadErr').html("<h5>En feil oppsto</h5><p></p>"+data.errMsg+"</p>");
                }
            }
        });


        var $close = $("<a class=\"link\">Lukk</a>");
        $close.click(function(){
            $('#uploadErr').addClass("hidden");
            $('#uploadErr').html("");
            $('#upload_file').val('');
            $('#upload_name').val('');
            $('#upload_desc').val('');
            $('#uploadDiv').addClass("hidden");
        });
        $uplDiv.append($form);
        $uplDiv.append($("<div id=\"uploadErr\" class=\"error hidden\">"));
        $uplDiv.append($close);


        return $uplDiv;
    },

    getTrip: function(id){
        var that = this;
        $.getJSON(
            "getTripGeom",
            {id:id},
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