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
    String id;
    String  name;
    String description;
    String start;
    String stop;
    double duration;
    double distance;
    List<String> tracks;
    List<String> routes;
    List<String> waypoints;


    public Trip() {
    }

    public Trip(String name, String description, ArrayList<String> tracks, ArrayList<String> routes, ArrayList<String> waypoints) {
        this.name = name;
        this.description = description;
        this.tracks = tracks;
        this.routes = routes;
        this.waypoints = waypoints;
    }

    public Trip(String id, String name, String description, ArrayList<String> tracks, ArrayList<String> routes, ArrayList<String> waypoints) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.tracks = tracks;
        this.routes = routes;
        this.waypoints = waypoints;
    }

    public Trip(String id, String name, String description, Date start, Date stop, List<String> tracks, List<String> routes, List<String> waypoints) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.start = formatDate(start);
        this.stop = formatDate(stop);
        this.tracks = tracks;
        this.routes = routes;
        this.waypoints = waypoints;
    }

    public Trip(String id, String name, String description, Date start, Date stop, double duration, List<String> tracks, List<String> routes, List<String> waypoints) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.start = formatDate(start);
        this.stop = formatDate(stop);
        this.tracks = tracks;
        this.routes = routes;
        this.waypoints = waypoints;
        this.duration = duration;
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

    public double getDuration() {
        return duration;
    }

    public void setDuration(double duration) {
        this.duration = duration;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
}
