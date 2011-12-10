package net.atlefren.NewGpxUploader.service;

import com.topografix.gpx._1._0.Gpx;
import com.topografix.gpx._1._1.*;
import org.springframework.stereotype.Component;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBElement;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/9/11
 * Time: 11:55 PM
 * To change this template use File | Settings | File Templates.
 */

@Component
public class GpxReader {


    public GpxReader() {
    }

    public GpxType readGpx(InputStream gpxInputStream) {
        try{
       JAXBContext ctx = JAXBContext.newInstance(GpxType.class,Gpx.class);
        Unmarshaller um = ctx.createUnmarshaller();
        Object o = um.unmarshal(gpxInputStream);
        if(o instanceof Gpx){
            Gpx gpx = (Gpx)o;
            return convertFromOld(gpx);
        }
        else if(o instanceof JAXBElement){
            JAXBElement<GpxType> root = (JAXBElement<GpxType>)o;
            return root.getValue();
        }
        else {
            return null;
        }
        }
        catch (JAXBException e){
            System.out.println("e = " + e);
            return null;
        }
    }

    GpxType convertFromOld(Gpx gpx){
        GpxType newGpx = new GpxType();
        newGpx.setMetadata(createMetadata(gpx));
        newGpx.setCreator(gpx.getCreator());
        newGpx.setVersion(gpx.getVersion());


         List<WptType> wpts = newGpx.getWpt();
        wpts = createWaypoints(gpx.getWpt());

        List<RteType> rte = newGpx.getRte();
        createRoutes(gpx.getRte(),rte);

        List<TrkType> trk = newGpx.getTrk();
        createTracks(gpx.getTrk(),trk);

        return newGpx;
    }

    List<TrkType> createTracks(List<Gpx.Trk> trks,List<TrkType> tracks){

        for(Gpx.Trk trk:trks){
            System.out.println("trk = " + trk);
            tracks.add(createTracks(trk));
        }
        return tracks;
    }

    TrkType createTracks(Gpx.Trk trk){
        TrkType track = new TrkType();
        track.setCmt(trk.getCmt());
        track.setDesc(trk.getDesc());
        track.setName(trk.getName());
        track.setNumber(trk.getNumber());
        track.setSrc(trk.getSrc());
        List<TrksegType> trksegs = track.getTrkseg();
        for(Gpx.Trk.Trkseg trkseg:trk.getTrkseg()){
            trksegs.add(createTrackSeg(trkseg));

        }

        return track;
    }

    TrksegType createTrackSeg(Gpx.Trk.Trkseg trkseg){
        TrksegType newTrkseg = new TrksegType();

        List<WptType> trkpts = newTrkseg.getTrkpt();
        for(Gpx.Trk.Trkseg.Trkpt trkpt:trkseg.getTrkpt()){
            trkpts.add(convertOldTrkPntToWpt(trkpt));
        }

        return newTrkseg;

    }

    List<RteType> createRoutes(List<Gpx.Rte> routes,List<RteType> newRoutes){
        for(Gpx.Rte route:routes){
            newRoutes.add(createRoute(route));
        }
        return newRoutes;
    }

    RteType createRoute(Gpx.Rte route){
        RteType newRoute = new RteType();
        newRoute.setCmt(route.getCmt());
        newRoute.setDesc(route.getDesc());

        newRoute.setName(route.getName());
        newRoute.setNumber(route.getNumber());
        newRoute.setSrc(route.getSrc());

        List<WptType> wpts = newRoute.getRtept();
        List<Gpx.Rte.Rtept> rtpts = route.getRtept();
        for(Gpx.Rte.Rtept rtept:rtpts){
            wpts.add(convertOldRtePntToWpt(rtept));
        }

        return newRoute;
    }

    List<WptType> createWaypoints(List<Gpx.Wpt> wpts){
        List<WptType> newWpts = new ArrayList<WptType>();

        for(Gpx.Wpt wpt:wpts){
            newWpts.add(convertWaypoints(wpt));

        }
        return newWpts;
    }

