package net.atlefren.GpxUploader.controller;


import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.dao.UserDao;
import net.atlefren.GpxUploader.model.CentroidPoint;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.Trip;
import net.atlefren.GpxUploader.model.User;
import net.atlefren.GpxUploader.service.GraphGenerator;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.log4j.Logger;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import javax.annotation.Resource;
import java.util.List;


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




    @RequestMapping(value = "getGraphSeries", method = RequestMethod.GET)
    @ResponseBody
    public List<List<Double>> getGraphSeries(@RequestParam("id") int id, @RequestParam("type") String type) {

        List<GpxPoint> points = tripDao.getPointsForTrip(id, getUser());
        if(type.equals("height_dist")){
            return GraphGenerator.generateDistHeightProfile(points);
        }
        else if(type.equals("height_time")){
            return GraphGenerator.generateTimeHeightProfile(points);
        }
        else if(type.equals("speed_dist")){
            return GraphGenerator.generateDistSpeedProfile(points);
        }
        else if(type.equals("speed_time")){
            return GraphGenerator.generateTimeSpeedProfile(points);
        }
        else if(type.equals("dist_time")){
            return GraphGenerator.generateTimeDistanceProfile(points);
        }
        else if(type.equals("hr_dist")){
            return GraphGenerator.generateDistHrProfile(points);
        }
        else if(type.equals("hr_time")){
            return GraphGenerator.generateTimeHrProfile(points);
        }
        else {
            return null;
        }

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
