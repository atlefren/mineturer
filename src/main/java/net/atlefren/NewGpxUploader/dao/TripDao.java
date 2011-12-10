package net.atlefren.NewGpxUploader.dao;

import net.atlefren.NewGpxUploader.model.Trip;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/8/11
 * Time: 9:16 PM
 * To change this template use File | Settings | File Templates.
 */

@Component("TripDao")
public class TripDao {

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    private SimpleJdbcInsert insertAssignment;

    //TODO move!!
    private static String schema = "mineturer";

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
        this.insertAssignment = new SimpleJdbcInsert(dataSource).
                withTableName(schema+".trips").
                usingColumns("userid", "title", "description","start","stop","triptype","flickrtags","single").
                usingGeneratedKeyColumns("tripid");
    }


    public List<Trip> getTrips(int userid){
        String sql = "SELECT * FROM "+schema+".trips WHERE userid=:userid ORDER BY tripid";
        MapSqlParameterSource paramSource = new MapSqlParameterSource();
        paramSource.addValue("userid", userid);


        return namedParameterJdbcTemplate.query(sql,paramSource,tripRowMapper);
    }


    public Trip getTrip(int tripid){
     String sql = "SELECT * FROM "+schema+".trips WHERE tripid=:tripid";
        MapSqlParameterSource paramSource = new MapSqlParameterSource();
        paramSource.addValue("tripid", tripid);

        return namedParameterJdbcTemplate.query(sql, paramSource, tripRowMapper).get(0);
    }


    public int saveTrip(Trip trip,boolean singleTrack){
      Map<String,Object> namedParameters = new HashMap<String,Object>();


        namedParameters.put("userid", trip.getUserid());
        namedParameters.put("title", trip.getTitle());
        namedParameters.put("description", trip.getDescription());
        namedParameters.put("start", trip.getStart());
        namedParameters.put("stop", trip.getStop());
        namedParameters.put("triptype", trip.getTriptype());
        namedParameters.put("flickrtags", trip.getFlickrtags());
        namedParameters.put("single",singleTrack);


        return insertAssignment.executeAndReturnKey(namedParameters).intValue();
    }

    private final RowMapper<Trip> tripRowMapper = new RowMapper<Trip>() {
        public Trip mapRow(ResultSet rs, int rowNum) throws SQLException {
            Trip trip = new Trip();
            trip.setTripid(rs.getInt("tripid"));
            trip.setUserid(rs.getInt("userid"));
            trip.setTitle(rs.getString("title"));
            trip.setDescription(rs.getString("description"));
            trip.setTriptype(rs.getString("triptype"));
            trip.setFlickrtags(rs.getString("flickrtags"));
            trip.setStart(rs.getTimestamp("start"));
            trip.setStop(rs.getTimestamp("stop"));
            trip.setSingletrack(rs.getBoolean("single"));
            return trip;
        }
    };
}