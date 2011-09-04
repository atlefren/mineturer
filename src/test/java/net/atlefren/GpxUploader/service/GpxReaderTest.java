package net.atlefren.GpxUploader.service;

import junit.framework.TestCase;
import net.atlefren.GpxUploader.model.GpxFileContents;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.GpxTrack;
import net.atlefren.GpxUploader.util.Util;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/30/11
 * Time: 4:05 PM
 */
public class GpxReaderTest extends TestCase {
    public void testReadGpxFile() throws Exception {

        GpxReader reader = new GpxReader();

        GpxFileContents contents = reader.readGpxFile("/home/atle/privat/20100514.gpx");

        contents.getTracks();


        for(String track:contents.getTracksAsWKT()){
            System.out.println("track = " + track);
        }

    }

    public void testReadGpxFileCheckTime() throws Exception {

        GpxReader reader = new GpxReader();

        GpxFileContents contents = reader.readGpxFile("/home/atle/privat/gpslogger/trollheimen-20110703.gpx");

        double dur = (contents.getStop().getTime()-contents.getStart().getTime())/1000;

        System.out.println("dur = " + Util.formatTime(dur));



        contents.getTracks();

//        System.out.println("contents.getStart() = " + contents.getStart());
  //      System.out.println("contents.getStop() = " + contents.getStop());
        List<GpxPoint> list = new ArrayList<GpxPoint>();
        for(GpxTrack track:contents.getTracks()){
            System.out.println("new track");
            for(ArrayList<GpxPoint> seg:track.getTrackSegments()){
    //            System.out.println("new segment");
                for(GpxPoint p:seg){
                    list.add(p);
      //              System.out.println("p.getTime() = " + p.getTime());
                }
        //        System.out.println("num points " + seg.size());
            }
        }


        SpeedProfileGenerator gen = new SpeedProfileGenerator();
        gen.generateTimeSpeedProfile(list);

    }

}
