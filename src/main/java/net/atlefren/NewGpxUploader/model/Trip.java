
package net.atlefren.NewGpxUploader.model;

import org.postgis.Point;

import java.util.Date;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/8/11
 * Time: 8:58 PM
 * To change this template use File | Settings | File Templates.
 */
public class Trip {

    private int tripid;
    private int userid;
    private String title;
    private String description;
    private Date start;
    private Date stop;
    private String triptype;
    private String flickrtags;
    private List<Trackpoint> trackpoints;
    boolean singletrack;


    public int getTripid() {
        return tripid;
    }

    public void setTripid(int tripid) {
        this.tripid = tripid;
    }

    public int getUserid() {
        return userid;
    }

    public void setUserid(int userid) {
        this.userid = userid;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getStart() {
        return start;
    }

    public void setStart(Date start) {
        this.start = start;
    }

    public Date getStop() {
        return stop;
    }

    public void setStop(Date stop) {
        this.stop = stop;
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

    public List<Trackpoint> getTrackpoints() {
        return trackpoints;
    }

    public void setTrackpoints(List<Trackpoint> trackpoints) {
        this.trackpoints = trackpoints;
    }

    public boolean isSingletrack() {
        return singletrack;
    }

    public void setSingletrack(boolean singletrack) {
        this.singletrack = singletrack;
    }
}