     WptType convertOldTrkPntToWpt(Gpx.Trk.Trkseg.Trkpt trkpt){
         WptType newWpt = new WptType();

        newWpt.setAgeofdgpsdata(trkpt.getAgeofdgpsdata());
        newWpt.setCmt(trkpt.getCmt());
        newWpt.setDesc(trkpt.getDesc());
        newWpt.setDgpsid(trkpt.getDgpsid());
        newWpt.setEle(trkpt.getEle());
        newWpt.setFix(trkpt.getFix());
        newWpt.setGeoidheight(trkpt.getGeoidheight());
        newWpt.setHdop(trkpt.getGeoidheight());
        newWpt.setLat(trkpt.getLat());
        newWpt.setLon(trkpt.getLon());
        newWpt.setMagvar(trkpt.getMagvar());
        newWpt.setName(trkpt.getName());
        newWpt.setPdop(trkpt.getPdop());
        newWpt.setSat(trkpt.getSat());
        newWpt.setSrc(trkpt.getSrc());
        newWpt.setSym(trkpt.getSym());
        newWpt.setTime(trkpt.getTime());
        newWpt.setType(trkpt.getType());
        newWpt.setVdop(trkpt.getVdop());

        return newWpt;
     }
    WptType convertOldRtePntToWpt(Gpx.Rte.Rtept rtept){
        WptType newWpt = new WptType();

        newWpt.setAgeofdgpsdata(rtept.getAgeofdgpsdata());
        newWpt.setCmt(rtept.getCmt());
        newWpt.setDesc(rtept.getDesc());
        newWpt.setDgpsid(rtept.getDgpsid());
        newWpt.setEle(rtept.getEle());
        newWpt.setFix(rtept.getFix());
        newWpt.setGeoidheight(rtept.getGeoidheight());
        newWpt.setHdop(rtept.getGeoidheight());
        newWpt.setLat(rtept.getLat());
        newWpt.setLon(rtept.getLon());
        newWpt.setMagvar(rtept.getMagvar());
        newWpt.setName(rtept.getName());
        newWpt.setPdop(rtept.getPdop());
        newWpt.setSat(rtept.getSat());
        newWpt.setSrc(rtept.getSrc());
        newWpt.setSym(rtept.getSym());
        newWpt.setTime(rtept.getTime());
        newWpt.setType(rtept.getType());
        newWpt.setVdop(rtept.getVdop());

        return newWpt;
    }

    WptType convertWaypoints(Gpx.Wpt wpt){
        WptType newWpt = new WptType();

        newWpt.setAgeofdgpsdata(wpt.getAgeofdgpsdata());
        newWpt.setCmt(wpt.getCmt());
        newWpt.setDesc(wpt.getDesc());
        newWpt.setDgpsid(wpt.getDgpsid());
        newWpt.setEle(wpt.getEle());
        newWpt.setFix(wpt.getFix());
        newWpt.setGeoidheight(wpt.getGeoidheight());
        newWpt.setHdop(wpt.getGeoidheight());
        newWpt.setLat(wpt.getLat());
        newWpt.setLon(wpt.getLon());
        newWpt.setMagvar(wpt.getMagvar());
        newWpt.setName(wpt.getName());
        newWpt.setPdop(wpt.getPdop());
        newWpt.setSat(wpt.getSat());
        newWpt.setSrc(wpt.getSrc());
        newWpt.setSym(wpt.getSym());
        newWpt.setTime(wpt.getTime());
        newWpt.setType(wpt.getType());
        newWpt.setVdop(wpt.getVdop());

        return newWpt;

    }

    MetadataType createMetadata(Gpx gpx){
        MetadataType md = new MetadataType();
        md.setName(gpx.getName());
        md.setDesc(gpx.getDesc());
        md.setKeywords(gpx.getKeywords());
        md.setTime(gpx.getTime());
        md.setBounds(convertFrom10BoundsTo11Bounds(gpx.getBounds()));
        md.setAuthor(createAuthor(gpx.getAuthor(),gpx.getEmail(),gpx.getUrl(),gpx.getUrlname()));
        return md;
    }


    PersonType createAuthor(String name, String email, String url, String urlname){
        PersonType person = new PersonType();
        if(name!= null){
            person.setName(name);
        }

        if(url != null && urlname != null){
            LinkType link = new LinkType();
            link.setHref(url);
            link.setText(urlname);
            person.setLink(link);
        }

        EmailType emailType = new EmailType();
        if(email != null){
            String[] splitMail = email.split("@");
            emailType.setId(splitMail[0]);
            emailType.setDomain(splitMail[1]);
            person.setEmail(emailType);
        }
        return person;



    }

    BoundsType convertFrom10BoundsTo11Bounds(com.topografix.gpx._1._0.BoundsType bounds){
        if(bounds != null){
            BoundsType newBounds = new BoundsType();
            newBounds.setMaxlat(bounds.getMaxlat());
            newBounds.setMaxlon(bounds.getMaxlon());
            newBounds.setMinlat(bounds.getMinlat());
            newBounds.setMinlon(bounds.getMinlon());
            return newBounds;
        }
        else {
            return null;
        }
    }
}
