<%@ page contentType="text/html;charset=utf-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<%--
  Created by IntelliJ IDEA.
  User: atlefren
--%>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="css/style.css" type="text/css" media="screen"/>
     <title>MineTurer - Innlogging</title>
</head>
<body>

<h1>MineTurer Beta</h1>

<c:if test="${not empty param.login_error}">
  <font color="red">
    Innlogging feilet.<br/>
  </font>
</c:if>

    <form name="f" action="j_spring_security_check" method="POST">
      <table>
        <tr>
            <td>Bruker:</td>
            <td><input type='text' name='j_username' value='<c:if test="${not empty param.login_error}"><c:out value="${SPRING_SECURITY_LAST_USERNAME}"/></c:if>'/></td>
        </tr>
        <tr>
            <td>Passord:</td>
            <td><input type='password' name='j_password'></td>
        </tr>
        <tr><td colspan='2'><input name="submit" type="submit" value="Logg inn"></td></tr>
      </table>
    </form>

<div style="width:700px;">
    <p>MineTurer er en webtjeneste for å holde rede på GPX-filer (også kjent som GPS-spor/GPS-tracks), altså data fra GPS-loggere. Dataene lastes opp og vises på kart (Statens Kartverk, Google Maps eller OpenStreetMap). For hver tur vises statistikk og grafer. Alle dataene lagres i en romlig database. Tjenesten er i kraftig beta, og utvikles av Atle F. Sveen på frivillig basis. Kildekoden er lisensiert under BSD-lisensen, og du finner den på <a href="https://bitbucket.org/atlefren/gpsorganizer" target="_blank">BitBucket</a>. Ta kontakt på atle dått sveen ætt gmail dått com for spørsmål eller feilmeldinger. OBS: Nedetid, ustabilitet og feil må forventes så lenge vi er i Beta og kjører på denne serveren.</a></p>
</div>

<div>
    <p>Ny bruker? Registrer en ny bruker <a href="newUser">her</a></p>
</div>

</body>
</html>





