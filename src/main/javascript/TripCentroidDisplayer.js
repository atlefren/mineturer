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
                feature.style = {
                    externalGraphic:"gfx/marker.png",
                    graphicWidth:21,
                    graphicHeight:25
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