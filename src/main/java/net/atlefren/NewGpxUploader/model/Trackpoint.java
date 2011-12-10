package net.atlefren.NewGpxUploader.model;

import com.vividsolutions.jts.geom.Coordinate;
import org.postgis.Point;

import java.util.Date;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/8/11
 * Time: 9:05 PM
 * To change this template use File | Settings | File Templates.
 */
public class Trackpoint {

    private int segmentnr;
    private int tracknr;
    private double elevation;
    private double heartrate;
    private Date timestamp;
    private Point geom;


    public int getSegmentnr() {
        return segmentnr;
    }

    public void setSegmentnr(int segmentnr) {
        this.segmentnr = segmentnr;
    }

    public int getTracknr() {
        return tracknr;
    }

    public void setTracknr(int tracknr) {
        this.tracknr = tracknr;
    }

    public double getElevation() {
        return elevation;
    }

    public void setElevation(double elevation) {
        this.elevation = elevation;
    }

    public double getHeartrate() {
        return heartrate;
    }

    public void setHeartrate(double heartrate) {
        this.heartrate = heartrate;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public Point getGeom() {
        return geom;
    }

    public void setGeom(Point geom) {
        this.geom = geom;
    }

    public Coordinate getAsCoordinate(){
        if(geom.getSrid()==4326){
            return new Coordinate(geom.getY(),geom.getX());
        }
        else {
            return new Coordinate(geom.getX(),geom.getY());
        }
    }
}
