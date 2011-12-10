package net.atlefren.NewGpxUploader.service;

import net.atlefren.GpxUploader.model.HeightHolder;
import net.atlefren.NewGpxUploader.model.HeightTransferObject;
import net.atlefren.NewGpxUploader.model.LengthTransferObject;
import net.atlefren.NewGpxUploader.model.TimeTransferObject;
import net.atlefren.NewGpxUploader.model.Trackpoint;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.NoSuchAuthorityCodeException;
import org.opengis.referencing.operation.TransformException;
import org.springframework.stereotype.Component;

import javax.sound.midi.Track;
import java.text.DecimalFormat;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/9/11
 * Time: 9:21 PM
 * To change this template use File | Settings | File Templates.
 */

@Component
public class StatsComputer {

    public HeightTransferObject generateHeights(List<Trackpoint> points){


        double totalAsc=0.0;
        double totalDesc = 0.0;
        double maxHeight =points.get(0).getElevation();
        double minHeight = points.get(0).getElevation();
        Trackpoint last = null;
        for(Trackpoint point:points){
            double distEle;
            if(last != null){
                distEle = point.getElevation()-last.getElevation();
                if(distEle>0.0){
                    totalAsc+=distEle;
                }
                else if(distEle<0.0){
                    totalDesc+=distEle;
                }
            }

            if(point.getElevation()>maxHeight){
                maxHeight=point.getElevation();
            }
            if(point.getElevation()<minHeight){
                minHeight=point.getElevation();
            }


            last = point;
        }

        HeightTransferObject heightHolder = new HeightTransferObject();
        heightHolder.setStartHeight(points.get(0).getElevation());
        heightHolder.setStopHeight(points.get(points.size()-1).getElevation());
        heightHolder.setTotalAsc(totalAsc);
        heightHolder.setTotalDesc(totalDesc);
        heightHolder.setMaxHeight(maxHeight);
        heightHolder.setMinHeight(minHeight);
        return heightHolder;
    }

     public LengthTransferObject generateLengthts(List<Trackpoint> points){

        double total3dDist = 0.0;
        double total2dDist = 0.0;
        double totalascDist = 0.0;
        double totaldescDist = 0.0;
        double totalflatDist =0.0;
        Trackpoint last = null;
        for(Trackpoint point:points){
            if(last != null){
                double distXy= 0.0;
                try{
                    distXy = JTS.orthodromicDistance(point.getAsCoordinate(), last.getAsCoordinate(), CRS.decode("EPSG:" + point.getGeom().getSrid()));
                } catch(NoSuchAuthorityCodeException e) {
                    System.out.println("e = " + e);
                }
                catch(FactoryException e) {
                    System.out.println("e = " + e);
                }
                catch (TransformException e){
                    System.out.println("e = " + e);
                }
                double distEle = point.getElevation()-last.getElevation();
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
        LengthTransferObject length = new LengthTransferObject();
        DecimalFormat twoDForm = new DecimalFormat("#.##");
        length.setLength2d(Double.valueOf(twoDForm.format(total2dDist)));
        length.setLength3d(Double.valueOf(twoDForm.format(total3dDist)));
        length.setLengthAsc(Double.valueOf(twoDForm.format(totalascDist)));
        length.setLengthDesc(Double.valueOf(twoDForm.format(totaldescDist)));
        length.setLengthFlat(Double.valueOf(twoDForm.format(totalflatDist)));
        return length;
    }

     public TimeTransferObject generateTimes(List<Trackpoint> points){

        double totaldist =0.0;
        double activeTime = 0.0;
        double totaltime = 0.0;
        double totaldescTime = 0.0;
        double totalascTime = 0.0;
        double totalflatTime =0.0;
        Trackpoint last = null;
        for(Trackpoint point:points){

            double time=0.0;
            double distXy=0.0;
            double distEle=0.0;
            double m;
            if(last != null){
                distEle = point.getElevation()-last.getElevation();
                time = (point.getTimestamp().getTime()-last.getTimestamp().getTime())/1000;
                try{
                    distXy = JTS.orthodromicDistance(point.getAsCoordinate(), last.getAsCoordinate(), CRS.decode("EPSG:"+point.getGeom().getSrid()));
                } catch(NoSuchAuthorityCodeException e) {
                    System.out.println("e = " + e);
                }
                catch(FactoryException e) {
                    System.out.println("e = " + e);
                }
                catch (TransformException e){
                    System.out.println("e = " + e);
                }
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

        TimeTransferObject timeHolder= new TimeTransferObject();
        timeHolder.setTotalTime(totaltime);
        timeHolder.setAscTime(totalascTime);
        timeHolder.setDescTime(totaldescTime);
        timeHolder.setFlatTime(totalflatTime);
        timeHolder.setActiveTime(activeTime);
        return timeHolder;
    }

}
