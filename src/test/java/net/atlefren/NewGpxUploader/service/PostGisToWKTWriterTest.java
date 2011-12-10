package net.atlefren.NewGpxUploader.service;

import junit.framework.TestCase;
import org.junit.Test;
import org.postgis.MultiLineString;

/**
 * Created by IntelliJ IDEA.
 * User: atlefren
 * Date: 12/9/11
 * Time: 7:58 PM
 * To change this template use File | Settings | File Templates.
 */
public class PostGisToWKTWriterTest extends TestCase {

    @Test
    public void testParseMultiLineStringWithOneLine() throws Exception {

        PostGisToWKTWriter writer = new PostGisToWKTWriter();
        String wkt = "MULTILINESTRING ((1045385.3080329578 9026504.894909628, 1045387.9797007368 9026502.467985189, 1045434.177289416 9026491.061451348))";
        MultiLineString mls = new MultiLineString(wkt);
        mls.setSrid(900913);
        assertEquals(wkt,writer.parseMultiLineString(mls,900913));
    }

    @Test
    public void testParseMultiLineStringWithTwoLines() throws Exception {

        PostGisToWKTWriter writer = new PostGisToWKTWriter();
        String wkt = "MULTILINESTRING ((1045385.3080329578 9026504.894909628, 1045387.9797007368 9026502.467985189, 1045434.177289416 9026491.061451348), (1035584.740063518 9037293.642968006, 1035583.7381881009 9037296.073544607, 1035582.5136737023 9037298.99023761))";
        MultiLineString mls = new MultiLineString(wkt);
        mls.setSrid(900913);
        assertEquals(wkt,writer.parseMultiLineString(mls,900913));
    }

}
