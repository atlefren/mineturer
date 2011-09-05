package net.atlefren.GpxUploader.service;

import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.TimeHolder;
import net.atlefren.GpxUploader.util.Util;

import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/5/11
 * Time: 2:53 PM
 */
public class TimeComputer {
    public static TimeHolder generateTimes(List<GpxPoint> points){

        double totaldist =0.0;
        double activeTime = 0.0;
        double totaltime = 0.0;
        double totaldescTime = 0.0;
        double totalascTime = 0.0;
        double totalflatTime =0.0;
        GpxPoint last = null;
        for(GpxPoint point:points){
            double time =0.0;
            double distXy =0.0;
            double distEle=0.0;
            double m;
            if(last != null){
                distEle = point.getEle()-last.getEle();
                time = (point.getTime().getTime()-last.getTime().getTime())/1000;
                distXy = Util.distVincentY(point.getLon(), point.getLat(), last.getLon(), last.getLat());
                double dist3d=Math.sqrt(Math.pow(distXy,2)+Math.pow(distEle,2));
                m = ((totaldist+dist3d)-totaldist)/((totaltime+time)-totaltime);
            }
            else {
                time =0.0;
                m=0.0;
            }
            totaltime+=time;
            if(m>0.1){

                if(distEle==0.0){
                    totalflatTime+=time;
                }
                else if(distEle>0.0){
                    totalascTime+=time;
                }
                else if(distEle<0.0){
                    totaldescTime+=time;
                }
                activeTime+=time;
            }
            last = point;
        }

        TimeHolder timeHolder= new TimeHolder();
        timeHolder.setTotalTime(totaltime);
        timeHolder.setAscTime(totalascTime);
        timeHolder.setDescTime(totaldescTime);
        timeHolder.setFlatTime(totalflatTime);
        timeHolder.setActiveTime(activeTime);
        return timeHolder;
    }

}
