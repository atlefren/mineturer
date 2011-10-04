<%@ page contentType="text/html;charset=utf-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="no-NO">

<head profile="http://gmpg.org/xfn/11">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title>MineTurer - Om</title>

	<meta name="author" content="Atle Frenvik Sveen og Martin Bekkelund" />
	<meta name="keywords" content="" />
	<meta name="description" content="" />

	<meta name="title" content="MineTurer" />
	<meta name="copyright" content="MineTurer" />
	<meta name="robots" content="all" />

	<link rel="icon" type="image/png" href="gfx/map.png">
	<link rel="stylesheet" href="css/mbstyle.css" type="text/css" media="screen"/>
</head>
<body>


<div id="container">

    <div id="head">
        <h1><span class="text_green">Mine</span>Turer</h1>
    </div> <!-- div#head -->

    <div id="wrapper">

        <div id="main_full">

            <h1>Om MineTurer</h1>

            <p>MineTurer er en webtjeneste for å holde rede på GPX-filer (også kjent som GPS-spor/GPS-tracks),
                altså data fra GPS-loggere. Dataene lastes opp og vises på kart (Statens Kartverk, Google Maps eller OpenStreetMap).
                For hver tur vises statistikk og grafer. Alle dataene lagres i en romlig database. Tjenesten er i kraftig beta,
                og utvikles på frivillig basis. Dermed går utviklingen i rykk og napp.
                Ta kontakt på atle dått sveen ætt gmail dått com for spørsmål eller feilmeldinger.</p>


            <p>Idè og utvikling: <a href="http://www.atlefren.net">Atle Frenvik Sveen</a></p>
            <p>Grafisk design: <a href="http://www.bekkelund.net">Martin Bekkelund</a></p>

            <h3>Lisens</h3>
            <p> Kildekoden er lisensiert under <a href="http://www.opensource.org/licenses/MIT">MIT-lisensen</a>, og du finner den på <a target="_blank" href="https://bitbucket.org/atlefren/gpsorganizer">BitBucket</a>.</p>

            <h3>Feil og ønsker</h3>
            <p>Bugrapporter og forbedringsforslag kan medles inn via <a href="https://bitbucket.org/atlefren/gpsorganizer/issues?status=new&status=open">issue-trackeren i BitBucket</a>.</p>

            <h3>Bruker kode fra</h3>
            <ul>
                <li><a href="http://www.openlayers.org">OpenLayers</a> (2-clause BSD)</li>
                <li><a href="http://jquery.com/">jQuery</a> (MIT/GPL)</li>
                <li><a href="http://code.google.com/p/flot/">Flot</a> (MIT)</li>
                <li><a href="http://fancybox.net/">Fancybox</a> (MIT/GPL)</li>
                <li><a href="http://jquery.malsup.com/form/">jQuery Form</a> (MIT/GPL)</li>
                <li><a href="http://sorgalla.com/jcarousel/">jCarousel</a> (MIT/GPL)</li>
                <li><a href="http://www.vividsolutions.com/jts/JTSHome.htm">JTS Topology Suite</a> (LGPL)</li>
                <li><a href="http://www.springsource.org/">Spring</a> (Apache License 2.0)</li>
            </ul>

            <h3>Kart fra</h3>
            <ul>
                <li><a href="http://www.statkart.no/?module=Articles;action=Article.publicShow;ID=14089">Statens Kartverk</a> (Fritt til ikke-kommersiell bruk)</li>
                <li><a href="http://www.openstreetmap.org/">OpenStreetMaps</a> (Creative Commons Attribution-ShareAlike 2.0)</li>
                <li><a href="http://code.google.com/apis/maps/index.html">Google Maps</a> (Fritt til ikke-kommersiell bruk)</li>
            </ul>

            <h3>Bruker ikoner fra</h3>
            <ul>
                <li><a href="http://www.famfamfam.com/lab/icons/silk/">FamFamFam</a>  (Creative Commons Attribution 2.5)</li>
                <li><a href="http://mapicons.nicolasmollet.com/">Map Icons Collection</a> (Creative Commons Attribution-Share Alike 3.0)</li>
                <li><a href="http://www.iconfinder.com/search/?q=iconset%3Aspirit20">Spirit20</a> (Fri bruk)</li>
                <li><a href="http://www.iconfinder.com/search/?q=iconset%3Atoken">Token</a>(Creative Commons (Attribution-Noncommercial-No Derivative Works 3.0 Unported))</li>
                <li><a href="https://github.com/developmentseed/openlayers_themes" >Developmentseed OpenLayers Themes</a> (BSD/GPL)</li>
            </ul>


            <h3>Bruker teknologier fra</h3>
            <ul>
                <li>Kjører på en Amazon EC2 instans</li>
                <li>Kjører på Ubuntu Linux</li>
                <li>Wed med: Tomcat, Apache</li>
                <li>Database: Postgresql med PostGIS</li>
                <li>Domene via subsys.no</li>
            </ul>
            <p>..pluss noen til..</p>

        </div> <!-- div#main -->

    </div> <!-- div#wrapper -->

    <p class="breaker">&nbsp;</p>

</div> <!-- div#container -->

<div id="footer">
    <p>&copy; MineTurer &bull; Kontakt oss &bull; Informasjon om opphavsrett &bull; Information in English</p>
</div> <!-- div#footer -->

<!-- Husk Google Analytics her -->

</body>
</html>





