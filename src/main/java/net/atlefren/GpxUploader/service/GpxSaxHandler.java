package net.atlefren.GpxUploader.service;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/5/11
 * Time: 10:52 PM
 */

import com.sun.org.apache.bcel.internal.generic.NEW;
import net.atlefren.GpxUploader.model.GpxFileContents;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.model.GpxRoute;
import net.atlefren.GpxUploader.model.GpxTrack;
import org.xml.sax.Attributes;
import org.xml.sax.SAXException;
import org.xml.sax.helpers.DefaultHandler;

import java.io.CharArrayWriter;
import java.util.ArrayList;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 7/30/11
 * Time: 4:24 PM
 */
public class GpxSaxHandler extends DefaultHandler {

    private GpxFileContents fileContents = new GpxFileContents();
    private GpxPoint currenttrkpt;
    private GpxPoint currentwpt;
    private GpxPoint currentrtept;

    private GpxRoute currentrte;
    private GpxTrack currentrk;

    private ArrayList<GpxPoint> currenttrkseg = new ArrayList<GpxPoint>();
    private CharArrayWriter contents = new CharArrayWriter();

    private boolean isMetdaData = true;

    private boolean isWpt = false;

    private boolean isTrk = false;
    private boolean isTrkseg = false;
    private boolean isTrkpoint = false;

    private boolean isRte = false;
    private boolean isRtept = false;


    private boolean isName = false;
    private boolean isDesc = false;



    // Override methods of the DefaultHandler class
    // to gain notification of SAX Events.
    //
    // See org.xml.sax.ContentHandler for all available events.
    //
    public void startDocument( ) throws SAXException {

    }

    public void endDocument( ) throws SAXException {

    }

    private void newTrack(){
        currentrk = new GpxTrack();
        fileContents.addTrack(currentrk);
    }
    private void newTrackSeg(){
        currenttrkseg = new ArrayList<GpxPoint>();
        currentrk.addTrackSegment(currenttrkseg);
    }

    private void newRoute(){
        currentrte = new GpxRoute();
        fileContents.addRoute(currentrte);
    }

    public void startElement( String namespaceURI,String localName,String qName,Attributes attr ) throws SAXException {
        contents.reset();

        if(localName.equals("rte")){
            isRte = true;
            newRoute();
        }
        else if(localName.equals("trk")){
            isTrk = true;
            newTrack();
        }
        else if(localName.equals("trkseg")){
            isTrkseg = true;
            newTrackSeg();
        }
        else if(localName.equals("wpt")){
            isWpt =true;
            currentwpt = createPoint(attr);
            fileContents.addWayPoint(currentwpt);
        }
        else if(localName.equals("trkpt")){
            isTrkpoint = true;
            currenttrkpt = createPoint(attr);
            currenttrkseg.add(currenttrkpt);
        }
        else if(localName.equals("rtept")){
            isRtept = true;
            currentrtept = createPoint(attr);
            currentrte.addRoutePoint(currentrtept);
        }

    }

    private GpxPoint createPoint(Attributes attr ){
        GpxPoint point = new GpxPoint();
        for ( int i = 0; i < attr.getLength(); i++ ){
                if(attr.getLocalName(i).equals("lon")){
                   point.setLon(Double.parseDouble(attr.getValue(i)));
                }
                else if(attr.getLocalName(i).equals("lat")){
                 point.setLat(Double.parseDouble(attr.getValue(i)));
                }
            }
        return point;
    }

    public void endElement( String namespaceURI,String localName,String qName ) throws SAXException {

        if(localName.equals("name") && !isRtept && !isTrkpoint  && !isWpt){
            if(isRte){
                currentrte.setName(contents.toString());
            }
            else if(isTrk){
                currentrk.setName(contents.toString());
            }
            else {
                fileContents.setName(contents.toString());
            }
        }
        else if(localName.equals("desc") && !isRtept && !isTrkpoint  && !isWpt){
            if(isRte){
                currentrte.setDesc(contents.toString());
            }
            else if(isTrk){
                currentrk.setDesc(contents.toString());
            }
            else {
                fileContents.setDescription(contents.toString());
            }
        }
        else if(localName.equals("rte")){
            isRte = false;
        }
        else if(localName.equals("trk")){
            isTrk = false;
        }
        else if(localName.equals("trkseg")){
            isTrkseg = false;
        }
        else if(localName.equals("wpt")){
            isWpt =false;
        }
        else if(localName.equals("trkpt")){
            isTrkpoint = false;
        }
        else if(localName.equals("rtept")){
            isRtept = false;
        }

        if(isTrkpoint){
            if ( localName.equals( "ele" ) ) {
                currenttrkpt.setEle(Double.valueOf(contents.toString()));
            }
            if ( localName.equals( "time" ) ) {
                currenttrkpt.setTime(contents.toString());
            }
        }
        else if(isRtept){
            if ( localName.equals( "ele" ) ) {
                currentrtept.setEle(Double.valueOf(contents.toString()));
            }
            if ( localName.equals( "time" ) ) {
                currentrtept.setTime(contents.toString());
            }
        }
        else if(isWpt){
            if ( localName.equals( "ele" ) ) {
                currentwpt.setEle(Double.valueOf(contents.toString()));
            }
            if ( localName.equals( "time" ) ) {
                currentwpt.setTime(contents.toString());
            }
        }

    }

    public void characters( char[] ch, int start, int length ) throws SAXException {
        contents.write( ch, start, length );
    }

    public GpxFileContents getData(){
        return fileContents;
    }


}
