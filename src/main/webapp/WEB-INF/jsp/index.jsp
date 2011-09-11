<%@ page contentType="text/html;charset=utf-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="css/style.css"/>
    <link rel="stylesheet" href="css/fancybox/jquery.fancybox-1.3.4.css"/>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.5.2.min.js"></script>
    <script type="text/javascript" src="scripts/jquery.form.js"></script>
    <script type="text/javascript" src="scripts/jquery.flot.js"></script>
    <script src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script type="text/javascript" src="scripts/jquery.fancybox-1.3.4.pack.js"></script>
    <script type="text/javascript" src="scripts/OpenLayers-2.11-rc1/OpenLayers.js"></script>
    <script type="text/javascript" src="scripts/GpxUploader.js"></script>
    <script type="text/javascript" src="scripts/spin.js"></script>

    <title>MineTurer</title>
</head>
<body>
<div id="head">
    <h1>MineTurer Beta</h1>
    <a href="<spring:url value="/j_spring_security_logout" htmlEscape="true" />">Logg ut</a>
</div>
<div id="wrapper">
    <div id="map"></div>
    <div id="sidebar">
        <div id="tripdetail"></div>
        <div id="triplist">
            <div class="sidebarhead"><h3>Mine Turer</h3></div>
            <div id="trips"></div>
            <div id="upload"></div>
        </div>
        <div id="eleContainer">
            <div id="graphHeader"></div>
            <!--<div class="yAxisLabel"><p class="rot" id="ylabel"></p></div>-->
            <div id="ele">

            </div>
            <!--<div class="xAxisLabel" id="xlabel"></div>-->
        </div>
    </div>
</div>

<script type="text/javascript">

    setupMap(false);
/*
    $(document).ajaxError(function(ev,xhr,o,err) {
        alert(err);
        if (window.console && window.console.log) console.log(err);
    });
    */
</script>
</body>
</html>