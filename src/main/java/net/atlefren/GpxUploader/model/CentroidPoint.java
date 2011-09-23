package net.atlefren.GpxUploader.model;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/25/11
 * Time: 8:27 PM
 */
public class CentroidPoint {
    private String geom;
    private int id;
    private String title;
    private String type;
    private String date;

    public String getGeom() {
        return geom;
    }

    public void setGeom(String geom) {
        this.geom = geom;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = formatDate(date);
    }

    private String formatDate(Date date){
        Locale norge = new java.util.Locale( "no" );
        return new SimpleDateFormat("d. MMMM yyyy",norge).format(date);
    }
}
