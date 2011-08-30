package net.atlefren.GpxUploader.service;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/5/11
 * Time: 10:51 PM
 */

import com.google.gson.Gson;
import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.model.GpxFileContents;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.GpxTrack;
import net.atlefren.GpxUploader.model.Trip;
import org.apache.commons.io.output.ThresholdingOutputStream;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;
import org.xml.sax.XMLReader;
import org.xml.sax.helpers.XMLReaderFactory;

import javax.annotation.Resource;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;


/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 7/30/11
 * Time: 4:09 PM
 */
@Component
public class GpxReader {

    public InputStream gpxInputStream;
    private static Logger logger = Logger.getLogger(GpxReader.class);

    public GpxReader(InputStream gpxInputStream) {
        this.gpxInputStream = gpxInputStream;
    }

    public GpxReader() {
    }

    public GpxFileContents readAndCreateGpx() throws SAXException, IOException {
        XMLReader xr = XMLReaderFactory.createXMLReader();
        GpxSaxHandler gpxhandler = new GpxSaxHandler();
        xr.setContentHandler(gpxhandler);
        xr.parse(new InputSource(gpxInputStream));
        return gpxhandler.getData();
    }


    public GpxFileContents readGpxFile(String filename) throws SAXException, IOException {

        XMLReader xr = XMLReaderFactory.createXMLReader();
        GpxSaxHandler gpxhandler = new GpxSaxHandler();

        // Set the ContentHandler...
        xr.setContentHandler(gpxhandler);
        xr.parse( new InputSource(new FileReader(filename)) );
        return gpxhandler.getData();
    }

}

