package net.atlefren.GpxUploader.controller;

import com.google.gson.Gson;
import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.model.Trip;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Controller
public class MasterController {

    @Resource
    private TripDao tripDao;

    @RequestMapping("/trips")
    public ModelAndView mapRequest() {
        return new ModelAndView("index");
    }

    @RequestMapping("/newUser")
    public ModelAndView newUser() {
        return new ModelAndView("newuser");
    }

    @RequestMapping("/about")
    public ModelAndView about() {
        return new ModelAndView("about");
    }

    @RequestMapping("/showTrip")
    public ModelAndView permaRequest(HttpServletRequest request) {
        String lon = request.getParameter("lon");
        String lat = request.getParameter("lat");
        String zoom = request.getParameter("zoom");
        String layer = request.getParameter("layerId");
        String tripId = request.getParameter("trip");
        Map<String, String> params = new HashMap<String, String>();
        params.put("lon",lon);
        params.put("lat",lat);
        params.put("zoom",zoom);
        params.put("layer",layer);
        List<String> trip = tripDao.getTracksForTrip("900913", Integer.parseInt(tripId));
        Gson gson = new Gson();
        params.put("wkt",gson.toJson(trip));
        Trip info = tripDao.getSimpleTripInfo(Integer.parseInt(tripId)).get(0);
        params.put("title",info.getName());
        params.put("user",info.getUser());

        return new ModelAndView("perma",params);
    }

}
