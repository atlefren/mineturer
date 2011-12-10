package net.atlefren.NewGpxUploader.service;

import net.atlefren.NewGpxUploader.dao.PointDao;
import net.atlefren.NewGpxUploader.dao.TripDao;
import net.atlefren.NewGpxUploader.model.Trackpoint;
import net.atlefren.NewGpxUploader.model.Trip;
import net.atlefren.NewGpxUploader.model.TripTransferObject;
import org.postgis.LineString;
import org.postgis.MultiLineString;
import org.postgis.Point;
import org.postgis.binary.BinaryParser;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/9/11
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */

@Component
public class TripFetcher {


    @Resource
    private TripDao tripDao;

    @Resource
    private PointDao pointDao;

    @Resource
    private StatsComputer statsComputer;

    @Resource
    private PostGisToWKTWriter postGisToWKTWriter;



    public TripTransferObject getTrip(int tripid,int userid){


        Trip trip = tripDao.getTrip(tripid);

        List<Trackpoint> points = pointDao.getTrackPoints(tripid);

        TripTransferObject transfer = new TripTransferObject(trip.getTripid(),trip.getUserid(),trip.getTitle(),trip.getDescription(),trip.getStart(),trip.getStop(),trip.getTriptype(),trip.getFlickrtags());

        transfer.setTracks(getWktStrings(points,trip.isSingletrack()));

        transfer.setTimes(statsComputer.generateTimes(points));
        transfer.setLenghts(statsComputer.generateLengthts(points));
        transfer.setHeights(statsComputer.generateHeights(points));

        return transfer;
    }

    public List<TripTransferObject> getTripsForUser(int userid,int srid){

        List<Trip> trips = tripDao.getTrips(userid);

        List<TripTransferObject> transferObjs = new ArrayList<TripTransferObject>();
        for(Trip trip:trips){
            TripTransferObject transferObject = new TripTransferObject(trip.getTripid(),trip.getTitle(),trip.getStart(),trip.getTriptype());
            transferObject.setCentroid(postGisToWKTWriter.parsePoint(pointDao.getCentroid(trip.getTripid(),srid),srid));
            transferObject.setLength(pointDao.getLengthOfTrip(trip.getTripid()));
            transferObjs.add(transferObject);
        }

        return transferObjs;
    }


    private List<String> getWktStrings(List<Trackpoint> points,boolean single){

        int track = 0;
        int segment = 0;

        List<MultiLineString> mlsArr = new ArrayList<MultiLineString>();
        List<LineString> lineArr = new ArrayList<LineString>();
        List<Point> pointArr = new ArrayList<Point>();
        for(Trackpoint point:points){
            if(point.getTracknr()!=track){
                track =point.getTracknr();
                mlsArr.add(createMultiLineString(lineArr));
                lineArr.clear();
            }

            if(!single && point.getSegmentnr() != segment){
                segment = point.getSegmentnr();
                lineArr.add(createLineString(pointArr));
                pointArr.clear();
            }
            pointArr.add(point.getGeom());
        }

        lineArr.add(createLineString(pointArr));
        pointArr.clear();

        mlsArr.add(createMultiLineString(lineArr));
        lineArr.clear();

        List<String> stringArr = new ArrayList<String>();
        for(MultiLineString mls:mlsArr){
            stringArr.add(postGisToWKTWriter.parseMultiLineString(mls,900913));
        }

        return stringArr;
    }


    private LineString createLineString(List<Point> pointArr){
        Point[] pArr = new Point[pointArr.size()];
        pointArr.toArray(pArr);
        LineString ls = new LineString(pArr);
        ls.setSrid(pointArr.get(0).getSrid());
        return ls;

    }

    private MultiLineString createMultiLineString(List<LineString> lineArr){
     LineString[] lsArr = new LineString[lineArr.size()];
        lineArr.toArray(lsArr);
        MultiLineString mls = new MultiLineString(lsArr);
        mls.setSrid(lineArr.get(0).getSrid());
        return mls;
    }

}
