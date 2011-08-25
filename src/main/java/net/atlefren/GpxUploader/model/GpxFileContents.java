package net.atlefren.GpxUploader.model;

import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.WKTWriter;
import org.apache.log4j.Logger;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/6/11
 * Time: 4:44 PM
 */
public class GpxFileContents {

    private String name;
    private String description;
    private String id;
    private Date start;
    private Date stop;
    private ArrayList<GpxPoint> waypoints;
    private ArrayList<GpxRoute> routes;
    private ArrayList<GpxTrack> tracks;
    private String SRS;
    private WKTWriter wktWriter = new WKTWriter(3);
    private GeometryFactory factory = new GeometryFactory();


    private static Logger logger = Logger.getLogger(GpxFileContents.class);


    public GpxFileContents() {
        waypoints = new ArrayList<GpxPoint>();
        routes = new ArrayList<GpxRoute>();
        tracks = new ArrayList<GpxTrack>();
        SRS = "4326";
    }

    public String getSRS() {
        return SRS;
    }

    public void setSRS(String SRS) {
        this.SRS = SRS;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getStart() {
        if(start !=null){
            return start;
        }
        else {
            String startString = getTracks().get(0).getTrackSegments().get(0).get(0).getTime();
            start = parseDate(startString);
            return start;
        }
    }

    public Date getStop() {
        if(stop !=null){
            return stop;
        }
        else {
            GpxTrack lastTrack = getTracks().get(getTracks().size()-1);
            ArrayList<GpxPoint> lastSegment = lastTrack.getTrackSegments().get(lastTrack.getTrackSegments().size()-1);
            GpxPoint lastPoint = lastSegment.get(lastSegment.size()-1);
            String stopString = lastPoint.getTime();
            stop = parseDate(stopString);
            return stop;
        }
    }

    private Date parseDate(String date){
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss.S'Z'"); //2011-05-29T10:14:59.000Z
        try{
            return formatter.parse(date);
        }
        catch (ParseException e){
            logger.warn("parse exeption, trying new format"+ e);
            try{
                DateFormat newformatter = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ss'Z'"); //2011-05-29T10:14:59.000Z
                return newformatter.parse(date);
            }
            catch (ParseException e2){
                logger.warn("parse exeption, trying new format"+ e2);
                return null;
            }

        }
    }

    public String getName() {
        if(name != null){
            return name;
        }
        else {
            if(tracks.get(0) != null){
                return tracks.get(0).getName();
            }
            else {
                return null;
            }
        }
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ArrayList<GpxTrack> getTracks() {
        return tracks;
    }



    public ArrayList<GpxPoint> getWaypoints() {
        return waypoints;
    }


    public ArrayList<GpxRoute> getRoutes() {
        return routes;
    }

    public void addTrack(GpxTrack track){
        tracks.add(track);
    }

    public void addRoute(GpxRoute route){
        routes.add(route);
    }

    public void addWayPoint(GpxPoint point){
        waypoints.add(point);
    }

    public ArrayList<MultiLineString> getTracksAsGeometry(){
        ArrayList<MultiLineString> res = new ArrayList<MultiLineString>();
        for (GpxTrack track : tracks){
            res.add(track.getTrackAsMultiLineString(SRS));
        }
        return res;
    }

    public ArrayList<LineString> getRoutesAsGeometry(){
        ArrayList<LineString> res = new ArrayList<LineString>();
        for (GpxRoute route : routes){
            res.add(route.getRouteAsLineString(SRS));
        }
        return res;
    }

    public ArrayList<Point> getWaypointsAsGeometry(){
        ArrayList<Point> res = new ArrayList<Point>();
        for(GpxPoint point:waypoints){
            res.add(factory.createPoint(point.getPointAsCoord(SRS)));
        }
        return res;
    }

    public ArrayList<String> getTracksAsWKT(){
        ArrayList<String> res = new ArrayList<String>();
        for (GpxTrack track : tracks){
            res.add(wktWriter.write(track.getTrackAsMultiLineString(SRS)));
        }
        return res;
    }

    public ArrayList<String> getRoutesAsWKT(){
        ArrayList<String> res = new ArrayList<String>();
        for (GpxRoute route : routes){
            res.add(wktWriter.write(route.getRouteAsLineString(SRS)));
        }
        return res;
    }

    public ArrayList<String> getWaypointsAsWKT(){
        ArrayList<String> res = new ArrayList<String>();
        for(GpxPoint point:waypoints){
            res.add(wktWriter.write(factory.createPoint(point.getPointAsCoord(SRS))));

        }
        return res;
    }
}
