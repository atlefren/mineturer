package net.atlefren.GpxUploader.controller;

import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import com.vividsolutions.jts.io.WKTWriter;
import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.model.Trip;
import net.atlefren.GpxUploader.service.HeightProfileGenerator;
import org.apache.log4j.Logger;
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

    private static Logger logger = Logger.getLogger(TripDao.class);


    @RequestMapping(value = "/getTrips", method = RequestMethod.GET)
    @ResponseBody
    public List<Trip> getTrips() {
        return  tripDao.getTrips("test","900913");
    }

    @RequestMapping(value = "/getTripGeom", method = RequestMethod.GET)
    @ResponseBody
    public Trip getTripGeom(@RequestParam("id") int id) {
        return tripDao.getTripGeom("test", "900913", id);
    }

    @RequestMapping(value = "/getTripHeights", method = RequestMethod.GET)
    @ResponseBody
    public List<List<Double>> getTripHeights(@RequestParam("id") int id) {
        HeightProfileGenerator profileGenerator = new HeightProfileGenerator();
        return profileGenerator.generateFlotSeries(tripDao.getTracksForTrip("900913",id));
    }

}
