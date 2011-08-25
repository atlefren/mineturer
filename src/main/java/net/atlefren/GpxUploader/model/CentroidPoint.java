package net.atlefren.GpxUploader.model;

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
}
