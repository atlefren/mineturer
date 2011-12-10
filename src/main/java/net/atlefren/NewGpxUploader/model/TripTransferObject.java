package net.atlefren.NewGpxUploader.model;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/9/11
 * Time: 6:50 PM
 * To change this template use File | Settings | File Templates.
 */
public class TripTransferObject {


    private int tripid;

    private String title;
    private String description;
    private String start;
    private String stop;
    private String triptype;
    private String flickrtags;
    private List<String> tracks;
    private List<String> waypoints;
    private String centroid;
    private double length;

    private String date;

    private TimeTransferObject times;
    private LengthTransferObject lenghts;
    private HeightTransferObject heights;

    public TripTransferObject() {
    }

    public TripTransferObject(int tripid, int userid, String title, String description, Date start, Date stop, String triptype, String flickrtags) {
        this.tripid = tripid;
        this.title = title;
        this.description = description;
        this.setStart(start);
        this.setStop(stop);
        this.triptype = triptype;
        this.flickrtags = flickrtags;
    }


    public TripTransferObject(int tripid, String title, Date date, String triptype) {
        this.tripid = tripid;
        this.title = title;
        this.setDate(date);
        this.triptype = triptype;
    }

    public void setDate(Date date){
        Locale norge = new java.util.Locale( "no" );
        this.date= new SimpleDateFormat("d. MMMM yyyy",norge).format(date);
    }

    public String getDate() {
        return date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getTripid() {
        return tripid;
    }

    public void setTripid(int tripid) {
        this.tripid = tripid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = formatDate(start);
    }

    public String getStop() {
        return stop;
    }

    public void setStop(Date stop) {
        this.stop = formatDate(stop);
    }

    public String getTriptype() {
        return triptype;
    }

    public void setTriptype(String triptype) {
        this.triptype = triptype;
    }

    public String getFlickrtags() {
        return flickrtags;
    }

    public void setFlickrtags(String flickrtags) {
        this.flickrtags = flickrtags;
    }

    public List<String> getTracks() {
        return tracks;
    }

    public void setTracks(List<String> tracks) {
        this.tracks = tracks;
    }

    public List<String> getWaypoints() {
        return waypoints;
    }

    public void setWaypoints(List<String> waypoints) {
        this.waypoints = waypoints;
    }

    public String getCentroid() {
        return centroid;
    }

    public void setCentroid(String centroid) {
        this.centroid = centroid;
    }

    private String formatDate(Date date){
        return new SimpleDateFormat("dd.MM.yyyy', kl' H:mm").format(date);
    }

    public TimeTransferObject getTimes() {
        return times;
    }

    public void setTimes(TimeTransferObject times) {
        this.times = times;
    }

    public LengthTransferObject getLenghts() {
        return lenghts;
    }

    public void setLenghts(LengthTransferObject lenghts) {
        this.lenghts = lenghts;
    }

    public HeightTransferObject getHeights() {
        return heights;
    }

    public void setHeights(HeightTransferObject heights) {
        this.heights = heights;
    }

    public double getLength() {
        return length;
    }

    public void setLength(double length) {
        DecimalFormat twoDForm = new DecimalFormat("#.##");
        this.length = Double.valueOf(twoDForm.format(length));
    }
}
