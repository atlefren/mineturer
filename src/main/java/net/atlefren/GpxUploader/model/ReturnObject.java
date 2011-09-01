package net.atlefren.GpxUploader.model;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 9/1/11
 * Time: 9:24 AM
 */
public class ReturnObject {

    private int id;
    private String status;
    private String errMsg;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getErrMsg() {
        return errMsg;
    }

    public void setErrMsg(String errMsg) {
        this.errMsg = errMsg;
    }
}
