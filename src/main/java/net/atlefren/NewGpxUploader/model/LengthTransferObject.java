package net.atlefren.NewGpxUploader.model;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/9/11
 * Time: 8:55 PM
 * To change this template use File | Settings | File Templates.
 */
public class LengthTransferObject {

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
