package net.atlefren.GpxUploader.service;

import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.util.MovingAverage;
import net.atlefren.GpxUploader.util.Util;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/4/11
 * Time: 1:18 PM
 */
public class GraphGenerator {

    public static List<List<Double>> generateDistHeightProfile(List<GpxPoint> points){
        DecimalFormat df = new DecimalFormat("#.####");
        GpxPoint last = null;
        double totalVincDist = 0.0;
        List<List<Double>> res = new ArrayList<List<Double>>();

        for(GpxPoint point:points){
            if(last != null){
                totalVincDist += Util.distVincentY(point.getLon(), point.getLat(), last.getLon(), last.getLat());
            }
            List<Double> entry = new ArrayList<Double>();
            entry.add(Double.valueOf(df.format(totalVincDist)));
            entry.add(point.getEle());
            res.add(entry);
            last = point;
        }
        return res;
    }

    public static List<List<Double>> generateTimeHeightProfile(List<GpxPoint> points){
        List<List<Double>> res = new ArrayList<List<Double>>();
        GpxPoint last = null;
        double totaltime = 0.0;
        for(GpxPoint point:points){
            double time;
            if(last!=null){
                time = (point.getTime().getTime()-last.getTime().getTime())/1000;
            }
            else {
                time =0.0;
            }
            List<Double> entry = new ArrayList<Double>();
            totaltime+=time;
            entry.add(round(totaltime/(60*60),4));
            entry.add(point.getEle());
            res.add(entry);
            last = point;
        }
        return res;
    }

    public static  List<List<Double>> generateDistSpeedProfile(List<GpxPoint> points){

        GpxPoint last = null;

        double totalDist = 0.0;
        MovingAverage ma = new MovingAverage(20);
        List<List<Double>> res = new ArrayList<List<Double>>();
        for(GpxPoint point:points){
            List<Double> entry = new ArrayList<Double>();
            if(last != null){
                double dist = Util.distVincentY(point.getLon(), point.getLat(), last.getLon(), last.getLat());
                double time = (point.getTime().getTime()-last.getTime().getTime())/1000;
                double speed = (dist/time)*3.6;
                ma.newNum(speed);
                totalDist+=dist;
                entry.add(round(totalDist,4));
                entry.add(round(ma.getAvg(),4));
                res.add(entry);
            }
            else {
                ma.newNum(0.0);
                entry.add(totalDist);
                entry.add(0.0);
                res.add(entry);
            }
            last = point;
        }
        return res;
    }

    public static List<List<Double>> generateTimeSpeedProfile(List<GpxPoint> points){

        GpxPoint last = null;

        double totaltime = 0.0;
        MovingAverage ma = new MovingAverage(5);
        List<List<Double>> res = new ArrayList<List<Double>>();
        for(GpxPoint point:points){
            List<Double> entry = new ArrayList<Double>();
            if(last != null){
                double dist = Util.distVincentY(point.getLon(), point.getLat(), last.getLon(), last.getLat());
                double time = (point.getTime().getTime()-last.getTime().getTime())/1000;
                double speed = (dist/time)*3.6;
                ma.newNum(speed);
                totaltime+=time;
                entry.add(round(totaltime/(60*60),4));
                entry.add(round(ma.getAvg(),4));
                res.add(entry);
            }
            else {
                ma.newNum(0.0);
                entry.add(round(totaltime/(60*60),4));
                entry.add(0.0);
                res.add(entry);
            }
            last = point;
        }
        return res;
    }

    public static List<List<Double>> generateTimeDistanceProfile(List<GpxPoint> points){
        List<List<Double>> res = new ArrayList<List<Double>>();
        GpxPoint last = null;
        double totaltime = 0.0;
        double totaldist = 0.0;
        for(GpxPoint point:points){
            double time;
            double dist;
            if(last!=null){
                time = (point.getTime().getTime()-last.getTime().getTime())/1000;
                dist = Util.distVincentY(point.getLon(), point.getLat(), last.getLon(), last.getLat());
            }
            else {
                time =0.0;
                dist = 0.0;
            }
            List<Double> entry = new ArrayList<Double>();
            totaltime+=time;
            totaldist+=dist;
            entry.add(round(totaltime/(60*60),4));
            entry.add(round(totaldist,4));
            res.add(entry);
            last = point;
        }
        return res;
    }

    private static double round(double n, int d){
        double factor = Math.pow(10,d);
        return Math.round(n * factor) / factor;
    }
}
