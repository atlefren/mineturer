package net.atlefren.GpxUploader.dao;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/2/11
 * Time: 1:21 PM
 */

import net.atlefren.GpxUploader.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;






/**
 * Created by IntelliJ IDEA.
 * User: Torbjørn Danielsen
 * Date: 4/8/11
 * Time: 1:39 PM
 */
@Repository
public class UserDao {

    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;
    private JdbcTemplate jdbcTemplate;
    private SimpleJdbcInsert insertUser;
    private static String schema = "mineturer";

    @Autowired
    public void setDataSource(DataSource dataSource) {
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(dataSource);
        this.jdbcTemplate = new JdbcTemplate(dataSource);
        this.insertUser = new SimpleJdbcInsert(dataSource).
                withTableName(schema+".users").
                usingColumns("username", "password", "enabled","email","fullname","flickrid").
                usingGeneratedKeyColumns("userid");
    }

    public User getUser(String username) {
        String sql = "select * from "+schema+".users where username = :username";

        Map<String, String> parameters = new HashMap<String, String>();
        parameters.put("username", username);
        List<User> query = namedParameterJdbcTemplate.query(sql, parameters, userRowMapper);
        if (query.size() > 0) {
            return query.get(0);
        } else {
            return null;
        }
    }

    public boolean saveUser(User user){
        Map<String,Object> namedParameters = new HashMap<String,Object>();
        namedParameters.put("username", user.getUsername());
        namedParameters.put("email",user.getEmail());
        namedParameters.put("fullname",user.getFullname());
        namedParameters.put("enabled",user.isEnabled());
        namedParameters.put("password",user.getPassword());
        namedParameters.put("flickrid",user.getFlickrId());
        int userId = insertAndGetKey(namedParameters);

        this.jdbcTemplate.update("INSERT INTO "+schema+".\"userRoles\" (userid,authority) VALUES (?,?)",userId,"ROLE_USER");
        return true;
    }

    private int insertAndGetKey(Map parametermap){
        return insertUser.executeAndReturnKey(parametermap).intValue();
    }

    public boolean userExists(String username){
        String sql = "select count(*) from "+schema+".users where username = '"+username+"'";
        int count = jdbcTemplate.queryForInt(sql);
        if(count == 0){
            return false;
        }
        else {
            return true;
        }


    }

    public void updateUser(User user){
        jdbcTemplate.update(
                "update "+schema+".users set fullname = ?, flickrid=?, email=? where userid = ?",
                user.getFullname(),user.getFlickrId(),user.getEmail(),user.getId());

    }

    private final RowMapper<User> userRowMapper = new RowMapper<User>() {
        public User mapRow(ResultSet rs, int rowNum) throws SQLException {
            User user = new User();
            user.setUsername(rs.getString("username"));
            user.setPassword(rs.getString("password"));
            user.setEnabled(rs.getBoolean("enabled"));
            user.setFullname(rs.getString("fullname"));
            user.setId(rs.getInt("userid"));
            user.setEmail(rs.getString("email"));
            user.setFlickrId(rs.getString("flickrid"));
            user.setAuthorities(getRolesForUser(rs.getInt("userid")));
            return user;
        }
    };

    private Collection<GrantedAuthority> getRolesForUser(int userid) {
        Collection<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
        String sql = "select authority from "+schema+".\"userRoles\" where userid = :userid";
        Map<String, Integer> parameters = new HashMap<String, Integer>();
        parameters.put("userid", userid);
        List<String> query = namedParameterJdbcTemplate.queryForList(sql, parameters, String.class);
        if (query.size() > 0) {
            for (String s : query) {
                grantedAuthorities.add(new GrantedAuthorityImpl(s));
            }
        }
        return grantedAuthorities;
    }
}

