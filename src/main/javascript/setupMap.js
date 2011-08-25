function setupMap(perma,lon,lat,zoom,layerId,wkt) {




    if(!perma){
        var heightDisplayer = new TripOrganizer.HeightProfileDisplayer("ele");
        var tripDisplayer = new TripOrganizer.TripInfoDisplayer("tripdetail");

        var uploader = new TripOrganizer.TripUploader();
        var tripFetcher = new TripOrganizer.TripFetcher("trips");
        tripFetcher.addTripDisplayer(tripDisplayer);
        tripFetcher.getTrips();

        tripFetcher.addUploadManager(uploader);
        tripFetcher.addHeightDisplayer(heightDisplayer);
        uploader.createLink("upload");
    }
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
    if(!perma){
        tripDisplayer.setMap(map);
    }
    // create Google Mercator layers
    var gmap = new OpenLayers.Layer.Google(
        "Google Maps",
        {
            sphericalMercator: true,
            layerId: "gm"
        }
    );

    // create OSM layer
    var mapnik = new OpenLayers.Layer.OSM();
    mapnik.layerId = "osm";

    var gsat = new OpenLayers.Layer.Google(
            "Google Satellite",
            {
                type: google.maps.MapTypeId.SATELLITE,
                sphericalMercator: true,
                layerId: "gs"
            }
        );

    
    // create WMS layer
    var wms = new OpenLayers.Layer.WMS(
        "Statens Kartverk, topo2",
        "http://opencache.statkart.no/gatekeeper/gk/gk.open?",
        {'layers': 'topo2', 'format':'image/png'},
        {
            visibility: true,
            'isBaseLayer': true,
            'wrapDateLine': true,
             layerId: "topo2"
        }
    );

    // create a vector layer for drawing
    var styleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                    strokeColor: "green",
                    strokeWidth: 2},
                OpenLayers.Feature.Vector.style["default"]));


    var featureLayer = new OpenLayers.Layer.Vector("test",{displayInLayerSwitcher:false,styleMap: styleMap});
    if(!perma){
        tripFetcher.addLayer(featureLayer);
    }
    map.addLayers([wms, gmap, mapnik,gsat, featureLayer]);
    map.addControl(new OpenLayers.Control.LayerSwitcher());

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
        map.zoomToMaxExtent()
    }



}