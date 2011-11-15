<%@ page contentType="text/html;charset=utf-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="no-NO">

<head profile="http://gmpg.org/xfn/11">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title>MineTurer</title>

	<meta name="author" content="Atle Frenvik Sveen og Martin Bekkelund" />
	<meta name="keywords" content="" />
	<meta name="description" content="" />

	<meta name="title" content="MineTurer" />
	<meta name="copyright" content="MineTurer" />
	<meta name="robots" content="all" />

	<link rel="icon" type="image/png" href="gfx/map.png">
	<link rel="stylesheet" href="css/mbstyle.css" type="text/css" media="screen"/>

	<link href="css/fancybox/jquery.fancybox-1.3.4.css" rel="stylesheet">

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.5.2.min.js"></script>
    <script type="text/javascript" src="scripts/jquery.form.js"></script>
    <script type="text/javascript" src="scripts/jquery.flot.js"></script>
    <script type="text/javascript" src="scripts/jquery.filestyle.mini.js"></script>
    <script src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
    <script type="text/javascript" src="scripts/jquery.fancybox-1.3.4.pack.js"></script>
    <script type="text/javascript" src="scripts/jquery.jcarousel.min.js"></script>
    <script type="text/javascript" src="scripts/OpenLayers-2.11/OpenLayers.js"></script>
    <script type="text/javascript" src="scripts/OpenLayers-2.11/nb.js"></script>
   <!--<script type="text/javascript" src="scripts/cloudmade.js"></script>-->
    <script type="text/javascript" src="scripts/GpxUploader.js"></script>


</head>
<body>


<div id="container">

	<div id="head">
		<h1><span class="text_green">Mine</span>Turer</h1>

		<div id="meta">
			<p>
				<a id="uploadfile" class="link" href="#">Last opp ny tur</a>
				<a id="editprofile" href="#">Rediger profil</a>
				<a id="logout" href="/GpxUpload/j_spring_security_logout">Logg ut</a>
			</p>
		</div> <!-- div#meta -->

	</div> <!-- div#head -->

<div id="wrapper">

		<div id="sidebar">

			<div id="trips">

                <h3>Nylige turer</h3>


                    <ul id="trips_list" class="jcarousel-skin-mineturer"></ul>



                <div id="pagination">
					<p>
						<a href="#" id="mycarousel-prev" class="pagination_newer">Nyere</a>
						<a href="#" id="mycarousel-next" class="pagination_older">Eldre</a>
					</p>
				</div> <!-- div#pagination -->

            </div> <!-- div#trips -->

		</div> <!-- div#sidebar -->

        <div id="main">

			<div id="map" class="olMap"></div>

            <div id="toolbar" class="hidden">
                <p>
                    <a href="#" class="tool_fullscreen">Fullskjerm</a>
                    <a href="#" class="tool_share" id="perma" target="_blank">Del</a>
                    <a href="#" class="tool_export">Eksporter</a>
                    <a href="#1" class="tool_edit" id="edit_btn">Rediger</a>
                    <a href="#!" class="tool_delete" id="delete_btn">Slett</a>

                </p>
            </div>


            <div id="tripdetail">

			</div>

			<div id="graphContainer" class="hidden">
				<div id="graphHeader"></div>
				<div id="graph"></div>
			</div>

		</div> <!-- div#main -->

	</div> <!-- div#wrapper -->

	<p class="breaker">&nbsp;</p>

</div> <!-- div#container -->

<div id="footer">
	<p>&copy; MineTurer &bull; Kontakt oss &bull; Informasjon om opphavsrett &bull; Information in English</p>
</div> <!-- div#footer -->

<!-- Husk Google Analytics her -->

<script type="text/javascript">
    var url = "<%=request.getRequestURL()%>";
    TripOrganizer.baseUrl = url.replace("WEB-INF/jsp/index.jsp","");

    setupMap(false);

    var profileEditor = new TripOrganizer.ProfileEditor();
    $("#editprofile").click(function(){
        profileEditor.editProfile();

    });
</script>
</body>
</html>
