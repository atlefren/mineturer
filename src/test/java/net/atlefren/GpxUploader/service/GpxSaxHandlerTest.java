package net.atlefren.GpxUploader.service;

import junit.framework.Test;
import junit.framework.TestCase;
import org.xml.sax.InputSource;

import java.io.FileReader;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/6/11
 * Time: 6:09 PM
 */
public class GpxSaxHandlerTest extends TestCase {

    public void testGetData() throws Exception {

        GpxReader reader = new GpxReader();

        //String read = reader.readGpxFile("/home/atle/privat/gpslogger/trollheimen-20110702.gpx");
        String read = reader.readGpxFile("/home/atle/privat/gpslogger/innerdalen-20110522.gpx");
        System.out.println(read);


    }
}
