package net.atlefren.GpxUploader.service;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.util.GISUtils;
import org.apache.log4j.Logger;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.geotools.referencing.GeodeticCalculator;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/17/11
 * Time: 7:24 AM
 */


public class HeightProfileGenerator {

    public List<List<Double>> generateFlotSeries(List<GpxPoint> points){
        DecimalFormat df = new DecimalFormat("#.####");
        GpxPoint last = null;
        double totalVincDist = 0.0;
        List<List<Double>> res = new ArrayList<List<Double>>();

        for(GpxPoint point:points){
            if(last != null){
                totalVincDist += GISUtils.distVincentY(point.getLon(), point.getLat(), last.getLon(), last.getLat());
            }
            List<Double> entry = new ArrayList<Double>();
            entry.add(Double.valueOf(df.format(totalVincDist)));
            entry.add(point.getEle());
            res.add(entry);
            last = point;
        }
        return res;
    }

}
