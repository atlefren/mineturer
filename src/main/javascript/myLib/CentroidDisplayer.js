TripOrganizer.CentroidDisplayer = OpenLayers.Class({

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
                clickout: true,
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

    addTrip: function(trip){
        this.layer.addFeatures([this.generateFeature(trip)]);
    },

    displayCentroids: function(centroids,update){

        var features = [];
        this.layer.destroyFeatures();
        for(var i=0;i<centroids.length;i++){
            features.push(this.generateFeature(centroids[i]));
        }
        this.layer.addFeatures(features);
        var bounds = this.layer.getDataExtent();
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

    generateFeature: function(trip){
        var feature =this.format.read(trip.geom);

        var icon ="gfx/icons/default.png";
        if(trip.type){
            icon = "gfx/icons/"+trip.type + ".png";
        }
        feature.style = {
            externalGraphic:icon,
            graphicWidth:32,
            graphicHeight:37,
            cursor: "pointer",
            graphicTitle: trip.title
        };
        feature.attributes.tripid=trip.id;

        return feature;
    },

    removeFeature: function(id){
        this.layer.removeFeatures(this.layer.getFeaturesByAttribute("tripid",id));
    },

    changeType: function(id,type){
        var feature;
        for(var i=0;i<this.layer.features.length;i++){
            if(this.layer.features[i].attributes.tripid==id){
                feature =this.layer.features[i];
                break;
            }
        }
        feature.style.externalGraphic = "gfx/icons/"+type + ".png";
        this.layer.drawFeature(feature);
    },

    CLASS_NAME:"TripOrganizer.CentroidDisplayer"
});