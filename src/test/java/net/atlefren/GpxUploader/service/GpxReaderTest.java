package net.atlefren.GpxUploader.service;

import junit.framework.TestCase;
import net.atlefren.GpxUploader.model.GpxFileContents;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.GpxTrack;

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

        GpxFileContents contents = reader.readGpxFile("/home/atle/privat/sporloggGarmin.gpx");

        contents.getTracks();

        System.out.println("contents.getStart() = " + contents.getStart());
        System.out.println("contents.getStop() = " + contents.getStop());
        for(GpxTrack track:contents.getTracks()){
            System.out.println("new track");
            for(ArrayList<GpxPoint> seg:track.getTrackSegments()){
                System.out.println("new segment");
                for(GpxPoint p:seg){
                    System.out.println("p.getTime() = " + p.getTime());
                }
                System.out.println("num points " + seg.size());
            }
        }

    }

}