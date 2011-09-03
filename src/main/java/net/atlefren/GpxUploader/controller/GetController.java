package net.atlefren.GpxUploader.controller;

import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import com.vividsolutions.jts.io.WKTWriter;
import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.dao.UserDao;
import net.atlefren.GpxUploader.model.CentroidPoint;
import net.atlefren.GpxUploader.model.Trip;
import net.atlefren.GpxUploader.model.User;
import net.atlefren.GpxUploader.service.HeightProfileGenerator;
import net.atlefren.GpxUploader.service.SpeedProfileGenerator;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;
import org.geotools.math.Statistics;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/10/11
 * Time: 5:52 PM
 */
@Controller
public class GetController {

    @Resource
    private TripDao tripDao;

    @Resource
    private UserDao userDao;

    private static Logger logger = Logger.getLogger(TripDao.class);



    @RequestMapping(value = "getCentroids", method = RequestMethod.GET)
    @ResponseBody
    public List<CentroidPoint> getTripCentroids(){
        return tripDao.getCentroids(getUser(),"900913");
    }

    @RequestMapping(value = "getTrips", method = RequestMethod.GET)
    @ResponseBody
    public List<Trip> getTrips() {
        return  tripDao.getTrips(getUser());
    }

    @RequestMapping(value = "getTripGeom", method = RequestMethod.GET)
    @ResponseBody
    public Trip getTripGeom(@RequestParam("id") int id) {
        return tripDao.getTripGeom(getUser(), "900913", id);
    }

    //TODO: rewrite to calculate from points

    @RequestMapping(value = "getTripHeights", method = RequestMethod.GET)
    @ResponseBody
    public List<List<Double>> getTripHeights(@RequestParam("id") int id) {
        HeightProfileGenerator profileGenerator = new HeightProfileGenerator();
        return profileGenerator.generateFlotSeries(tripDao.getPointsForTrip(id,getUser()));
    }

    @RequestMapping(value = "getTripSpeeds", method = RequestMethod.GET)
    @ResponseBody
    public List<List<Double>> getTripSpeeds(@RequestParam("id") int id) {
        SpeedProfileGenerator profileGenerator = new SpeedProfileGenerator();
        return profileGenerator.generateFlotSeries(tripDao.getPointsForTrip(id,getUser()));
    }

    private int getUser(){
        User user= (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        /*
        System.out.println("user.getId() = " + user.getId());
        System.out.println("user.getEmail() = " + user.getEmail());
          */
        return user.getId();
    }

    @RequestMapping(value = "checkUsername", method = RequestMethod.GET)
    @ResponseBody
    public boolean checkUsername(@RequestParam("username") String username) {
        return userDao.userExists(username);
    }

    @RequestMapping(value = "registerUser", method = RequestMethod.GET)
    @ResponseBody
    public boolean registerUser(@RequestParam("username") String username,@RequestParam("password") String password,@RequestParam("fullname") String fullname,@RequestParam("email") String email){

        if(!userDao.userExists(username) && password.length()>7 && !email.equals("")){
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setPassword(DigestUtils.shaHex(password));
            newUser.setFullname(fullname);
            newUser.setEnabled(true);
            newUser.setEmail(email);
            return userDao.saveUser(newUser);
        }
        else {
            return false;
        }
    }
}
