package net.atlefren.GpxUploader.util;

import com.vividsolutions.jts.geom.Coordinate;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/25/11
 * Time: 7:24 PM
 */
public class GISUtils {


    public static double distVincentY(double lon1, double lat1, double lon2, double lat2){
        //Shamelessly lifted from OpenLayers OpenLayers.Util.distVincenty
        //assumes WGS84 lon/lat
        double a = 6378137;
        double b= 6356752.3142;
        double f= 1/298.257223563;

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


    public static double toRad(double deg){
        return deg*(Math.PI/180);
    }
}
