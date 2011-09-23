<%@ page contentType="text/html;charset=utf-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" dir="ltr" lang="no-NO">
<head profile="http://gmpg.org/xfn/11">
<meta name="author" content="Atle Frenvik Sveen og Martin Bekkelund" />

    <meta name="keywords" content="" />
	<meta name="description" content="" />

	<meta name="title" content="MineTurer" />
	<meta name="copyright" content="MineTurer" />
	<meta name="robots" content="all" />

	<link rel="icon" type="image/png" href="gfx/map.png">
	<link rel="stylesheet" href="css/mbstyle.css" type="text/css" media="screen"/>

    <script type="text/javascript">
      var _gaq = _gaq || [];

      _gaq.push(['_setAccount', 'UA-25795622-1']);

      _gaq.push(['_trackPageview']);

      (function() {

        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;

        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';

        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);

      })();
    </script>

</head>

<body>

<div id="login_wrapper">

	<div id="login_header">
		<h1><span class="text_green">Mine</span>Turer</h1>
	</div>

	<div id="login_form_wrapper">

		<form name="f" action="j_spring_security_check" method="POST">
			<p><label>Brukernavn</label><input type='text' name='j_username' value='' id="login_username" /></p>
			<p><label>Passord</label><input type='password' name='j_password' id="login_password" /></p>
			<input name="submit" type="submit" value="Logg inn" id="login_send" />
		</form>
        <c:if test="${not empty param.login_error}">
            <font color="red">
                Innlogging feilet.<br/>
            </font>
        </c:if>

        <div>
            <p>Har du ikke bruker? <a href="newUser">Registrer deg</a> eller <a href="about">l&aelig;r mer</a>.</p>
        </div>

	</div> <!-- div#login_form_wrapper -->

</div> <!-- div#login_wrapper -->

</body>
</html>

