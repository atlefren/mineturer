package net.atlefren.NewGpxUploader.service;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.io.WKTWriter;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.opengis.geometry.DirectPosition;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;
import org.postgis.LineString;
import org.postgis.MultiLineString;
import org.postgis.Point;
import org.springframework.stereotype.Component;


import javax.xml.transform.TransformerException;
import java.util.ArrayList;
import java.util.Iterator;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/9/11
 * Time: 7:43 PM
 * To change this template use File | Settings | File Templates.
 */

@Component
public class PostGisToWKTWriter {

    public String parsePoint(Point point,int toSrid){
        GeometryFactory factory = new GeometryFactory();
        com.vividsolutions.jts.geom.Point jtsPoint = factory.createPoint(pointToCoord(point,toSrid));
        WKTWriter wktWriter = new WKTWriter();
        return wktWriter.write(jtsPoint);
    }


    public String parseMultiLineString(MultiLineString mls,int toSrid){
        GeometryFactory factory = new GeometryFactory();
        LineString[] ls = mls.getLines();

        ArrayList<com.vividsolutions.jts.geom.LineString> lineStrings = new ArrayList<com.vividsolutions.jts.geom.LineString>();
        ArrayList<Coordinate> coordinates = new ArrayList<Coordinate>();


        for(LineString line:ls){
            Point[] points = line.getPoints();
            for(Point p:points){
                coordinates.add(pointToCoord(p,toSrid));
            }
            Coordinate[] coordArray = new Coordinate[coordinates.size()];
            lineStrings.add(factory.createLineString(coordinates.toArray(coordArray)));
            coordinates.clear();
        }

        com.vividsolutions.jts.geom.MultiLineString jtsMls = factory.createMultiLineString(lineStrings.toArray(new com.vividsolutions.jts.geom.LineString[lineStrings.size()]));
        WKTWriter wktWriter = new WKTWriter();
        return wktWriter.write(jtsMls);
    }


     private Coordinate pointToCoord(Point p, int toSrid){

        Coordinate coord;
        if(p.getSrid()==4326){
            coord = new Coordinate(p.getY(),p.getX());
        }
        else {
            coord = new Coordinate(p.getX(),p.getY());
        }
        if(p.getSrid() != toSrid){
            try{
                MathTransform transform = CRS.findMathTransform(CRS.decode("EPSG:"+p.getSrid()),CRS.decode("EPSG:"+toSrid));
                JTS.transform(coord,coord,transform );
            }
            catch (TransformException e){
                System.out.println("e = " + e);
            }
            catch(NoSuchAuthorityCodeException e) {
                System.out.println("e = " + e);
            }
            catch(FactoryException e) {
                System.out.println("e = " + e);
            }
        }
       return coord;

    }

}
