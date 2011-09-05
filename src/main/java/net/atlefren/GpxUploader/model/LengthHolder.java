package net.atlefren.GpxUploader.model;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/5/11
 * Time: 2:09 PM
 */
public class LengthHolder {

    private double length2d;
    private double length3d;
    private double lengthAsc;
    private double lengthDesc;
    private double lengthFlat;

    public double getLength2d() {
        return length2d;
    }

    public void setLength2d(double length2d) {
        this.length2d = length2d;
    }

    public double getLength3d() {
        return length3d;
    }

    public void setLength3d(double length3d) {
        this.length3d = length3d;
    }

    public double getLengthAsc() {
        return lengthAsc;
    }

    public void setLengthAsc(double lengthAsc) {
        this.lengthAsc = lengthAsc;
    }

    public double getLengthDesc() {
        return lengthDesc;
    }

    public void setLengthDesc(double lengthDesc) {
        this.lengthDesc = lengthDesc;
    }

    public double getLengthFlat() {
        return lengthFlat;
    }

    public void setLengthFlat(double lengthFlat) {
        this.lengthFlat = lengthFlat;
    }
}
