package net.atlefren.GpxUploader.service;

import com.topografix.gpx._1._0.Gpx;
import com.topografix.gpx._1._1.GpxType;
import com.topografix.gpx._1._1.TrkType;
import junit.framework.TestCase;
import org.springframework.beans.factory.annotation.Autowired;

import javax.xml.bind.JAXBException;
import java.io.File;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 11/9/11
 * Time: 5:49 PM
 */
public class JaxBGpxReaderTest extends TestCase {

    @Autowired
    JaxBGpxReader gpxReader;

    public void testRead11Gpx() throws JAXBException{
        gpxReader = new JaxBGpxReader();
        File file = new File("/home/atle/privat/gpslogger/test.gpx");
        GpxType gpx = gpxReader.readGpx(file);
        List<TrkType> tracks = gpx.getTrk();
        TrkType trk = tracks.get(0);
        System.out.println("trk.getName() = " + trk.getName());

    }
    public void testRead10Gpx() throws JAXBException{
        gpxReader = new JaxBGpxReader();
        File file = new File("/home/atle/privat/gpslogger/preikestolen-20110709.gpx");
        GpxType gpx = gpxReader.readGpx(file);
        List<TrkType> tracks = gpx.getTrk();
        System.out.println("tracks.size() = " + tracks.size());
//        TrkType trk = tracks.get(0);
      //  System.out.println("trk.getName() = " + trk.getName());

    }

}
