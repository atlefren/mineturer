function setupMap(perma,lon,lat,zoom,layerId,wkt) {



    var maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
        restrictedExtent = maxExtent.clone(),
        maxResolution = 156543.0339;

    var options = {
        projection: new OpenLayers.Projection("EPSG:900913"),
        displayProjection: new OpenLayers.Projection("EPSG:4326"),
        units: "m",
        numZoomLevels: 18,
        maxResolution: maxResolution,
        maxExtent: maxExtent,
        restrictedExtent: restrictedExtent
    };
    var map = new OpenLayers.Map('map', options);

    if(typeof(google) != "undefined"){
        // create Google Mercator layers
        var gmap = new OpenLayers.Layer.Google(
            "Google Maps",
            {
                sphericalMercator: true,
                layerId: "gm"
            }
        );

        var gsat = new OpenLayers.Layer.Google(
            "Google Satellite",
            {
                type: google.maps.MapTypeId.SATELLITE,
                sphericalMercator: true,
                layerId: "gs"
            }
        );
    }
    // create OSM layer
    var mapnik = new OpenLayers.Layer.OSM();
    mapnik.layerId = "osm";
    
    // create WMS layer
    var wms = new OpenLayers.Layer.WMS(
        "SK, Topografisk norgeskart",
        "http://opencache.statkart.no/gatekeeper/gk/gk.open?",
        {'layers': 'topo2', 'format':'image/png'},
        {
            //visibility: true,
            visibility:false,
            'isBaseLayer': true,
            'wrapDateLine': true,
             layerId: "topo2"
        }
    );

    //wms.toporaster2

    var wms2 = new OpenLayers.Layer.WMS(
        "SK, Topografisk rasterkart",
        "http://opencache.statkart.no/gatekeeper/gk/gk.open?",
        {'layers': 'toporaster2', 'format':'image/png'},
        {
            //visibility: true,
            visibility:false,
            'isBaseLayer': true,
            'wrapDateLine': true,
             layerId: "raster2"
        }
    );

    // create a vector layer for drawing
    var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                    strokeColor: "#1E13FF",
                    strokeWidth: 2
                    },
                OpenLayers.Feature.Vector.style["default"]));

    var centroidStyleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                    strokeColor: "green",
                    fillColor: "red",
                    strokeWidth: 2},
                OpenLayers.Feature.Vector.style["default"]));


    var featureLayer = new OpenLayers.Layer.Vector("test",{displayInLayerSwitcher:false,styleMap: styleMap});
    var cLayer = new OpenLayers.Layer.Vector("Turpunkter",{displayInLayerSwitcher:true,styleMap: centroidStyleMap});

    map.addControl(new OpenLayers.Control.LayerSwitcher());

    if(typeof(google) != "undefined"){
        map.addLayers([wms,wms2, gmap, mapnik,gsat,cLayer, featureLayer]);
    }
    else {
        map.addLayers([wms,wms2, mapnik, cLayer, featureLayer]);
    }





    if(perma){
        map.setCenter(new OpenLayers.LonLat(lon,lat),zoom);
        for(var i =0;i<map.layers.length;i++){
            var layer = map.layers[i];
            if(layer.isBaseLayer && layer.layerId==layerId){
                map.setBaseLayer(layer);
            }
        }
        var format = new OpenLayers.Format.WKT();
        var features = [];
        for(var j = 0;j<wkt.length;j++){
            //console.log(wkt[j]);
            features.push(format.read(wkt[j]));
        }
        featureLayer.addFeatures(features);

    }
    else {



        var list = new TripOrganizer.TripList("trips",map,featureLayer,cLayer);
        list.listTrips();

        var uploader = new TripOrganizer.TripUploader(list);
        $("#uploadfile").click(function(){
            uploader.showUploadForm();
        });


        map.setCenter(new OpenLayers.LonLat(1932453.2623743,9735786.7850962),5);

    }

}