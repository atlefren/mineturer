TripOrganizer.ImageLoader = OpenLayers.Class({


    url: null,
    layer:null,
    selectCtrl: null,
    map:null,
    initialize: function(map){
        this.map=map;
        var style = {
            externalGraphic:"gfx/photo.png",
            graphicHeight: 16,
            graphicWidth:16,
            cursor:"pointer"
        };
        this.layer = new OpenLayers.Layer.Vector("Images", {style:style});
        map.addLayer(this.layer);
        this.selectCtrl = new OpenLayers.Control.SelectFeature(this.layer,{onSelect: this.onFeatureSelect});
        map.addControl(this.selectCtrl);
        this.clear();
    },

    clear: function(){
        this.selectCtrl.deactivate();
        this.layer.destroyFeatures();
        if(this.layer.map){
            this.map.removeLayer(this.layer);
        }
    },

    load: function(tripid){
        this.clear();
        var that = this;
        $.ajax({
            type: "GET",
            url: "getGeoRSS?tripid="+tripid,
            dataType: "xml",
            success: function(xml) {
                that.parseData(xml);
            }
        });
    },

    parseData: function(doc) {
        if (!doc || !doc.documentElement) {
            doc = OpenLayers.Format.XML.prototype.read(ajaxRequest.responseText);
        }

        var options ={
            externalProjection: new OpenLayers.Projection("EPSG:4326"),
            internalProjection:new OpenLayers.Projection("EPSG:900913"),
            createFeatureFromItem: function(item) {
                        var feature = OpenLayers.Format.GeoRSS.prototype.createFeatureFromItem.apply(this, arguments);
                        var links =this.getElementsByTagNameNS(item, "*", "link");
                        for(var i=0;i<links.length;i++){
                            var isImage = false;
                            for(var j=0;j<links[i].attributes.length;j++){
                                if(links[i].attributes[j].localName=="rel" && links[i].attributes[j].nodeValue=="enclosure"){
                                    isImage=true;
                                }
                                if(links[i].attributes[j].localName=="href" && isImage){
                                    feature.attributes.imageUrl =links[i].attributes[j].nodeValue;
                                }
                            }
                        }
                        return feature;
                    }
        };

        var format = new OpenLayers.Format.GeoRSS(options);
        var features = format.read(doc);
        if(features.length >0){
            this.map.addLayer(this.layer);
            this.layer.addFeatures(features);
            this.selectCtrl.activate();
        }
    },

     onFeatureSelect: function(feature) {
        $.fancybox.showActivity();
         var img = new Image();
         img.onload = function() {
             $.fancybox.hideActivity();
             $.fancybox({
                 content: "<div><img src='"+feature.attributes.imageUrl+"' ></div>",
                 width: this.width,
                 height: this.height
             });
         };
         img.src = feature.attributes.imageUrl;


         this.unselect(feature);
     },

    CLASS_NAME: "TripOrganizer.ImageLoader"

});



