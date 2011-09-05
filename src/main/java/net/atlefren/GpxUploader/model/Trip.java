package net.atlefren.GpxUploader.model;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/6/11
 * Time: 9:58 PM
 */
public class Trip {
    private String id;
    private String  name;
    private String description;
    private String start;
    private String stop;
    private String user;

    private LengthHolder lenghts;
    private TimeHolder times;
    private HeightHolder heights;

    private List<String> tracks;
    private List<String> routes;
    private List<String> waypoints;


    public Trip() {
    }


    public String getId() {
        return id;
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

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getTracks() {
        return tracks;
    }

    public void setTracks(List<String> tracks) {
        this.tracks = tracks;
    }

    public List<String> getRoutes() {
        return routes;
    }

    public void setRoutes(List<String> routes) {
        this.routes = routes;
    }

    public List<String> getWaypoints() {
        return waypoints;
    }

    public void setWaypoints(List<String> waypoints) {
        this.waypoints = waypoints;
    }

    private String formatDate(Date date){
        return new SimpleDateFormat("dd.MM.yyyy', kl' H:mm").format(date);
    }

    public LengthHolder getLenghts() {
        return lenghts;
    }

    public void setLenghts(LengthHolder lenghts) {
        this.lenghts = lenghts;
    }

    public TimeHolder getTimes() {
        return times;
    }

    public void setTimes(TimeHolder times) {
        this.times = times;
    }

    public HeightHolder getHeights() {
        return heights;
    }

    public void setHeights(HeightHolder heights) {
        this.heights = heights;
    }
}
