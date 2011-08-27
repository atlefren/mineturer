function setupMap(perma,lon,lat,zoom,layerId,wkt) {




    if(!perma){
        var heightDisplayer = new TripOrganizer.HeightProfileDisplayer("ele");
        var tripDisplayer = new TripOrganizer.TripInfoDisplayer("tripdetail");
        tripDisplayer.setText("Velg en tur i menyen!");
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
            //visibility: true,
            visibility:false,
            'isBaseLayer': true,
            'wrapDateLine': true,
             layerId: "topo2"
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
    if(!perma){
        tripFetcher.addLayer(featureLayer);
    }

    map.addControl(new OpenLayers.Control.LayerSwitcher());

    map.addLayers([wms, gmap, mapnik,gsat,cLayer, featureLayer]);
      //map.addLayers([wms,mapnik,cLayer, featureLayer]);

    //remove
    /*
    map.setBaseLayer(mapnik);
    map.addControl(new OpenLayers.Control.LayerSwitcher());
*/
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
        map.setCenter(new OpenLayers.LonLat(1932453.2623743,9735786.7850962),5);
        var centroidFetcher = new TripOrganizer.TripCentroidDisplayer(cLayer);
        centroidFetcher.displayCentroids(false);

        cLayer.events.on({
                        'featureselected': function(evt) {
                            var id = evt.feature.attributes.tripid;
                            tripFetcher.displayTrip(id);
                        }
                    });
        tripFetcher.events.on({
            'tripadded':function(evt){
                centroidFetcher.displayCentroids(true);
            }
        });

    }
    /*

    var speedProfileDisplayer = new TripOrganizer.SpeedProfileDisplayer("ele");

    $("#hoyde").click(function(){
        if(!heightDisplayer.active){
            speedProfileDisplayer.hideProfile();
            $('#fart').removeClass("active").addClass("inactive");
            heightDisplayer.displayProfileFortrack(tripFetcher.activeTrip);
            $('#hoyde').removeClass("inactive").addClass("active");
        }
    });

    $("#fart").click(function(){
        if(!speedProfileDisplayer.active){
            heightDisplayer.hideHeightProfile();
            $('#hoyde').removeClass("active").addClass("inactive");
            speedProfileDisplayer.displayProfileFortrack(tripFetcher.activeTrip);
            $('#fart').removeClass("inactive").addClass("active");
        }
    });
*/
}