package net.atlefren.GpxUploader.service;

import junit.framework.TestCase;
import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.model.GpxFileContents;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.GpxTrack;
import net.atlefren.GpxUploader.model.Trip;
import net.atlefren.GpxUploader.util.Util;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/30/11
 * Time: 4:05 PM
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"/applicationContextTest.xml"})
public class GpxReaderIT extends TestCase {

     @Resource
     TripDao tripDao;

    @Test
    public void testReadGpxFileAndSaveToDb() throws Exception {




       File f = new File("src/test/resources/lillomarka.gpx");

        FileInputStream fis = new FileInputStream(f);
         GpxReader reader = new GpxReader(fis);

        GpxFileContents contents= reader.readAndCreateGpx();
         contents.setName("testfil");

        System.out.println("contents = " + contents);
        System.out.println("tripDao = " + tripDao);
        
        int id = tripDao.saveTripToDb(contents,1,"hiking","hmm");
        Trip trip = tripDao.getTripDetails(1, "900913", id,true);

        assertEquals("hmm",trip.getTags());
        assertEquals("testfil",trip.getName());
        assertEquals(1,trip.getTracks().size());



    }


/*
    public void testReadGpxFileCheckTime() throws Exception {

        GpxReader reader = new GpxReader();

        //GpxFileContents contents = reader.readGpxFile("/home/atle/privat/gpslogger/trollheimen-20110703.gpx");
        //GpxFileContents contents = reader.readGpxFile("/home/atle/privat/sporloggGarmin.gpx");

        GpxFileContents contents = reader.readGpxFile("/home/atle/privat/gpslogger/innerdalen-20110521.gpx");


        double dur = (contents.getStop().getTime()-contents.getStart().getTime())/1000;

        System.out.println("dur = " + Util.formatTime(dur));

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



    }
*/
}
