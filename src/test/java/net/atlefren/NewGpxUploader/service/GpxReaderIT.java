package net.atlefren.NewGpxUploader.service;

import com.topografix.gpx._1._0.Gpx;
import com.topografix.gpx._1._1.GpxType;
import com.topografix.gpx._1._1.WptType;
import junit.framework.TestCase;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/10/11
 * Time: 12:13 AM
 * To change this template use File | Settings | File Templates.
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={"/applicationContextTest.xml"})
public class GpxReaderIT extends TestCase {

    @Resource
    GpxReader gpxReader;

    @Test
    public void testReadPlain11Gpx() throws Exception{
        File file = new File("src/test/resources/test11onetrackonesegment.gpx");


        FileInputStream fis = new FileInputStream(file);

        GpxType contents = gpxReader.readGpx(fis);

        assertEquals(1,contents.getTrk().size());
        assertEquals(1,contents.getTrk().get(0).getTrkseg().size());
        WptType p1 = contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().get(0);
        assertEquals(5,contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().size());

        assertEquals(10.818427,new Double(p1.getLon().doubleValue()));
        assertEquals(59.978898,new Double(p1.getLat().doubleValue()));

        WptType p2= contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().get(1);
        assertEquals(359.0,new Double(p2.getEle().doubleValue()));
    }

   @Test
    public void testReadComplicated11Gpx() throws Exception{
        File file = new File("src/test/resources/test11manyTracksAndSegments.gpx");


        FileInputStream fis = new FileInputStream(file);

        GpxType contents = gpxReader.readGpx(fis);

        assertEquals(2,contents.getTrk().size());
        assertEquals(3,contents.getTrk().get(0).getTrkseg().size());

       assertEquals(4,contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().size());
       assertEquals(2,contents.getTrk().get(0).getTrkseg().get(1).getTrkpt().size());
       assertEquals(1,contents.getTrk().get(0).getTrkseg().get(2).getTrkpt().size());

        assertEquals(1,contents.getTrk().get(1).getTrkseg().size());

       assertEquals(3,contents.getTrk().get(1).getTrkseg().get(0).getTrkpt().size());
        WptType p1 = contents.getTrk().get(1).getTrkseg().get(0).getTrkpt().get(1);

        assertEquals(10.8195,new Double(p1.getLon().doubleValue()));
        assertEquals(59.978791,new Double(p1.getLat().doubleValue()));

        WptType p2= contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().get(1);
        assertEquals(359.0,new Double(p2.getEle().doubleValue()));
    }

    @Test
    public void readSimple10Gpx() throws  Exception{
        File file = new File("src/test/resources/test10onetrackonesegment.gpx");

        FileInputStream fis = new FileInputStream(file);

        GpxType contents = gpxReader.readGpx(fis);

         assertEquals(1,contents.getTrk().size());
        assertEquals(1,contents.getTrk().get(0).getTrkseg().size());
        assertEquals(10,contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().size());

                 WptType p1 = contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().get(9);
         assertEquals(6.139465,new Double(p1.getLon().doubleValue()));
        assertEquals(58.992060,new Double(p1.getLat().doubleValue()));

    }

    @Test
    public void readComplicated10Gpx() throws  Exception{
        File file = new File("src/test/resources/test10withmanytrackmanysegments.gpx");

        FileInputStream fis = new FileInputStream(file);

        GpxType contents = gpxReader.readGpx(fis);

         assertEquals(2,contents.getTrk().size());
        assertEquals(1,contents.getTrk().get(0).getTrkseg().size());
        assertEquals(2,contents.getTrk().get(1).getTrkseg().size());
        assertEquals(2,contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().size());
        assertEquals(4,contents.getTrk().get(1).getTrkseg().get(0).getTrkpt().size());
        assertEquals(3,contents.getTrk().get(1).getTrkseg().get(1).getTrkpt().size());


         WptType p1 = contents.getTrk().get(1).getTrkseg().get(1).getTrkpt().get(2);
         assertEquals(6.139465,new Double(p1.getLon().doubleValue()));
        assertEquals(58.992060,new Double(p1.getLat().doubleValue()));


    }


    @Test
    public void read10GpxWithWpt() throws  Exception{
        File file = new File("src/test/resources/test10withwpt.gpx");

        FileInputStream fis = new FileInputStream(file);

        GpxType contents = gpxReader.readGpx(fis);

        assertEquals(3,contents.getWpt().size());
        assertEquals(10,contents.getTrk().get(0).getTrkseg().get(0).getTrkpt().size());


       WptType wp1 = contents.getWpt().get(0);


         assertEquals(6.170389,new Double(wp1.getLon().doubleValue()));
        assertEquals(58.990642,new Double(wp1.getLat().doubleValue()));

    }


    //TODO add check for hr extension
}
