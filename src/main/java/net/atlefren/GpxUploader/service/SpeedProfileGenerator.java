package net.atlefren.GpxUploader.service;

import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.util.GISUtils;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/25/11
 * Time: 9:01 PM
 */
public class SpeedProfileGenerator {


    public List<List<Double>> generateFlotSeries(List<GpxPoint> points){

        GpxPoint last = null;
        double totalVincDist = 0.0;
        double speed =0.0;

        double timeLast10 = 0.0;
        double distLast10 = 0.0;


        List<List<Double>> res = new ArrayList<List<Double>>();
        for(GpxPoint point:points){
            List<Double> entry = new ArrayList<Double>();
            if(last != null){

                double dist = GISUtils.distVincentY(point.getLon(), point.getLat(), last.getLon(), last.getLat());
                double time = (point.getTime().getTime()-last.getTime().getTime())/1000;


                speed = (dist/time)*3.6;
                if(speed >= 0.0){
                    entry.add(round(totalVincDist,4));
                    entry.add(round(speed,4));
                    res.add(entry);
                }
                else {
                    entry.add(round(totalVincDist,4));
                    entry.add(0.0);
                    res.add(entry);
                }


                totalVincDist+=dist;
            }
            else {
                entry.add(0.0);
                entry.add(0.0);
                res.add(entry);
            }

            last = point;
            
        }
        double avg = getAvg(res);



        for (Iterator<List<Double>> iter = res.iterator(); iter.hasNext();) {
            List<Double> entry = iter.next();
            if(entry.get(1) > avg*2){
                iter.remove();
            }
        }

        int count=1;
        double sumspeed=0.0;
        double sumdist=0.0;
        List<List<Double>> res2 = new ArrayList<List<Double>>();
        for (Iterator<List<Double>> iter = res.iterator(); iter.hasNext();) {

            List<Double> entry = iter.next();
            sumspeed+=entry.get(1);
            sumdist+=entry.get(0);
            if(count==10){
                List<Double> entry2 = new ArrayList<Double>();
                entry2.add(sumdist/10);
                entry2.add(sumspeed/10);
                count=1;
                sumdist=0;
                sumspeed=0;
                res2.add(entry);
            }

            count++;
        }



        return res2;
    }

    private double getAvg(List<List<Double>> res){
                double sum = 0.0;
        for(List<Double> entry:res){
            sum+=entry.get(1);
        }
        return sum/res.size();
    }

     private double average(List<Double> elems){
        if(elems.size()==0){
            return 0.0;
        }
        else {
            double avg=0.0;
            for(double ele:elems) {
                avg += ele;
            }
            return avg/elems.size();
        }
    }


    private double round(double n, int d){
        double factor = Math.pow(10,d);
        return Math.round(n * factor) / factor;
    }
}



