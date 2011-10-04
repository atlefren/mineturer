package net.atlefren.GpxUploader.dao;

import net.atlefren.GpxUploader.model.*;
import net.atlefren.GpxUploader.service.HeightComputer;
import net.atlefren.GpxUploader.service.LengthComputer;
import net.atlefren.GpxUploader.service.TimeComputer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

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
    private static String schema = "mineturer";

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.insertAssignment = new SimpleJdbcInsert(dataSource).
                withTableName(schema+".trips").
                usingColumns("userid", "title", "description","start","stop","triptype","flickrtags").
                usingGeneratedKeyColumns("tripid");
    }


    public List<Trip> getTrips(int userid){
        String sql = "SELECT * FROM "+schema+".trips WHERE userid='"+userid+"'";
        Map<String, Object> map = new HashMap<String, Object>();
        return namedParameterJdbcTemplate.query(sql, map, simpleTripRowMapper);
    }

    public void updateTrip(Trip updated,int userid){
        jdbcTemplate.update(
                "update "+schema+".trips set title = ?, description=?, triptype=?, flickrtags=? where tripid = ? AND userid=?",
                updated.getName(),updated.getDescription(),updated.getType(),updated.getTags(), Integer.parseInt(updated.getId()),userid);

    }

    public List<Trip> getSimpleTripInfo(int tripId){
        String sql = "SELECT t.tripid as tripid, t.title as title, u.username as username FROM "+schema+".trips t, "+schema+".users u WHERE t.tripid=:tripId AND t.userid=u.userid";
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("tripId",tripId);
        return namedParameterJdbcTemplate.query(sql, map, tripRowMapperWithUser);
    }

    public void deleteTrip(int userid, int tripId){
        jdbcTemplate.update("DELETE FROM "+schema+".trips WHERE userid="+userid+" AND tripid= "+tripId);
    }

    public List<CentroidPoint> getCentroids(int userid,String srid){
        String sql = "SELECT asText(ST_Centroid(st_transform(ST_Multi(ST_Collect(f.the_geom)),:srid))) as point,tripid,title,triptype,start FROM (SELECT (ST_Dump(t.geom)).geom As the_geom, ts.tripid as tripid,ts.title as title,ts.triptype as triptype,ts.start as start FROM "+schema+".tracks as t, "+schema+".trips AS ts WHERE ts.tripid=t.tripid AND ts.userid=:userId) AS f GROUP BY start,tripid,title,triptype ORDER BY start DESC";
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("srid",Integer.valueOf(srid));
        map.put("userId",userid);
        return namedParameterJdbcTemplate.query(sql,map,wktPointRowMapper);
    }

    public CentroidPoint getCentroid(int tripid, int userid,String srid){
        String sql = "SELECT asText(ST_Centroid(st_transform(ST_Multi(ST_Collect(f.the_geom)),:srid))) as point,tripid,title,triptype,start FROM (SELECT (ST_Dump(t.geom)).geom As the_geom, ts.tripid as tripid,ts.title as title,ts.triptype as triptype,ts.start as start FROM "+schema+".tracks as t, "+schema+".trips AS ts WHERE ts.tripid=t.tripid AND ts.userid=:userId AND t.tripid=:tripId) AS f GROUP BY start,tripid,title,triptype";
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("tripId",tripid);
        map.put("userId",userid);
        map.put("srid",Integer.valueOf(srid));
        return namedParameterJdbcTemplate.query(sql,map,wktPointRowMapper).get(0);
    }

    public Trip getTripDetails(int userid, String srid, int tripid,boolean includeGeom){
        this.srid = srid;
        String sql = "SELECT * FROM "+schema+".trips WHERE userid=:userId AND tripid=:tripId";
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("tripId",tripid);
        map.put("userId",userid);
        map.put("srid",Integer.valueOf(srid));
        if(includeGeom){
            return namedParameterJdbcTemplate.query(sql, map, tripGeomRowMapper).get(0);
        }
        else {
            return namedParameterJdbcTemplate.query(sql, map, tripRowMapper).get(0);
        }
    }


    public List<GpxPoint> getPointsForTrip(int tripId,int userId){
        String sql = "SELECT st_x(geom) as lon, st_y(geom) as lat, ele, \"time\",hr FROM "+schema+".points WHERE tripid=:tripId";
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("tripId",tripId);
        return namedParameterJdbcTemplate.query(sql,map,pointRowMapper);
    }

    public List<String> getTracksForTrip(String srid, int id){
        this.srid = srid;
        List<String> trackWkts =getTracksAsEwkt(id);
        List<String> res = new ArrayList<String>();
        for(String trackwkt:trackWkts){
            res.add(trackwkt.replaceFirst("SRID="+srid+";",""));
        }
        return res;
    }


    public String getFlickrTagsForTrip(int userid,int tripid){
        String sql = "SELECT flickrtags from mineturer.trips WHERE tripid=? AND userid=?";
        Object[] parameters = new Object[]{tripid,userid};
        List<String> tags = jdbcTemplate.query(sql,parameters,tagsRowMapper);
        if(tags.size()>0){
            return tags.get(0);
        }
        else {
            return null;
        }
    }

    public int saveTripToDb(GpxFileContents trip,int userid,String type,String tags){
        Map<String,Object> namedParameters = new HashMap<String,Object>();


        namedParameters.put("userid", userid);
        namedParameters.put("title", trip.getName());
        namedParameters.put("description", trip.getDescription());
        namedParameters.put("start", trip.getStart());
        namedParameters.put("stop", trip.getStop());
        namedParameters.put("triptype", type);
        namedParameters.put("flickrtags", tags);


        int tripId = insertAndGetKey(namedParameters);
        trip.setId(Integer.toString(tripId));

        for(String track:trip.getTracksAsWKT()){
            this.jdbcTemplate.update("INSERT INTO "+schema+".tracks (tripid,geom) VALUES (?,GeomFromText(?,4326))",tripId,track);
        }
        for(String route:trip.getRoutesAsWKT()){
            this.jdbcTemplate.update("INSERT INTO "+schema+".routes (tripid,geom) VALUES (?,GeomFromText(?,4326))",tripId,route);
        }
        for(String wp:trip.getWaypointsAsWKT()){
            this.jdbcTemplate.update("INSERT INTO "+schema+".waypoints (tripid,geom) VALUES (?,GeomFromText(?,4326))",tripId,wp);
        }

        for(GpxTrack track:trip.getTracks()){
            for (List<GpxPoint> segment: track.getTrackSegments()){
                for(GpxPoint point:segment){
                    this.jdbcTemplate.update("INSERT INTO "+schema+".points (tripid,geom,ele,\"time\",hr) VALUES (?,ST_SetSRID(ST_MakePoint(?, ?),4326) ,?,?,?)",tripId,point.getLon(),point.getLat(), point.getEle(),point.getTime(),point.getHr());
                }
            }
        }
        return tripId;
    }

    private List<String> getTracksAsEwkt(int tripId){
        String sql;
        if(srid != null){
            sql = "SELECT asEWKT(st_transform(geom,:srid)) as ewkt FROM "+schema+".tracks WHERE tripid=:tripId";
        }else {
            sql = "SELECT asEWKT(geom) as ewkt FROM "+schema+".tracks WHERE tripid=:tripId";
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("tripId",tripId);
        map.put("srid",Integer.valueOf(srid));
        return  namedParameterJdbcTemplate.query(sql, map, geomRowMapper);
    }

    private List<String> getTracks(int tripId){
        String sql;
        if(srid != null){
            sql = "SELECT AsText(st_transform(geom,:srid)) as ewkt FROM "+schema+".tracks WHERE tripid=:tripId";
        }else {
            sql = "SELECT AsText(geom) as ewkt FROM "+schema+".tracks WHERE tripid=:tripId";
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("tripId",tripId);
        map.put("srid",Integer.valueOf(srid));
        return  namedParameterJdbcTemplate.query(sql, map, geomRowMapper);
    }

    private List<String> getWaypoints(int tripId){
        String sql;
        if(srid != null){
            sql = "SELECT AsText(st_transform(geom,:srid)) as ewkt FROM "+schema+".waypoints WHERE tripid=:tripId";
        }else {
            sql = "SELECT AsText(geom) as ewkt FROM "+schema+".waypoints WHERE tripid=:tripId";
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("tripId",tripId);
        map.put("srid",Integer.valueOf(srid));
        return  namedParameterJdbcTemplate.query(sql, map, geomRowMapper);
    }

    private List<String> getRoutes(int tripId){
        String sql;
        if(srid != null){
            sql = "SELECT AsText(st_transform(geom,:srid)) as ewkt FROM "+schema+".routes WHERE tripid=:tripId";
        }else {
            sql = "SELECT AsText(geom) as ewkt FROM "+schema+".routes WHERE tripid=:tripId";
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("tripId",tripId);
        map.put("srid",Integer.valueOf(srid));
        return  namedParameterJdbcTemplate.query(sql, map, geomRowMapper);
    }

    private final RowMapper<Trip> tripGeomRowMapper = new RowMapper<Trip>() {
     public Trip mapRow(ResultSet rs, int rowNum) throws SQLException {
            List<GpxPoint> points = getPointsForTrip(rs.getInt("tripid"),-1);
            Trip trip = new Trip();
            trip.setId(Integer.toString(rs.getInt("tripid")));
            trip.setName(rs.getString("title"));
            trip.setDescription(rs.getString("description"));
            trip.setType(rs.getString("triptype"));
            trip.setStart(rs.getTimestamp("start"));
            trip.setStop(rs.getTimestamp("stop"));
            trip.setTags(rs.getString("flickrtags"));
            trip.setTracks(getTracks(rs.getInt("tripid")));
            trip.setLenghts(LengthComputer.generateLengthts(points));
            trip.setTimes(TimeComputer.generateTimes(points));
            trip.setHeights(HeightComputer.computeHeights(points));
            trip.setWaypoints(getWaypoints(rs.getInt("tripid")));
            trip.setRoutes(getRoutes(rs.getInt("tripid")));
            return trip;
        }
    };

    private final RowMapper<Trip> tripRowMapper = new RowMapper<Trip>() {
     public Trip mapRow(ResultSet rs, int rowNum) throws SQLException {
            List<GpxPoint> points = getPointsForTrip(rs.getInt("tripid"),-1);
            Trip trip = new Trip();
            trip.setId(Integer.toString(rs.getInt("tripid")));
            trip.setName(rs.getString("title"));
            trip.setDescription(rs.getString("description"));
            trip.setType(rs.getString("triptype"));
            trip.setStart(rs.getTimestamp("start"));
            trip.setStop(rs.getTimestamp("stop"));
            trip.setTags(rs.getString("flickrtags"));
            trip.setLenghts(LengthComputer.generateLengthts(points));
            trip.setTimes(TimeComputer.generateTimes(points));
            trip.setHeights(HeightComputer.computeHeights(points));
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
            point.setHr(rs.getDouble("hr"));
            return point;
        }
    };

    private final RowMapper<Trip> simpleTripRowMapper = new RowMapper<Trip>() {
        public Trip mapRow(ResultSet rs, int rowNum) throws SQLException {
            Trip trip = new Trip();
            trip.setId(Integer.toString(rs.getInt("tripid")));
            trip.setName(rs.getString("title"));
            trip.setUser(rs.getString("userid"));
            return trip;
        }
    };

    private final RowMapper<Trip> tripRowMapperWithUser = new RowMapper<Trip>() {
        public Trip mapRow(ResultSet rs, int rowNum) throws SQLException {
            Trip trip = new Trip();
            trip.setId(Integer.toString(rs.getInt("tripid")));
            trip.setName(rs.getString("title"));
            trip.setUser(rs.getString("username"));
            return trip;
        }
    };

    private final RowMapper<String> geomRowMapper = new RowMapper<String>() {
        public  String mapRow(ResultSet rs, int rowNum) throws SQLException {
            return rs.getString("ewkt");
        }
    };

    private final RowMapper<String> tagsRowMapper = new RowMapper<String>() {
        public  String mapRow(ResultSet rs, int rowNum) throws SQLException {
            return rs.getString("flickrtags");
        }
    };

    private final RowMapper<CentroidPoint> wktPointRowMapper = new RowMapper<CentroidPoint>() {
        public CentroidPoint mapRow(ResultSet rs, int rowNum) throws SQLException {
            CentroidPoint cp = new CentroidPoint();
            cp.setGeom(rs.getString("point"));
            cp.setDate(rs.getTimestamp("start"));
            cp.setId(rs.getInt("tripid"));
            cp.setTitle(rs.getString("title"));
            cp.setType(rs.getString("triptype"));
            return cp;
        }
    };


    private int insertAndGetKey(Map parametermap){
        return insertAssignment.executeAndReturnKey(parametermap).intValue();
    }


}
