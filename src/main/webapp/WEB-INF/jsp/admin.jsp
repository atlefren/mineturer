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

            <h1>MineTurer Admin</h1>

            <h2>Brukere</h2>
            <table width="100%">
                <tr>
                    <th>Brukernavn</th>
                    <th>Fullt navn</th>
                    <th>Epost</th>
                    <th>Flickr-id</th>
                    <th>Antall turer</th>
                </tr>

                <c:forEach items="${users}" var="user">
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.fullname}</td>
                        <td>${user.email}</td>
                        <td>${user.flickrId}</td>
                        <td>${user.numTrips}</td>
                    </tr>

                </c:forEach>
            </table>
            <h3>Epostliste</h3>
            <p>
                <c:forEach items="${users}" var="user">
                    ${user.email}, 
                </c:forEach>
            </p>

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





