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


        var formString= "<form id=\"uploadForm\" action=\"/uploadGpx\" method=\"POST\" enctype=\"multipart/form-data\">"+
                        "<input type=\"hidden\" name=\"MAX_FILE_SIZE\" value=\"10000000\" />"+
                        "GPX-fil: <input type=\"file\" name=\"file\" /><br />"+
                        "Navn: <input type=\"text\" name=\"name\"><br />"+
                        "Beskrivelse: <br /><textarea name=\"desc\"></textarea><br />"+
                         "<input type=\"submit\" value=\"Last opp\" />"+
                        "<div id=\"uploadLoader\" class=\"hidden\"><img src=\"gfx/ajax-loader.gif\"></div>"
                        "</form>";

        var $form = $(formString);
        var that = this;
        $form.ajaxForm({
            beforeSubmit: function(a,f,o) {

                o.dataType = "json";
                $('#uploadLoader').removeClass("hidden");
            },
            success: function(data) {
                $('#uploadDiv').addClass("hidden");
                $('#uploadLoader').addClass("hidden");
                that.fetcher.addAndDisplayTrip(data);
            }
        });


        var $close = $("<a class=\"link\">Lukk</a>");
        $close.click(function(){

            $('#uploadDiv').addClass("hidden");
        });
        $uplDiv.append($form);
        $uplDiv.append($close);



        return $uplDiv;
    },


    addFetcher: function(fetcher){
        this.fetcher = fetcher;
    },

    CLASS_NAME: "TripOrganizer.TripUploader"

});