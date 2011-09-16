TripOrganizer.ProfileEditor = OpenLayers.Class({

    initialize: function(){

    },

    editProfile: function(){
        $.fancybox.showActivity();
        var that = this;
        $.getJSON(
                "getUserInfo",
                {
                },
                function(user) {
                    //console.log(trip);
                    that.showEditForm(user);
                }
            );
    },

    showEditForm: function(user){
        $.fancybox.hideActivity();

        var string ="<table><tr>"+
            "<td>Fullt navn:</td>"+
            "<td> <input id='fullname' type='text' name='fullname' value='"+user.fullname+"' /></td>"+
        "</tr>"+
            "<tr>"+
            "<td>Flickr ID:</td>"+
            "<td> <input id='flickrid' type='text' name='flickrid'  value='"+user.flickrId+"'/> <a href='http://support.statsmix.com/kb/faq/how-do-i-find-my-flickr-id' target='_blank'>Huh?</a></td>"+
        "</tr>"+
        "<tr>"+
            "<td>E-Post:</td>"+
            "<td><input id='email' type='text' name='email' value='"+user.email+"'/></td>"+
        "</tr>"+
        "<tr>"+
            "<td colspan='2'><input type='submit' value='Oppdater' id='updateUser'/></td>"+
        "</tr>"+
    "</table>";

        $.fancybox({
            content: string
        });

        $("#updateUser").click(function(){

            var name = document.getElementById("fullname").value;
            var flickrid = document.getElementById("flickrid").value;
            var email = document.getElementById("email").value;

            $.getJSON(
                "updateUser",
                {
                    name:name,
                    flickrid:flickrid,
                    email:email

                },
                function(response) {
                    $.fancybox.close();
                }
            );

        });

    },
    CLASS_NAME: "TripOrganizer.ProfileEditor"
});



