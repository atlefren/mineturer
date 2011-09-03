package net.atlefren.GpxUploader.controller;

import com.google.gson.Gson;
import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.model.GpxFileContents;
import net.atlefren.GpxUploader.model.ReturnObject;
import net.atlefren.GpxUploader.model.Trip;
import net.atlefren.GpxUploader.model.User;
import net.atlefren.GpxUploader.service.GpxReader;
import org.apache.log4j.Logger;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.xml.sax.SAXException;

import javax.annotation.Resource;
import java.io.IOException;
import java.nio.charset.Charset;

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

    private static Logger logger = Logger.getLogger(FileUploadController.class);

    @RequestMapping(value = "uploadGpx", method = RequestMethod.POST)
    @ResponseBody
    public String handleFormUpload(@RequestParam("file") MultipartFile file,@RequestParam("desc")String desc,@RequestParam("name")String name ) {
        if (!file.isEmpty()) {
            try{
                GpxReader reader = new GpxReader(file.getInputStream());
                GpxFileContents contents= reader.readAndCreateGpx();
                if(name!=null && !name.equals("")){
                    contents.setName(name);
                }
                if(desc!=null && !desc.equals("")){
                    contents.setDescription(desc);
                }
                int id = tripDao.saveTripToDb(contents,getUser());
                //Trip obj = tripDao.getTripGeom(getUser(), "900913", id);
                ReturnObject ro = new ReturnObject();
                ro.setId(id);
                ro.setStatus("OK");
                Gson gson = new Gson();
                return "<textarea>"+ gson.toJson(ro) +"</textarea>";
            }
            catch (IOException e){
                logger.error("IOe = " + e);
                ReturnObject ro = new ReturnObject();
                ro.setStatus("FAIL");
                ro.setErrMsg("Noe gikk galt ved lesing av GPX-fila. Lastet du opp en gyldig GPX-fil?");
                Gson gson = new Gson();
                return "<textarea>"+gson.toJson(ro)+"</textarea>";
            }
            catch (SAXException e){
                logger.error("SAXe = " + e);
                ReturnObject ro = new ReturnObject();
                ro.setStatus("FAIL");
                ro.setErrMsg("Noe gikk galt ved lesing av GPX-fila. Vennligst ta kontakt!");
                Gson gson = new Gson();
                System.out.println("IOe = " + e);
                return "<textarea>"+gson.toJson(ro)+"</textarea>";
            }
            catch (Exception e){
                logger.error("General error = " + e);
                ReturnObject ro = new ReturnObject();
                ro.setStatus("FAIL");
                ro.setErrMsg("Noe gikk totalt galt ved lesing av GPX-fila. Vennligst ta kontakt!");
                Gson gson = new Gson();
                System.out.println("IOe = " + e);
                return "<textarea>"+gson.toJson(ro)+"</textarea>";
            }
        } else {
                ReturnObject ro = new ReturnObject();
                ro.setStatus("FAIL");
                ro.setErrMsg("Ingen fil lastet opp! Velg en fil og pr&oslash;v p&aring; nytt..");
                Gson gson = new Gson();
                return "<textarea>"+gson.toJson(ro)+"</textarea>";
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
}

