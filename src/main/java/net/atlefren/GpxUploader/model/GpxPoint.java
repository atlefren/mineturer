package net.atlefren.GpxUploader.model;

import com.vividsolutions.jts.geom.Coordinate;
import org.apache.log4j.Logger;
import org.geotools.geometry.GeneralDirectPosition;
import org.geotools.referencing.CRS;
import org.opengis.geometry.DirectPosition;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/5/11
 * Time: 10:53 PM
 */


public class GpxPoint {
    private double lon;
    private double lat;
    private double ele;
    private Date time;

    private static Logger logger = Logger.getLogger(GpxPoint.class);

    public GpxPoint() {
    }

    public GpxPoint(double lon, double lat, double ele, String time) {
        this.lon = lon;
        this.lat = lat;
        this.ele = ele;
        this.time = parseDate(time);
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getEle() {
        return ele;
    }

    public void setEle(double ele) {
        this.ele = ele;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time){
        this.time = time;
    }

    public void setTime(String time) {
        this.time = parseDate(time);
    }

    public Coordinate getPointAsCoord(String epsg){
        if(epsg.equals("4326")){
            return new Coordinate(getLon(),getLat());
        }
        else {
            DirectPosition point= new GeneralDirectPosition(getLat(),getLon());
            MathTransform transformer = null;
            try {
                transformer = generateTransform("4326",epsg);
                DirectPosition transformedPoint = transformer.transform( point, null);
                double[] coordinates = transformedPoint.getCoordinate();
                return new Coordinate(coordinates[0],coordinates[1]);
            }  catch (FactoryException e) {
                logger.error("FactoryException", e);
            }
            catch (TransformException e){
                logger.error("TransformException", e);
            }
        }
        return  null;
    }

    private MathTransform generateTransform(String source, String target   ) throws FactoryException {
        CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:" + source);
        CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:" + target);
        return CRS.findMathTransform(sourceCRS, targetCRS, true);
    }

    private Date parseDate(String date){
        DateFormat formatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.S'Z'"); //2011-05-29T10:14:59.000Z
        try{
            return formatter.parse(date);
        }
        catch (ParseException e){
            try{
                DateFormat newformatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'"); //2011-05-29T10:14:59.000Z
                return newformatter.parse(date);
            }
            catch (ParseException e2){
                logger.warn("could not parse date" + date +" error:"+ e2);
                return null;
            }

        }
    }
}

