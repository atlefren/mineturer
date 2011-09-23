<%@ page contentType="text/html;charset=utf-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head profile="http://gmpg.org/xfn/11">

	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

	<title>MineTurer - Registrer ny bruker</title>

	<meta name="author" content="Atle Frenvik Sveen og Martin Bekkelund" />
	<meta name="keywords" content="" />
	<meta name="description" content="" />

	<meta name="title" content="MineTurer" />
	<meta name="copyright" content="MineTurer" />
	<meta name="robots" content="all" />

	<link rel="icon" type="image/png" href="gfx/map.png">
	<link rel="stylesheet" href="css/mbstyle.css" type="text/css" media="screen"/>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.5.2.min.js"></script>
    <script type="text/javascript" src="scripts/jquery.form.js"></script>
</head>


<body>
<div id="login_wrapper">

	<div id="login_header">
		<h1><span class="text_green">Mine</span>Turer</h1>
	</div>

	<div id="login_form_wrapper">

		<form id="registerUserForm" action="createMyUser" method="POST" accept-charset="UTF-8">

			<p><label>&Oslash;nsket brukernavn</label>
			<input type="text" name="username" id="username" /> <span class="text_red">*</span></p>

			<p><label>&Oslash;nsket passord</label>
			<input type="password" name="password" id="password" /> <span class="text_red">*</span></p>

			<p><label>Gjenta passord</label>
			<input type="password" name="password2" id="password2" /> <span class="text_red">*</span></p>

			<p><label>Fullt navn</label>
			<input type="text" name="fullname" id="fullname" /> <span class="text_red">*</span></p>

			<p><label>E-post</label>
			<input type="text" name="email" id="email" /> <span class="text_red">*</span></p>

			<p><label>Flickr ID</label>
			<input type="text" name="flickrid" id="flickrid" /> <a target="_blank" href="http://support.statsmix.com/kb/faq/how-do-i-find-my-flickr-id" style="margin-top: 3px;"><img src="gfx/question.png" alt="Hva er dette?" style="border:0"/></a></p> <!-- image used with permission: http://www.iconfinder.com/icondetails/53604/20/02_alt_question_system_icon -->

			<input type="submit" id="register" value="Opprett bruker" />

		</form>

		<p><span class="text_red">*</span>=Påkrevd felt.</p>
		<p>OBS: Det finnes (enda) ikke noen metode for å endre passord/glemt passord (og passord lagres kryptert), så pass på å huske passordet du velger (du får det heller ikke på mail).</p>

		<div class="error hidden" id="error">
			<p>Passordet må ha minst 8 tegn</p>
			<p>Du må fylle inn e-postadresse</p>
		</div>

		<div class="hidden" id="info">test</div>

	</div> <!-- div#login_form_wrapper -->

</div> <!-- div#login_wrapper -->
    <script type="text/javascript">


        $("#registerUserForm").ajaxForm({
            beforeSubmit: validate,
            success: function(ok) {
                if(ok){
                        $("#error").addClass("hidden");
                        $("#info").removeClass("hidden");
                        $("#info").html("Brukeren ble opprettet, gå til <a href='login.jsp'>Innloggingssiden</a> for å logge inn.");
                    }
                    else {
                        $("#error").removeClass("hidden");
                        $("#error").text("Brukernavnet er opptatt, velg ett nytt!");
                    }
            }

        });



    function validate(){
        var username = $("#username").val();
        var pwd1 = $("#password").val();
        var pwd2 = $("#password2").val();
        var fullname = $("#fullname").val();
        var email = $("#email").val();
        var flickerid = $("#flickrid").val();


        var params= {
            username: username,
            password: pwd1,
            fullname: fullname,
            email: email,
            flickerid: flickerid
        };
        var errors = [];

        var checkUsername = false;

        if(pwd1==""){
            errors.push("Du må velge et passord!")
        }
        else if(pwd1!=pwd2){
            errors.push("Du må skrive inn samme passord to ganger!")
        }
        else{
            if(pwd1.length <8){
                errors.push("Passordet må ha minst 8 tegn");
            }
        }
        if(username==""){
            errors.push("Du må velge et brukernavn!");

        }
        else {
            checkUsername = true;
        }
        if(email==""){
           errors.push("Du må fylle inn epost-adresse!");

        }
        if(errors.length > 0){
            showErrors(errors);
            return false;
        }
        else {
            return true;
        }
    }

    function showErrors(errors){
        $("#error").html("");
        if(errors.length>0){
            $("#error").removeClass("hidden");
            for(var i=0;i<errors.length;i++){
                $("#error").append("<p>"+errors[i]+"</p>")
            }
        }
    }
</script>
</body>
</html>