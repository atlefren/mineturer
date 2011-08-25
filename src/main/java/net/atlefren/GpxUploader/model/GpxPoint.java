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
    private String time;

    private static Logger logger = Logger.getLogger(GpxPoint.class);

    public GpxPoint() {
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

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Coordinate getPointAsCoord(String epsg){
        if(epsg.equals("4326")){
            Coordinate coord = new Coordinate(getLon(),getLat());
            coord.z = getEle();
            return coord;
        }
        else {
            DirectPosition point= new GeneralDirectPosition(getLat(),getLon());
            MathTransform transformer = null;
            try {
                transformer = generateTransform("4326",epsg);
                DirectPosition transformedPoint = transformer.transform( point, null);
                double[] coordinates = transformedPoint.getCoordinate();
                Coordinate coord = new Coordinate(coordinates[0],coordinates[1]);
                coord.z = getEle();
                return coord;
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
}

