package net.atlefren.GpxUploader.dao;

import net.atlefren.GpxUploader.model.*;
import net.atlefren.GpxUploader.service.LengthComputer;
import org.geotools.styling.Description;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSourceUtils;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import javax.lang.model.SourceVersion;
import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/14/11
 * Time: 3:43 PM
 */
@Component("TripDao")
public class TripDao {

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private JdbcTemplate jdbcTemplate;
    private SimpleJdbcInsert insertAssignment;

    private String srid;
    private LengthComputer lengthComputer = new LengthComputer();

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.insertAssignment = new SimpleJdbcInsert(dataSource).
                withTableName("trips.trips").
                usingColumns("userid", "title", "description","start","stop").
                usingGeneratedKeyColumns("tripid");
    }


    public List<Trip> getTrips(String user,String srid){
        this.srid = srid;

        String sql = "SELECT tripid,title FROM trips.trips WHERE userid="+user;
        Map<String, Object> map = new HashMap<String, Object>();
        return namedParameterJdbcTemplate.query(sql, map, tripRowMapper);
    }


    public List<CentroidPoint> getCentroids(String user,String srid){
        String sql = "SELECT asText(ST_Centroid(st_transform(t.geom,"+srid+"))) as point, ts.tripid as tripid,ts.title as title FROM trips.tracks as t, trips.trips AS ts WHERE ts.tripid=t.tripid AND ts.userid="+user;
        Map<String, Object> map = new HashMap<String, Object>();
        return namedParameterJdbcTemplate.query(sql,map,wktPointRowMapper);
    }

    public Trip getTripGeom(String user,String srid,int id){
        this.srid = srid;
        String sql = "SELECT * FROM trips.trips WHERE userid="+user+" AND tripid="+id;
        Map<String, Object> map = new HashMap<String, Object>();
        return namedParameterJdbcTemplate.query(sql, map, tripGeomRowMapper).get(0);
    }

    public List<GpxPoint> getPointsForTrip(int id){
        String sql = "SELECT st_x(geom) as lon, st_y(geom) as lat, ele, \"time\" FROM trips.points WHERE tripid="+id;
        Map<String, Object> map = new HashMap<String, Object>();
        return namedParameterJdbcTemplate.query(sql,map,pointRowMapper);
    }

    public int saveTripToDb(GpxFileContents trip,String user){
        Map<String,Object> namedParameters = new HashMap<String,Object>();

        namedParameters.put("userid", Integer.parseInt(user));
        namedParameters.put("title", trip.getName());
        namedParameters.put("description", trip.getDescription());
        namedParameters.put("start", trip.getStart());
        namedParameters.put("stop", trip.getStop());

        int tripId = insertAndGetKey(namedParameters);
        trip.setId(Integer.toString(tripId));

        for(String track:trip.getTracksAsWKT()){
            this.jdbcTemplate.update("INSERT INTO trips.tracks (tripid,geom) VALUES (?,GeomFromText(?,4326))",tripId,track);
        }
        for(String route:trip.getRoutesAsWKT()){
            this.jdbcTemplate.update("INSERT INTO trips.routes (tripid,geom) VALUES (?,GeomFromText(?,4326))",tripId,route);
        }
        for(String wp:trip.getWaypointsAsWKT()){
            this.jdbcTemplate.update("INSERT INTO trips.waypoints (tripid,geom) VALUES (?,GeomFromText(?,4326))",tripId,wp);
        }

        for(GpxTrack track:trip.getTracks()){
            for (List<GpxPoint> segment: track.getTrackSegments()){
                for(GpxPoint point:segment){
                    this.jdbcTemplate.update("INSERT INTO trips.points (tripid,geom,ele,\"time\") VALUES (?,ST_SetSRID(ST_MakePoint(?, ?),4326) ,?,?)",tripId,point.getLon(),point.getLat(), point.getEle(),point.getTime());
                }
            }
        }
        return tripId;
    }

    private List<String> getTracks(int tripid){
        String sql;
        if(srid != null){
            sql = "SELECT AsText(st_transform(geom,"+ srid+")) as ewkt FROM trips.tracks WHERE tripid=" + tripid;
        }else {
            sql = "SELECT AsText(geom) as ewkt FROM trips.tracks WHERE tripid=" + tripid;
        }
        Map<String, Object> map = new HashMap<String, Object>();
        return  namedParameterJdbcTemplate.query(sql, map, geomRowMapper);
    }

    private List<String> getWaypoints(int tripid){
        String sql;
        if(srid != null){
            sql = "SELECT AsText(st_transform(geom,"+ srid+")) as ewkt FROM trips.waypoints WHERE tripid=" + tripid;
        }else {
            sql = "SELECT AsText(geom) as ewkt FROM trips.waypoints WHERE tripid=" + tripid;
        }
        Map<String, Object> map = new HashMap<String, Object>();
        return  namedParameterJdbcTemplate.query(sql, map, geomRowMapper);
    }

    private List<String> getRoutes(int tripid){
        String sql;
        if(srid != null){
            sql = "SELECT AsText(st_transform(geom,"+ srid+")) as ewkt FROM trips.routes WHERE tripid=" + tripid;
        }else {
            sql = "SELECT AsText(geom) as ewkt FROM trips.routes WHERE tripid=" + tripid;
        }
        Map<String, Object> map = new HashMap<String, Object>();
        return  namedParameterJdbcTemplate.query(sql, map, geomRowMapper);
    }

    private final RowMapper<Trip> tripGeomRowMapper = new RowMapper<Trip>() {
     public Trip mapRow(ResultSet rs, int rowNum) throws SQLException {
            Trip trip = new Trip();
            trip.setId(Integer.toString(rs.getInt("tripid")));
            trip.setName(rs.getString("title"));
            trip.setDescription(rs.getString("description"));
            trip.setStart(rs.getTimestamp("start"));
            trip.setStop(rs.getTimestamp("stop"));
            trip.setTracks(getTracks(rs.getInt("tripid")));
            trip.setDistance(lengthComputer.generateLength(getTracks(rs.getInt("tripid"))));
            trip.setWaypoints(getWaypoints(rs.getInt("tripid")));
            trip.setRoutes(getRoutes(rs.getInt("tripid")));
            double dur = (rs.getTimestamp("stop").getTime()-rs.getTimestamp("start").getTime())/1000;
            trip.setDuration(dur);
            return trip;
        }
    };

    private final RowMapper<GpxPoint> pointRowMapper = new RowMapper<GpxPoint>() {
        public GpxPoint mapRow(ResultSet rs, int rowNum) throws SQLException {
            GpxPoint point = new GpxPoint();
            point.setLon(rs.getDouble("lon"));
            point.setLat(rs.getDouble("lat"));
            point.setEle(rs.getDouble("ele"));
            point.setTime(rs.getTimestamp("time"));
            return point;
        }
    };

    private final RowMapper<Trip> tripRowMapper = new RowMapper<Trip>() {
        public Trip mapRow(ResultSet rs, int rowNum) throws SQLException {
            Trip trip = new Trip();
            trip.setId(Integer.toString(rs.getInt("tripid")));
            trip.setName(rs.getString("title"));
            return trip;
        }
    };

    private final RowMapper<String> geomRowMapper = new RowMapper<String>() {
        public  String mapRow(ResultSet rs, int rowNum) throws SQLException {
            return rs.getString("ewkt");
        }
    };

    private final RowMapper<CentroidPoint> wktPointRowMapper = new RowMapper<CentroidPoint>() {
        public CentroidPoint mapRow(ResultSet rs, int rowNum) throws SQLException {
            CentroidPoint cp = new CentroidPoint();
            cp.setGeom(rs.getString("point"));
            cp.setId(rs.getInt("tripid"));
            cp.setTitle(rs.getString("title"));
            return cp;
        }
    };


    private int insertAndGetKey(Map parametermap){
        return insertAssignment.executeAndReturnKey(parametermap).intValue();
    }


}
