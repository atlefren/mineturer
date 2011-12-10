package net.atlefren.NewGpxUploader.service;

import com.topografix.gpx._1._1.GpxType;
import com.topografix.gpx._1._1.TrkType;
import com.topografix.gpx._1._1.TrksegType;
import com.topografix.gpx._1._1.WptType;
import net.atlefren.NewGpxUploader.dao.PointDao;
import net.atlefren.NewGpxUploader.dao.TripDao;
import net.atlefren.NewGpxUploader.model.Trackpoint;
import net.atlefren.NewGpxUploader.model.Trip;
import net.atlefren.NewGpxUploader.model.TripTransferObject;
import org.postgis.Point;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import javax.xml.datatype.XMLGregorianCalendar;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.GregorianCalendar;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/10/11
 * Time: 1:05 AM
 * To change this template use File | Settings | File Templates.
 */

@Component
public class TripWriter {

    @Resource
    GpxReader gpxReader;

    @Resource
    private TripDao tripDao;

    @Resource
    private PointDao pointDao;

    public TripTransferObject saveGpx(InputStream gpxInputStream,int userid,String title, String description,String triptype,String tags, boolean singleTrack){

        GpxType gpxContents = gpxReader.readGpx(gpxInputStream);
        Trip trip = new Trip();

        String titleToUse="";
        if(title !=null &&!title.equals("")){
            titleToUse = title;
        }
        else if(gpxContents.getMetadata().getName() !=null){
          titleToUse = gpxContents.getMetadata().getName();
        }
        String descriptionToUse="";
        if(description !=null &&!description.equals("")){
            descriptionToUse = description;
        }
        else if(gpxContents.getMetadata().getDesc() !=null){
          titleToUse = gpxContents.getMetadata().getDesc();
        }

        trip.setTitle(titleToUse);
        trip.setDescription(descriptionToUse);
        trip.setTriptype(triptype);
        trip.setFlickrtags(tags);
        trip.setUserid(userid);

        XMLGregorianCalendar start = gpxContents.getTrk().get(0).getTrkseg().get(0).getTrkpt().get(0).getTime();

        int numTracks = gpxContents.getTrk().size()-1;
        int numSegmentsInLastTrack = gpxContents.getTrk().get(numTracks).getTrkseg().size()-1;
        int numPtsInLastSegment = gpxContents.getTrk().get(numTracks).getTrkseg().get(numSegmentsInLastTrack).getTrkpt().size()-1;
        XMLGregorianCalendar stop = gpxContents.getTrk().get(numTracks).getTrkseg().get(numSegmentsInLastTrack).getTrkpt().get(numPtsInLastSegment).getTime();

        //TODO: check timezone and summer/winter time here
        Date startDate = start.toGregorianCalendar().getTime();
        Date stopDate = stop.toGregorianCalendar().getTime();
        /*
        System.out.println("start = " + start);
        System.out.println("stop = " + stop);
        System.out.println("startDate = " + startDate);
        System.out.println("stopDate = " + stopDate);
          */

        trip.setStart(startDate);
        trip.setStop(stopDate);


        int tripid = tripDao.saveTrip(trip,singleTrack);

        trip.setTripid(tripid);

        System.out.println("tripid = " + tripid);

        ArrayList<Trackpoint> trackpoints = new ArrayList<Trackpoint>();

        int track = 0;
        int segment=0;
        for(TrkType trk:gpxContents.getTrk()){
            for(TrksegType trkSeg:trk.getTrkseg()){
                for(WptType wpt:trkSeg.getTrkpt()){
                    Trackpoint trackpoint = new Trackpoint();
                    trackpoint.setTracknr(track);
                    trackpoint.setSegmentnr(segment);
                    if(wpt.getEle()!=null){
                        trackpoint.setElevation(new Double(wpt.getEle().doubleValue()));
                    }

                    //TODO: check timezone and summer/winter time here
                    trackpoint.setTimestamp(wpt.getTime().toGregorianCalendar().getTime());
                    trackpoint.setHeartrate(0);//TODO: fix this
                    double lon =  new Double(wpt.getLon().doubleValue());
                    double lat =  new Double(wpt.getLat().doubleValue());
                    Point point = new Point(lon,lat);
                    point.setSrid(4326);
                    trackpoint.setGeom(point);
                    trackpoints.add(trackpoint);
                }
                segment++;
            }
            track++;
            segment=0;
        }

     pointDao.savePoints(trackpoints,tripid);

        TripTransferObject transferObject = new TripTransferObject();
        return transferObject;

    }
}
