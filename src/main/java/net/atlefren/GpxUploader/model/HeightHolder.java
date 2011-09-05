package net.atlefren.GpxUploader.model;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/5/11
 * Time: 3:17 PM
 */
public class HeightHolder {

    private double startHeight;
    private double stopHeight;
    private double maxHeight;
    private double minHeight;
    private double totalAsc;
    private double totalDesc;

    public double getStartHeight() {
        return startHeight;
    }

    public void setStartHeight(double startHeight) {
        this.startHeight = startHeight;
    }

    public double getStopHeight() {
        return stopHeight;
    }

    public void setStopHeight(double stopHeight) {
        this.stopHeight = stopHeight;
    }

    public double getMaxHeight() {
        return maxHeight;
    }

    public void setMaxHeight(double maxHeight) {
        this.maxHeight = maxHeight;
    }

    public double getMinHeight() {
        return minHeight;
    }

    public void setMinHeight(double minHeight) {
        this.minHeight = minHeight;
    }

    public double getTotalAsc() {
        return totalAsc;
    }

    public void setTotalAsc(double totalAsc) {
        this.totalAsc = totalAsc;
    }

    public double getTotalDesc() {
        return totalDesc;
    }

    public void setTotalDesc(double totalDesc) {
        this.totalDesc = totalDesc;
    }
}
