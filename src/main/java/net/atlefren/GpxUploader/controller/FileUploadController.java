package net.atlefren.GpxUploader.controller;

import com.google.gson.Gson;
import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.model.Trip;
import net.atlefren.GpxUploader.service.GpxReader;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import javax.annotation.Resource;
import java.io.IOException;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/5/11
 * Time: 10:35 PM
 */
@Controller
public class FileUploadController {

    @Resource
    private TripDao tripDao;

    @RequestMapping(value = "/uploadGpx", method = RequestMethod.POST)
    @ResponseBody
    public String handleFormUpload(@RequestParam("file") MultipartFile file,@RequestParam("desc")String desc,@RequestParam("name")String name ) {

        if (!file.isEmpty()) {
            try{
                String ct = file.getContentType();
                GpxReader reader = new GpxReader(file.getInputStream());
                reader.setTripDao(tripDao);
                Trip obj = reader.readGpx(name,desc);
                Gson gson = new Gson();
                return "<textarea>"+ gson.toJson(obj) +"</textarea>";
            }
            catch (IOException e){
                System.out.println("IOe = " + e);
                return "<textarea>{\"error\":\""+e.getMessage()+"\"}</textarea>";
            }
            catch (SAXException e){
                System.out.println("SAXe = " + e);
                return "<textarea>{\"error\":\""+e.getMessage()+"\"}</textarea>";
            }
        } else {
            return "<textarea>{\"error\":\"Ingen fil\"}</textarea>";
        }
    }
}

