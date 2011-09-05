package net.atlefren.GpxUploader.service;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.LengthHolder;
import net.atlefren.GpxUploader.util.Util;
import org.apache.log4j.Logger;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import java.text.DecimalFormat;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/24/11
 * Time: 7:28 PM
 */
public class LengthComputer {

    private static Logger logger = Logger.getLogger(LengthComputer.class);

    public LengthComputer() {
    }

    public static LengthHolder generateLengthts(List<GpxPoint> points){

        double total3dDist = 0.0;
        double total2dDist = 0.0;
        double totalascDist = 0.0;
        double totaldescDist = 0.0;
        double totalflatDist =0.0;
        GpxPoint last = null;
        for(GpxPoint point:points){
            if(last != null){
                double distXy= Util.distVincentY(point.getLon(), point.getLat(), last.getLon(), last.getLat());
                double distEle = point.getEle()-last.getEle();
                double dist3d=Math.sqrt(Math.pow(distXy,2)+Math.pow(distEle,2));
                total3dDist+=dist3d;
                total2dDist+=distXy;
                if(distEle==0.0){
                    totalflatDist+=dist3d;
                }
                else if(distEle>0.0){
                    totalascDist+=dist3d;
                }
                else if(distEle<0.0){
                    totaldescDist+=dist3d;
                }
            }
            last = point;
        }
        LengthHolder length = new LengthHolder();
        DecimalFormat twoDForm = new DecimalFormat("#.##");
        length.setLength2d(Double.valueOf(twoDForm.format(total2dDist)));
        length.setLength3d(Double.valueOf(twoDForm.format(total3dDist)));
        length.setLengthAsc(Double.valueOf(twoDForm.format(totalascDist)));
        length.setLengthDesc(Double.valueOf(twoDForm.format(totaldescDist)));
        length.setLengthFlat(Double.valueOf(twoDForm.format(totalflatDist)));
        return length;
    }
}
