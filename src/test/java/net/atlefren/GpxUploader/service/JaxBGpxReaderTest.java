package net.atlefren.GpxUploader.service;

import com.topografix.gpx._1._0.Gpx;
import com.topografix.gpx._1._1.GpxType;
import com.topografix.gpx._1._1.TrkType;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import javax.xml.bind.JAXBException;
import java.io.File;
import java.io.FileInputStream;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 11/9/11
 * Time: 5:49 PM
 */


public class JaxBGpxReaderTest extends TestCase {
  /*

    JaxBGpxReader gpxReader;

    @Test
    public void testRead11Gpx() throws Exception{
        gpxReader = new JaxBGpxReader();
        File file = new File("src/test/resources/test.gpx");


        FileInputStream fis = new FileInputStream(file);


        GpxType gpx = gpxReader.readGpx(fis);
        List<TrkType> tracks = gpx.getTrk();
        TrkType trk = tracks.get(0);
        System.out.println("trk.getName() = " + trk.getName());

    }

    @Test
    public void testRead10Gpx() throws Exception{
        gpxReader = new JaxBGpxReader();
        File file = new File("src/test/resources/preikestolen-20110709.gpx");
        FileInputStream fis = new FileInputStream(file);
        GpxType gpx = gpxReader.readGpx(fis);
        List<TrkType> tracks = gpx.getTrk();
        System.out.println("tracks.size() = " + tracks.size());
//        TrkType trk = tracks.get(0);
      //  System.out.println("trk.getName() = " + trk.getName());

    }
    */
}
