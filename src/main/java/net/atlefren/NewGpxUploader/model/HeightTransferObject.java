package net.atlefren.NewGpxUploader.model;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/9/11
 * Time: 8:56 PM
 * To change this template use File | Settings | File Templates.
 */
public class HeightTransferObject {
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
