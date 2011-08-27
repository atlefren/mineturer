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
     <title>Gps Trip Organizer</title>
</head>
<body>


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




</body>
</html>





