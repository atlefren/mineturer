import com.topografix.gpx._1._0.Gpx;
import com.topografix.gpx._1._1.*;
import junit.framework.TestCase;


import javax.xml.bind.JAXBContext;

import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.util.List;


/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 11/9/11
 * Time: 4:42 PM
 */
public class jaxbGpxParseTest extends TestCase{

     public void testParseEntireDocument() throws JAXBException {
         JAXBContext ctx = JAXBContext.newInstance(new Class[]{GpxType.class,Gpx.class});
         Unmarshaller um = ctx.createUnmarshaller();
         
         Object o = um.unmarshal(new File("/home/atle/privat/lillomarka.gpx"));
//         Object o = um.unmarshal(new File("/home/atle//code/privat/GpxUpload/pom.xml"));



         System.out.println("o.getClass() = " + o.getClass());


         if(o instanceof Gpx){
             Gpx gpx = (Gpx)o;
             System.out.println("gpx.getName() = " + gpx.getName());
         }
         else if(o instanceof JAXBElement){

                 JAXBElement<GpxType> root = (JAXBElement<GpxType>)o;
             

                 GpxType gpx = root.getValue();


                 List<TrkType> tracks = gpx.getTrk();
                 TrkType trk = tracks.get(0);
                 System.out.println("trk.getName() = " + trk.getName());


             
         }

/*

         System.out.println("root = " + root);


         GpxType gpx = root.getValue();

         MetadataType md = gpx.getMetadata();

                 
         
         List<TrkType> tracks = gpx.getTrk();
         System.out.println("tracks.size() = " + tracks.size());
         for(TrkType track:tracks){

             System.out.println("track.getName() = " + track.getName());
             System.out.println("track.getDesc() = " + track.getDesc());
                     
             List<TrksegType> segments = track.getTrkseg();
             for(TrksegType segment:segments){
                 List<WptType> trackpoints = segment.getTrkpt();
                 for(WptType trackpoint:trackpoints){
                     System.out.println("point: " + trackpoint.getLon() + ", " + trackpoint.getLat());
                 }
             }
         }

*/
     }
}
