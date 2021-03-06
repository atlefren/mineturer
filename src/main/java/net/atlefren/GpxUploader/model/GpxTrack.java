package net.atlefren.GpxUploader.model;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.geom.LineString;


import java.util.ArrayList;


/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/6/11
 * Time: 4:59 PM
 */
public class GpxTrack {

    private String name;
    private String desc;
    private ArrayList<ArrayList<GpxPoint>> trackSegments;
    private GeometryFactory factory = new GeometryFactory();

    public GpxTrack() {
        trackSegments = new ArrayList<ArrayList<GpxPoint>>();
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

    public void addTrackSegment(ArrayList<GpxPoint> segment){
        trackSegments.add(segment);
    }

    public ArrayList<ArrayList<GpxPoint>> getTrackSegments() {
        ArrayList<ArrayList<GpxPoint>> ret = new ArrayList<ArrayList<GpxPoint>>();
        for(ArrayList<GpxPoint> seg:trackSegments){
            if(seg.size() >1){
                ret.add(seg);
            }
        }

        return ret;
    }

    public int getNumSegments(){
        int count = 0;
        for(ArrayList<GpxPoint> seg:trackSegments){
            if(seg.size() >1){
                count++;
            }
        }
        return count;
    }

    public MultiLineString getTrackAsMultiLineString(String epsg){
        ArrayList<LineString> lineStrings = new ArrayList<LineString>();
        for(ArrayList<GpxPoint> segment : trackSegments){
            LineString ls = createLineStringFromSegment(segment,epsg);
            if(ls!=null){
                lineStrings.add(ls);
            }
        }
        LineString[] lsArr = new LineString[lineStrings.size()];
        return factory.createMultiLineString(lineStrings.toArray(lsArr));
    }

    private LineString createLineStringFromSegment(ArrayList<GpxPoint> segmentCoords,String epsg){
        ArrayList<Coordinate> coordinates = new ArrayList<Coordinate>();

        for (GpxPoint point : segmentCoords){
            coordinates.add(point.getPointAsCoord(epsg));
        }
        Coordinate[] coordArray = new Coordinate[coordinates.size()];
        
        if(coordArray.length >1){
        return factory.createLineString(coordinates.toArray(coordArray));
        }
        else {
            return null;
        }
    }

}
