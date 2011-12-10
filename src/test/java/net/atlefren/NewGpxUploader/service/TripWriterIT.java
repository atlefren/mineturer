package net.atlefren.NewGpxUploader.service;

import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileInputStream;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/10/11
 * Time: 1:26 AM
 * To change this template use File | Settings | File Templates.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"/applicationContextTest.xml"})
public class TripWriterIT extends TestCase {

    @Resource
    TripWriter tripWriter;

    @Test
    public void testSaveGpx11Simple() throws Exception {

        File file = new File("src/test/resources/test11onetrackonesegment.gpx");
        FileInputStream fis = new FileInputStream(file);
        tripWriter.saveGpx(fis,1,"11simple","desc","hiking","",false);

    }

    @Test
    public void testSaveGpx11Complicated() throws Exception {

        File file = new File("src/test/resources/test11manyTracksAndSegments.gpx");
        FileInputStream fis = new FileInputStream(file);
        tripWriter.saveGpx(fis,100,"11complicatednofix","desc","hiking","",false);

    }

    @Test
    public void testSaveGpx11ComplicatedFix() throws Exception {

        File file = new File("src/test/resources/test11manyTracksAndSegments.gpx");
        FileInputStream fis = new FileInputStream(file);
        tripWriter.saveGpx(fis,1,"11complicatedfix","desc","hiking","",true);

    }
}
