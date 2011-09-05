package net.atlefren.GpxUploader.service;

import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.HeightHolder;
import net.atlefren.GpxUploader.util.Util;

import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/5/11
 * Time: 3:19 PM
 */
public class HeightComputer {

    public static HeightHolder computeHeights(List<GpxPoint> points){


        double totalAsc=0.0;
        double totalDesc = 0.0;
        double maxHeight =points.get(0).getEle();
        double minHeight = points.get(0).getEle();
        GpxPoint last = null;
        for(GpxPoint point:points){
            double distEle;
            if(last != null){
                distEle = point.getEle()-last.getEle();
                if(distEle>0.0){
                    totalAsc+=distEle;
                }
                else if(distEle<0.0){
                    totalDesc+=distEle;
                }
            }

            if(point.getEle()>maxHeight){
                maxHeight=point.getEle();
            }
            if(point.getEle()<minHeight){
                minHeight=point.getEle();
            }


            last = point;
        }

        HeightHolder heightHolder = new HeightHolder();
        heightHolder.setStartHeight(points.get(0).getEle());
        heightHolder.setStopHeight(points.get(points.size()-1).getEle());
        heightHolder.setTotalAsc(totalAsc);
        heightHolder.setTotalDesc(totalDesc);
        heightHolder.setMaxHeight(maxHeight);
        heightHolder.setMinHeight(minHeight);
        return heightHolder;
    }
}
