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

        var string ="<div id='profile_update_form_wrapper'>"+
            "<h3>Rediger profil</h3>"+
            "<form accept-charset='UTF-8'  method='POST' action='editMyUser' id='updateUserForm'>"+
            "<p><label>Fullt navn:</label>"+
            "<input id='fullname' type='text' name='fullname' value='"+user.fullname+"' /></p>"+

            "<p><label>Flickr ID:</label>"+
            "<input id='flickrid' type='text' name='flickrid'  value='"+user.flickrId+"'/> <a target='_blank' href='http://support.statsmix.com/kb/faq/how-do-i-find-my-flickr-id' style='margin-top: 3px;'><img src='gfx/question.png' alt='Hva er dette?' style='border: 0'/></a></p>"+
            "<p><label>E-Post:</label>"+
            "<input id='email' type='text' name='email' value='"+user.email+"'/></p>"+

            "<input type='submit' value='Rediger' id='updateUser'/>"+

            "</div" +
            "</form>";

        $.fancybox({
            content: string,
            overlayShow: false
        });

        $("#updateUserForm").ajaxForm({
            success: function() {
                $.fancybox.close();
            }
        });


    },
    CLASS_NAME: "TripOrganizer.ProfileEditor"
});



