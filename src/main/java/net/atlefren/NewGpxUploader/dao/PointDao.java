package net.atlefren.NewGpxUploader.dao;

import net.atlefren.NewGpxUploader.model.Trackpoint;
import net.atlefren.NewGpxUploader.model.Trip;
import org.postgis.Geometry;
import org.postgis.PGgeometry;
import org.postgis.Point;
import org.postgis.binary.BinaryParser;
import org.postgis.binary.BinaryWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/8/11
 * Time: 9:27 PM
 * To change this template use File | Settings | File Templates.
 */

@Component("PointDao")
public class PointDao {
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    //TODO move!!
    private static String schema = "mineturer";

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
    }




    public List<Trackpoint> getTrackPoints(int tripid){
         String sql = "SELECT * FROM "+schema+".points WHERE tripid=:tripid";
        MapSqlParameterSource paramSource = new MapSqlParameterSource();
        paramSource.addValue("tripid", tripid);


        return namedParameterJdbcTemplate.query(sql,paramSource,pointRowMapper);
    }

    public boolean savePoints(List<Trackpoint> points,int tripid){


        BinaryWriter bw = new BinaryWriter();
        int aff=0;
        for(Trackpoint point:points){
            System.out.println("point = " + point);
            SqlParameterSource paramSource = new MapSqlParameterSource()
                    .addValue("tripid", tripid)
                    .addValue("ele", point.getElevation())
                    .addValue("time", point.getTimestamp())
                    .addValue("geom", bw.writeBinary(point.getGeom()))
                    .addValue("hr", point.getHeartrate())
                    .addValue("segment", point.getSegmentnr())
                    .addValue("track",point.getTracknr())
                    ;

            System.out.println("paramSource = " + paramSource);
           // String query = "INSERT INTO FORUMS (FORUM_ID, FORUM_NAME, FORUM_DESC) VALUES (:forumId,:forumName,:forumDesc)";
            String sql = "INSERT INTO "+schema+".points (tripid,ele,\"time\",geom,hr,segment,track) VALUES (:tripid,:ele ,:time,:geom,:hr,:segment,:track)";
            aff+=  namedParameterJdbcTemplate.update(sql, paramSource);
        }

        System.out.println("aff = " + aff);
        if(aff==points.size()){
            return true;
        }
        else {
            System.out.println("aff = " + aff);
            return false;
        }
    }


    public Point getCentroid(int tripid, int srid){

        String sql = "SELECT ST_transform(ST_Line_Interpolate_Point(ST_MakeLine(points.geom),0.5),:srid) As point FROM (SELECT geom FROM "+schema+".points WHERE tripid=:tripid ORDER BY tripid, time) As points";
        MapSqlParameterSource paramSource = new MapSqlParameterSource();
        paramSource.addValue("tripid", tripid);
        paramSource.addValue("srid", srid);
        return namedParameterJdbcTemplate.queryForObject(sql,paramSource,new RowMapper<Point>() {
            @Override
            public Point mapRow(ResultSet rs, int rowNum) throws SQLException {
                PGgeometry geom = (PGgeometry)rs.getObject("point");
                return (Point)geom.getGeometry();
            }
        });
    }

    public double getLengthOfTrip(int tripid){
        MapSqlParameterSource paramSource = new MapSqlParameterSource();
        paramSource.addValue("tripid", tripid);
        String sql ="SELECT ST_Length(geography(ST_MakeLine(points.geom)))/1000 As length FROM (SELECT geom FROM "+schema+".points WHERE tripid=:tripid ORDER BY tripid, time) As points";

        return namedParameterJdbcTemplate.queryForObject(sql,paramSource,new RowMapper<Double>() {
            @Override
            public Double mapRow(ResultSet resultSet, int i) throws SQLException {
                return resultSet.getDouble("length");
            }
        });
    }


    private final RowMapper<Trackpoint> pointRowMapper = new RowMapper<Trackpoint>() {
        public Trackpoint mapRow(ResultSet rs, int rowNum) throws SQLException {
            Trackpoint point = new Trackpoint();

            BinaryParser bp = new BinaryParser();
            point.setTracknr(rs.getInt("track"));
            point.setSegmentnr(rs.getInt("segment"));
            point.setElevation(rs.getDouble("ele"));
            point.setTimestamp(rs.getTimestamp("time"));
            PGgeometry geom = (PGgeometry)rs.getObject("geom");
            point.setGeom((Point)geom.getGeometry());
            point.setHeartrate(rs.getDouble("hr"));
            return point;
        }
    };

}
