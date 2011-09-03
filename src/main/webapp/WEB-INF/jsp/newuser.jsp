<%@ page contentType="text/html;charset=utf-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <link rel="stylesheet" href="css/style.css"/>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.5.2.min.js"></script>
    <title>Ny bruker - MineTurer</title>
</head>
<body>

    <h1>Registrer ny bruker</h1>

    <table>
        <tr>
            <td>Brukernavn:</td>
            <td><input id="username" type="text" name="username" />*</td>
        </tr>
        <tr>
            <td>Passord:</td>
            <td>
                <input id="password" type="password" name="password" />*</td>
        </tr>
        <tr>
            <td>Gjenta passord:</td>
            <td> <input id="password2" type="password" name="password2" />*</td>
        </tr>
        <tr>
            <td>Fullt navn:</td>
            <td> <input id="fullname" type="text" name="fullname" /></td>
        </tr>
        <tr>
            <td>E-Post:</td>
            <td><input id="email" type="text" name="email" />*</td>
        </tr>
        <tr>
            <td colspan="2"><input type="submit" value="Registrer" id="register"/></td>
        </tr>
    </table>
    <p>*=Påkrevd felt.</p>
    <p>OBS: Det finnes (enda) ikke noen metode for å endre passord/glemt passord (og passord lagres kryptert), så pass på å huske passordet du velger (du får det heller ikke på mail).</p>

    <div id="error" class="error hidden"></div>
    <div id="info" class="hidden"></div>
    <script type="text/javascript">
    $("#register").click(function(){
        var username = $("#username").val();
        var pwd1 = $("#password").val();
        var pwd2 = $("#password2").val();
        var fullname = $("#fullname").val();
        var email = $("#email").val();


        var params= {
            username: username,
            password: pwd1,
            fullname: fullname,
            email: email
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

        if(checkUsername){
            $.ajax({
                type: "GET",
                url: "checkUsername",
                data: "username="+username,
                success: function(exists){
                    if(exists){
                        errors.push("Brukernavnet er opptatt, velg et annet");
                    }
                    registerUser(errors,params);
                }
            });
        }
        else {
            registerUser(errors,params);
        }
    });


    function registerUser(errors,params){
        $("#error").html("");
        if(errors.length>0){
            $("#error").removeClass("hidden");
            for(var i=0;i<errors.length;i++){
                $("#error").append("<p>"+errors[i]+"</p>")
            }
        }
        else {
            $("#error").addClass("hidden");
            $.getJSON(
                "registerUser",
                params,
                function(created) {
                    if(created){
                        $("#info").removeClass("hidden");
                        $("#info").html("Brukeren ble opprettet, gå til <a href='login.jsp'>Innloggingssiden</a> for å logge inn.");
                       // window.location.href="login.jsp";
                    }
                    else {
                        $("#error").removeClass("hidden");
                        $("#error").text("Det oppsto en feil ved registrering av bruker..");
                    }
                }
            );

        }
    }
</script>


</body>
</html>