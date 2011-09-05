package net.atlefren.GpxUploader.model;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/5/11
 * Time: 2:57 PM
 */
public class TimeHolder {

    private double totalTime;
    private double activeTime;
    private double ascTime;
    private double descTime;
    private double flatTime;

    public double getTotalTime() {
        return totalTime;
    }

    public void setTotalTime(double totalTime) {
        this.totalTime = totalTime;
    }

    public double getAscTime() {
        return ascTime;
    }

    public void setAscTime(double ascTime) {
        this.ascTime = ascTime;
    }

    public double getDescTime() {
        return descTime;
    }

    public void setDescTime(double descTime) {
        this.descTime = descTime;
    }

    public double getFlatTime() {
        return flatTime;
    }

    public void setFlatTime(double flatTime) {
        this.flatTime = flatTime;
    }

    public double getActiveTime() {
        return activeTime;
    }

    public void setActiveTime(double activeTime) {
        this.activeTime = activeTime;
    }
}
