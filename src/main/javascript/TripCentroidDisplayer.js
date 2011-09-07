TripOrganizer.TripCentroidDisplayer = OpenLayers.Class({

    format: new OpenLayers.Format.WKT(),
    layer: null,
    select: null,

    initialize: function(layer){
        this.layer = layer;
        this.setUpSelect();
    },

    setUpSelect: function(){
        this.select= new OpenLayers.Control.SelectFeature(
                            this.layer,
                            {
                                clickout: false,
                                toggle: false,
                                multiple: false,
                                hover: false,
                                toggleKey: "ctrlKey", // ctrl key removes from selection
                                multipleKey: "shiftKey", // shift key adds to selection
                                box: false
                            }
                        );

        this.layer.map.addControl(this.select);
    },

    displayCentroids: function(update){
        var that = this;
       $.getJSON(
            "getCentroids",
            {},
            function(centroids) {
                //console.log(trips);
                that.doDisplayCentroids(centroids,update);
            }
        );
    },

    doDisplayCentroids: function(centroids,update){

        var features = [];
        this.layer.destroyFeatures();
        var bounds =  new OpenLayers.Bounds();
        for(var i=0;i<centroids.length;i++){
            var feature =this.format.read(centroids[i].geom);
                bounds.extend(feature.geometry.getBounds());
                var icon ="gfx/icons/default.png";
                if(centroids[i].type){
                   icon = "gfx/icons/"+centroids[i].type + ".png";
                }
                feature.style = {
                    externalGraphic:icon,
                    graphicWidth:32,
                    graphicHeight:37,
                    cursor: "pointer",
                    graphicTitle: centroids[i].title
                };
                feature.attributes.tripid=centroids[i].id;
                features.push(feature);
        }
        this.layer.addFeatures(features);
        if(features.length >0){
            var mapExt =this.layer.map.getExtent();
            if(!update){
                if(!mapExt.containsBounds(bounds)){
                    this.layer.map.zoomToExtent(bounds);
                }
            }
        }
        this.select.activate();
    },

    CLASS_NAME:"TripOrganizer.TripCentroidDisplayer"
});