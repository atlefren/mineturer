package net.atlefren.GpxUploader.model;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LineString;

import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/6/11
 * Time: 5:02 PM
 */
public class GpxRoute {
    private String name;
    private String desc;
    private ArrayList<GpxPoint> routePoints;
    private GeometryFactory factory = new GeometryFactory();

    public GpxRoute() {
        routePoints = new ArrayList<GpxPoint>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public void addRoutePoint(GpxPoint point){
        routePoints.add(point);
    }

    public LineString getRouteAsLineString(String epsg){
        ArrayList<Coordinate> coordinates = new ArrayList<Coordinate>();
        for (GpxPoint point : routePoints){
            coordinates.add(point.getPointAsCoord(epsg));
        }
        Coordinate[] coordArray = new Coordinate[coordinates.size()];
        return factory.createLineString(coordinates.toArray(coordArray));
    }

}
