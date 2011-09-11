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
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URL;
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
        return tripDao.getCentroids(getUserId(),"900913");
    }

    @RequestMapping(value = "getTrips", method = RequestMethod.GET)
    @ResponseBody
    public List<Trip> getTrips() {
        return  tripDao.getTrips(getUserId());
    }

    @RequestMapping(value = "getTripGeom", method = RequestMethod.GET)
    @ResponseBody
    public Trip getTripGeom(@RequestParam("id") int id) {
        return tripDao.getTripGeom(getUserId(), "900913", id);
    }


    @RequestMapping(value = "getGraphSeries", method = RequestMethod.GET)
    @ResponseBody
    public List<List<Double>> getGraphSeries(@RequestParam("id") int id, @RequestParam("type") String type) {

        List<GpxPoint> points = tripDao.getPointsForTrip(id, getUserId());
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


    @RequestMapping("getGeoRSS")
    public void getGeoRSS(HttpServletRequest request, HttpServletResponse httpResponse) {
        int tripid = Integer.valueOf(request.getParameter("tripid"));
        //TODO get tags for tripid
        String tags = tripDao.getFlickrTagsForTrip(getUserId(),tripid);
        if(tags != null && !tags.equals("")){
            String url = "http://api.flickr.com/services/feeds/photos_public.gne?id="+getFlickrId()+"&tags="+tags+"&georss=1";
            try {
                OutputStream stream = httpResponse.getOutputStream();
                URL proxyUrl = new URL(url);
                InputStream is = proxyUrl.openStream();
                int nextChar;
                while ((nextChar = is.read()) != -1) {
                    stream.write(nextChar);
                }
                stream.flush();
            } catch (IOException e) {
                logger.error("Error streaming proxy url", e);
            }
        }

    }


    private String getFlickrId(){
        User user= (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return user.getFlickrId();
    }

    private int getUserId(){
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
    //public boolean registerUser(@RequestParam("username") String username,@RequestParam("password") String password,@RequestParam("fullname") String fullname,@RequestParam("email") String email){
    public boolean registerUser(HttpServletRequest request){
        try {
            request.setCharacterEncoding("UTF-8");
            String username = request.getParameter("username");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String fullname = request.getParameter("fullname");
            
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
        catch(UnsupportedEncodingException e){
            logger.error(e);
            return false;
        }
    }

}
