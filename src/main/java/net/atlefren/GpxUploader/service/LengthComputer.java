package net.atlefren.GpxUploader.service;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import net.atlefren.GpxUploader.dao.TripDao;
import net.atlefren.GpxUploader.util.GISUtils;
import org.apache.log4j.Logger;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.geotools.referencing.GeodeticCalculator;
import org.opengis.referencing.FactoryException;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;
import org.opengis.referencing.operation.TransformException;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/24/11
 * Time: 7:28 PM
 */
public class LengthComputer {

    private static Logger logger = Logger.getLogger(LengthComputer.class);

    public LengthComputer() {
    }


    public double generateLength(List<String> trackWkts){

        WKTReader wktReader = new WKTReader();

        Coordinate last = null;
        double totalVincDist = 0.0;
        try{
            for(String trackwkt:trackWkts){
                MathTransform transformer = generateTransform("900913","4326");
                MultiLineString track = (MultiLineString)wktReader.read(trackwkt);
                track = (MultiLineString)JTS.transform(track, transformer);
                Coordinate[] coords = track.getCoordinates();
                for(Coordinate coord:coords){
                    if(last != null){
                        totalVincDist += GISUtils.distVincentY(coord.y,coord.x,last.y,last.x);
                    }
                    last = coord;
                }
            }
        }
        catch(ParseException e){
            logger.warn("could not read wkt ", e);
        }
        catch (FactoryException e2){
            logger.warn("transform factory error ", e2);
        }
        catch (TransformException e3){
            logger.warn("transform error ", e3);
        }

        DecimalFormat twoDForm = new DecimalFormat("#.##");
        return Double.valueOf(twoDForm.format(totalVincDist));
    }


    private MathTransform generateTransform(String source, String target   ) throws FactoryException {
        CoordinateReferenceSystem sourceCRS = CRS.decode("EPSG:" + source);
        CoordinateReferenceSystem targetCRS = CRS.decode("EPSG:" + target);
        return CRS.findMathTransform(sourceCRS, targetCRS, true);
    }
/*

    private double toRad(double deg){
        return deg*(Math.PI/180);
    }

    private double distVincentY(Coordinate p1, Coordinate p2){
        //Shamelessly lifted from OpenLayers OpenLayers.Util.distVincenty
        //assumes WGS84 lon/lat
        double a = 6378137;
        double b= 6356752.3142;
        double f= 1/298.257223563;

        double lon1 =p1.y;
        double lon2 =p2.y;

        double lat1 = p1.x;
        double lat2 = p2.x;

        double L = toRad(lon2-lon1);

        double U1 = Math.atan((1-f) * Math.tan(toRad(lat1)));

        double U2 = Math.atan((1-f) * Math.tan(toRad(lat2)));

        double sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
        double sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);
        double lambda = L;
        double lambdaP = 2*Math.PI;
        int iterLimit = 20;

        double cosSqAlpha = 0;
        double sinSigma =0;
        double cos2SigmaM = 0;
        double cosSigma = 0;
        double sigma=0;
        while (Math.abs(lambda-lambdaP) > 1e-12 && --iterLimit>0) {
            double sinLambda = Math.sin(lambda), cosLambda = Math.cos(lambda);
            sinSigma = Math.sqrt((cosU2*sinLambda) * (cosU2*sinLambda) +
                    (cosU1*sinU2-sinU1*cosU2*cosLambda) * (cosU1*sinU2-sinU1*cosU2*cosLambda));
            if (sinSigma==0) {
                return 0;  // co-incident points
            }
            cosSigma = sinU1*sinU2 + cosU1*cosU2*cosLambda;
            sigma = Math.atan2(sinSigma, cosSigma);
            double alpha = Math.asin(cosU1 * cosU2 * sinLambda / sinSigma);
            cosSqAlpha = Math.cos(alpha) * Math.cos(alpha);
            cos2SigmaM = cosSigma - 2*sinU1*sinU2/cosSqAlpha;
            double C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
            lambdaP = lambda;
            lambda = L + (1-C) * f * Math.sin(alpha) *
                    (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
        }
        if (iterLimit==0) {
            return -1.0;
        }
        double uSq = cosSqAlpha * (a*a - b*b) / (b*b);
        double A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
        double B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
        double deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
                B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
        return b*A*(sigma-deltaSigma);
    }
    */
}
