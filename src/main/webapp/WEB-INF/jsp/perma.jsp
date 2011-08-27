<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <style type="text/css">
        #layers p {
            color: blue;
            cursor: pointer;
            text-decoration: underline;
            margin-bottom: 0;
            margin-top: 0;
        }

        .subDiv {
            color: black;
            cursor: auto;
            margin-top: 0;
            margin-left:10px;
            text-decoration: none;

        }
    </style>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="css/style.css"/>

    <title>Gps Trip Organizer</title>

    <script src="http://maps.google.com/maps/api/js?sensor=false"></script>
    <script type="text/javascript" src="scripts/OpenLayers-2.11-rc1/OpenLayers.js"></script>
    <script type="text/javascript" src="scripts/GpxUploader.js"></script>
</head>
<body>
<div id="head">
    <h1>GPS Trip Organizer v.0.0.1</h1>
</div>
<div id="wrapper">
 <div id="map"></div>

</div>
<script type="text/javascript">



    var wkt = ${wkt};

    setupMap(true,${lon},${lat},${zoom},"${layer}",wkt);

</script>
</body>
</html>