import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.MultiLineString;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.WKBReader;
import com.vividsolutions.jts.io.WKTReader;
import com.vividsolutions.jts.io.WKTWriter;
import junit.framework.TestCase;
import net.atlefren.GpxUploader.model.GpxPoint;
import net.atlefren.GpxUploader.service.GpxReader;
import org.apache.commons.codec.digest.DigestUtils;
import org.geotools.data.*;
import org.geotools.data.postgis.PostgisNGDataStoreFactory;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.data.simple.SimpleFeatureSource;
import org.geotools.data.simple.SimpleFeatureStore;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.simple.SimpleFeatureTypeBuilder;
import org.geotools.referencing.CRS;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.geometry.DirectPosition;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.GeometryFactory;
import org.opengis.referencing.crs.CoordinateReferenceSystem;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Created by IntelliJ IDEA.
 * User: atle
 * Date: 8/15/11
 * Time: 5:34 PM
 */
public class MyTest extends TestCase {

    public void testGetData() throws Exception {
        int year = 2003;
    int month = 12;
    int day = 12;

    String date = year + "/" + month + "/" + day;
    java.util.Date utilDate = null;

        try {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy/MM/dd");
            utilDate = formatter.parse(date);
            System.out.println(formatDate(utilDate));
            System.out.println("utilDate:" + utilDate);
        } catch (ParseException e) {
            System.out.println(e.toString());
            e.printStackTrace();
        }

    }

    private String formatDate(Date date){
        Locale norge = new java.util.Locale( "no" );


        return new SimpleDateFormat("d. MMMM yyyy",norge).format(date);
    }
}

