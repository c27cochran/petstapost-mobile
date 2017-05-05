/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

window.addEventListener("statusTap", function() {
  alert("status tap");
});

$(function() {

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.div-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top - 60
        }, 400, 'easeInCirc');
        event.preventDefault();
    });

    $('.simple-ajax-popup-align-top').magnificPopup({
        type: 'ajax',
        alignTop: true,
        overflowY: 'scroll'
    });

    // // notifications 
    // $.ajax({
    //     type: "POST",
    //     url: "http://petstapost.com/util/get-notifications",
    //     cache: false,
    //     success: function(number){
    //         if (number > 0) {
    //             $('.notifications').html(number);
    //             $('.drop-notifications').html(number);
    //             $('.mobile-notifications').html(number);
    //         } else {
    //             $('.notifications').addClass('hidden');
    //             $('.drop-notifications').addClass('hidden');
    //             $('.mobile-notifications').addClass('hidden');
    //         }
    //     },
    //     error: function(){
    //         // do nothing
    //     }
    // });

    // $('.show-notifications').magnificPopup({
    //     type: 'ajax',
    //     alignTop: true,
    //     overflowY: 'scroll'
    // });

    // register modal 
    $("#register-form").on('click', "#submit_register", function(e) {

        var regFormData = $('#register-form').serialize();
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "http://petstapost.com/mobile/create.php",
            data: regFormData,
            beforeSend:function(){
                $("#register-response").addClass("loading");
                $(".form-group").addClass("hidden");
                $(".response-error").addClass("hidden");
            },
            success: function(msg){
                setTimeout(function() {
                    if (msg.indexOf("<div class") > -1) {
                        $("#register-response").removeClass("loading");
                        $(".response-error").removeClass("hidden");
                        $(".form-group").removeClass("hidden");
                        $("#register-response").html(msg);
                        $('#username_register').focus();
                    } else {
                        window.location.href = msg;
                    }
                }, 1000);
            },
            error: function(){
                $("#register-response").removeClass("loading");
                $(".response-error").removeClass("hidden");
                $(".form-group").removeClass("hidden");
                $("#register-response").html('<div class="response-error">' +
                    '<p class="modal-alert"><i class="fa fa-exclamation-circle"></i>&nbsp;There was an issue with our server. Please try again.</p>' +
                '</div>');
            }
        });
    });

    // password recovery modal
    $("#recover-form").on('click', "#submit_recover", function(e) {

        var recFormData = $('#recover-form').serialize();
        e.preventDefault();

        $.ajax({
            type: "GET",
            url: "http://petstapost.com/account/recover-request",
            data: recFormData,
            beforeSend:function(){
                $("#recover-response").addClass("loading");
                $(".recover-modal-content").addClass("hidden");
                $(".response-error").addClass("hidden");
            },
            success: function(msg){
                setTimeout(function() {
                    $("#recover-response").removeClass("loading");
                    $(".response-error").removeClass("hidden");
                    $(".recover-modal-content").removeClass("hidden");
                    $("#recover-response").html(msg);
                    if (msg.indexOf("Thank you") > -1) {
                        setTimeout(function() {
                            $('#login-container').show();
                            $('#register-container').hide();
                            $('#recover-container').hide();
                        }, 3000);
                    } else {
                        $('#recover-email').focus();
                    }
                }, 1000);
            },
            error: function(){
                $("#register-response").html('<div class="response-error">' +
                    '<p class="modal-alert"><i class="fa fa-exclamation-circle"></i>&nbsp;There was an issue with our server. Please try again.</p>' +
                '</div>');
            }
        });
    });

    // login modal
    $("#login-form").on('click', "#submit_login", function(e) {

        var logFormData = $('#login-form').serialize();
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "http://petstapost.com/mobile/login.php",
            data: logFormData,
            beforeSend:function(){
                //add a loading gif so the broswer can see that something is happening
                $("#login-response").addClass("loading");
                $("#social-icons-conatainer").addClass("hidden");
                $(".response-error").addClass("hidden");
            },
            success: function(msg){
                
                var username = msg.replace("kibble.html?user=", "");
                var username = username.replace("&autologin=1", "");
                var username = username.replace("&autologin=0", "");
                localStorage.setItem("pp_username", username);

                setTimeout(function() {
                    if (msg.indexOf("<div class") > -1) {
                        $("#login-response").removeClass("loading");
                        $(".response-error").removeClass("hidden");
                        $("#social-icons-conatainer").removeClass("hidden");
                        $("#login-response").html(msg);
                        $('#username-login').focus();
                    } else {
                        window.location.href = msg;
                    }
                }, 1000);
            },
            error: function(){
                $("#login-response").removeClass("loading");
                $(".response-error").removeClass("hidden");
                $("#social-icons-conatainer").removeClass("hidden");
                $("#login-response").html('<div class="response-error">' +
                    '<p class="modal-alert"><i class="fa fa-exclamation-circle"></i>&nbsp;There was an issue with our server. Please try again.</p>' +
                '</div>');
            }
        });
    });

    // resending email confirmation
    $("#resend-email").on('click', function(e) {

        $(".activate-container").hide();

        var resendFormData = $('#resend-form').serialize();
        e.preventDefault();

        $.ajax({
            type: "GET",
            url: "account/resend-confirmation",
            data: resendFormData,
            success: function(msg){
                $("#email-confirm-box").html(msg);
                setTimeout(function() {
                    $("#email-confirm-box").hide();
                }, 2200);
            },
            error: function(){
                $("#email-confirm-box").html('<div class="alert-box">' +
                    '<p class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i>&nbsp;There was an issue with our server. Please try again.</p>' +
                  '</div>');
            }
        });
    });

    // login modal
    $("#change-form").on('click', "#submit_change", function(e) {

        var changeFormData = $('#change-form').serialize();
        e.preventDefault();

        $.ajax({
            type: "GET",
            url: "account/change-password",
            data: changeFormData,
            beforeSend:function(){
                //add a loading gif so the broswer can see that something is happening
                $("#change-response").addClass("loading");
                $(".change-modal-content").addClass("hidden");
                $(".response-error").addClass("hidden");
            },
            success: function(msg){
                setTimeout(function() {
                    $("#change-response").removeClass("loading");
                    $(".response-error").removeClass("hidden");
                    $("#change-response").html(msg);
                    if (msg.indexOf("We've changed your password") > -1) {
                        setTimeout(function() {
                            $("#account-modal").hide();
                        }, 3000);
                    } else {
                        $(".change-modal-content").removeClass("hidden");
                    }
                }, 1000);
            },
            error: function(){
                $("#email-confirm-box").html('<div class="alert-box">' +
                    '<p class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i>&nbsp;There was an issue with our server. Please try again.</p>' +
                  '</div>');
            }
        });
    });  

    $('.add-pet').on('click', function(e) {
        $('.no-pets').hide();
        $('.register-pet-container').show();
        $('#name_pet').focus();
    });

    // register pet 
    $("#register-pet-form").on('click', "#submit_pet", function(e) {

        e.preventDefault();

        var petFormData = $('#register-pet-form').serialize();

        $.ajax({
            type: "POST",
            url: "http://petstapost.com/util/add-pet",
            data: petFormData,
            beforeSend:function(){
                $("#register-pet-response").addClass("loading");
                $(".form-group").addClass("hidden");
                $(".response-error").addClass("hidden");
            },
            success: function(msg){
                if (msg.indexOf("<div class") > -1) {
                    $("#register-pet-response").removeClass("loading");
                    $(".response-error").removeClass("hidden");
                    $(".form-group").removeClass("hidden");
                    $("#register-pet-response").html(msg);
                    $('#name_pet').focus();
                } else {
                    $("#register-pet-response").html(msg);
                    $("#register-pet-response").removeClass("loading");
                }
            },
            error: function(){
                $("#register-pet-response").html('<div class="response-error">' +
                    '<p class="modal-alert"><i class="fa fa-exclamation-circle"></i>&nbsp;There was an issue with our server. Please try again.</p>' +
                '</div>');
            }
        });
    });

    // User Search
    // On Search Submit and Get Results
    function search() {
        var query_value = $('#user-search').val();
        $('#search-string').html(query_value);
        if(query_value !== ''){
            $.ajax({
                type: "POST",
                url: "http://petstapost.com/util/search-users",
                data: { query: query_value },
                cache: false,
                success: function(html){
                    $("#user-results").html(html);
                }
            });
        }
        return false;    
    }

    $("#user-search").bind("keyup", function(e) {
        // Set Timeout
        clearTimeout($.data(this, 'timer'));

        // Set Search String
        var search_string = $(this).val();

        // Do Search
        if (search_string == '') {
            $("#user-results").fadeOut();
            $('#user-results-text').fadeOut();
        }else{
            $("#user-results").fadeIn();
            $('#user-results-text').fadeIn();
            $(this).data('timer', setTimeout(search, 100));
        };
    });

    $("textarea").bind("keyup", function(e) {
        // Set Timeout
        clearTimeout($.data(this, 'timer'));

        // Set Search String
        var search_string = $(this).val();

        // Do Search
        if (search_string == '') {
            $("#user-results").fadeOut();
            $('#user-results-text').fadeOut();
        }else{
            $("#user-results").fadeIn();
            $('#user-results-text').fadeIn();
            $(this).data('timer', setTimeout(search, 100));
        };
    });
}); 

function mention() {

    var comment = $('.comment-box').val();
    var query_value = comment.split("@").pop();

    if ($('#mention-results li').length == 0) {
        $('#mention-results').addClass('hidden');
    } else {
        $('#mention-results').removeClass('hidden');
    }

    if (comment.indexOf("@") >= 0) {
        $.ajax({
            type: "POST",
            url: "http://petstapost.com/util/mention",
            data: { query: query_value },
            cache: false,
            success: function(html){
                $("#mention-results").html(html);
                $("#mention-results").fadeIn();
            }
        });
    } else {
        $("#mention-results").fadeOut();
    }
    return false;  
}

function addUserHandle(query, handle) { 

    $("#mention-results").fadeOut();

    handle = query.replace(query, handle);
    var comment_val = $('.comment-box').val();
    comment_val = comment_val.replace(query, handle);
    $('.comment-box').val(comment_val);
    $('.comment-box').focus();
}

function mentionCaption() {

    var caption = $('.custom-caption').val();
    var query_value = caption.split("@").pop();

    if ($('#mention-results-caption li').length == 0) {
        $('#mention-results-caption').addClass('hidden');
    } else {
        $('#mention-results-caption').removeClass('hidden');
    }

    if (caption.indexOf("@") >= 0) {
        $.ajax({
            type: "POST",
            url: "http://petstapost.com/util/mention-caption",
            data: { query: query_value },
            cache: false,
            success: function(html){
                $("#mention-results-caption").html(html);
                $("#mention-results-caption").fadeIn();
            }
        });
    } else {
        $("#mention-results-caption").fadeOut();
    }
    return false;  
}

function addUserHandleCaption(query, handle) { 

    $("#mention-results-caption").fadeOut();

    handle = query.replace(query, handle);
    var comment_val = $('.custom-caption').val();
    comment_val = comment_val.replace(query, handle);
    $('.custom-caption').val(comment_val);
    $('.custom-caption').focus();
}

function getPetID(id) { 

    $('#pet-id').html(id);
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}

$(".open-delete-form").on('click', function(e) {
    e.stopPropagation();
    $(".open-delete-form").addClass("hidden");
    $(".delete-post-form").removeClass("hidden");
});

$(".do-not-delete-post").on('click', function(e) {
    e.preventDefault();
    $(".dropdown").removeClass("open");
    $(".delete-post-form").addClass("hidden");
    $(".open-delete-form").removeClass("hidden");
})

$("#avatar-input").change(function (e) {
    e.preventDefault();
    $(".crop-preview-avatar").removeClass("hidden");
    $(".avatar-upload").addClass("hidden");
    $(".avatar-save").removeClass("hidden");
 });

$("#pet-avatar-input").change(function (e) {
    e.preventDefault();
    $(".crop-preview-pet-avatar").removeClass("hidden");
    $(".pet-avatar-upload").addClass("hidden");
    $(".pet-avatar-save").removeClass("hidden");
 });

$("#cover-input").change(function (e) {
    e.preventDefault();
    $(".crop-preview-cover").removeClass("hidden");
    $(".cover-upload").addClass("hidden");
    $(".cover-save").removeClass("hidden");
 });

$("#item-input").change(function (e) {
    e.preventDefault();
    $(".crop-preview-item").removeClass("hidden");
    $(".item-upload").addClass("hidden");
    $(".item-save").removeClass("hidden");
 });

$("#original-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").removeClass("bw-filter");
    $(".avatar-view img").removeClass("fade-filter");
    $(".avatar-view img").removeClass("chrome-filter");
    $(".avatar-view img").removeClass("bold-filter");
    $(".avatar-view img").removeClass("color-blast-filter");
    $(".avatar-view img").removeClass("antique-filter");
    $(".avatar-view img").removeClass("brighten-filter");
    $(".avatar-view img").removeClass("enhance-filter");
    $("#profile-filter").html("original-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#bw-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").addClass("bw-filter");
    $(".avatar-view img").removeClass("fade-filter");
    $(".avatar-view img").removeClass("chrome-filter");
    $(".avatar-view img").removeClass("bold-filter");
    $(".avatar-view img").removeClass("color-blast-filter");
    $(".avatar-view img").removeClass("antique-filter");
    $(".avatar-view img").removeClass("brighten-filter");
    $(".avatar-view img").removeClass("enhance-filter");
    $("#profile-filter").html("bw-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#chrome-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").removeClass("bw-filter");
    $(".avatar-view img").removeClass("fade-filter");
    $(".avatar-view img").addClass("chrome-filter");
    $(".avatar-view img").removeClass("bold-filter");
    $(".avatar-view img").removeClass("color-blast-filter");
    $(".avatar-view img").removeClass("antique-filter");
    $(".avatar-view img").removeClass("brighten-filter");
    $(".avatar-view img").removeClass("enhance-filter");
    
    $("#profile-filter").html("chrome-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#bold-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").removeClass("bw-filter");
    $(".avatar-view img").removeClass("fade-filter");
    $(".avatar-view img").removeClass("chrome-filter");
    $(".avatar-view img").addClass("bold-filter");
    $(".avatar-view img").removeClass("color-blast-filter");
    $(".avatar-view img").removeClass("antique-filter");
    $(".avatar-view img").removeClass("brighten-filter");
    $(".avatar-view img").removeClass("enhance-filter");
    $("#profile-filter").html("bold-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#fade-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").removeClass("bw-filter");
    $(".avatar-view img").addClass("fade-filter");
    $(".avatar-view img").removeClass("chrome-filter");
    $(".avatar-view img").removeClass("bold-filter");
    $(".avatar-view img").removeClass("color-blast-filter");
    $(".avatar-view img").removeClass("antique-filter");
    $(".avatar-view img").removeClass("brighten-filter");
    $(".avatar-view img").removeClass("enhance-filter");
    $("#profile-filter").html("fade-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#color-blast-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").removeClass("bw-filter");
    $(".avatar-view img").removeClass("fade-filter");
    $(".avatar-view img").removeClass("chrome-filter");
    $(".avatar-view img").removeClass("bold-filter");
    
    $(".avatar-view img").addClass("color-blast-filter");
    $(".avatar-view img").removeClass("antique-filter");
    $(".avatar-view img").removeClass("brighten-filter");
    $(".avatar-view img").removeClass("enhance-filter");
    
    $("#profile-filter").html("color-blast-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#antique-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").removeClass("bw-filter");
    $(".avatar-view img").removeClass("fade-filter");
    $(".avatar-view img").removeClass("chrome-filter");
    $(".avatar-view img").removeClass("bold-filter");
    $(".avatar-view img").removeClass("color-blast-filter");
    $(".avatar-view img").addClass("antique-filter");
    $(".avatar-view img").removeClass("brighten-filter");
    $(".avatar-view img").removeClass("enhance-filter");
    
    $("#profile-filter").html("antique-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#brighten-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").removeClass("bw-filter");
    $(".avatar-view img").removeClass("fade-filter");
    $(".avatar-view img").removeClass("chrome-filter");
    $(".avatar-view img").removeClass("bold-filter");
    $(".avatar-view img").removeClass("color-blast-filter");
    $(".avatar-view img").removeClass("antique-filter");
    $(".avatar-view img").addClass("brighten-filter");
    $(".avatar-view img").removeClass("enhance-filter");
    
    $("#profile-filter").html("brighten-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#enhance-avatar").on('click', function(e) {
    e.preventDefault();
    $(".avatar-view img").removeClass("bw-filter");
    $(".avatar-view img").removeClass("fade-filter");
    $(".avatar-view img").removeClass("chrome-filter");
    $(".avatar-view img").removeClass("bold-filter");
    $(".avatar-view img").removeClass("color-blast-filter");
    $(".avatar-view img").removeClass("antique-filter");
    $(".avatar-view img").removeClass("brighten-filter");
    $(".avatar-view img").addClass("enhance-filter");
    
    $("#profile-filter").html("enhance-filter");

    var img_url = $('.avatar-view img').attr('src');
    var profile_filter = $("#profile-filter").text();
    var username = $('#profile-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.profile-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&profile="+profile_filter+"',steps: {store: {path: '"+username+"/avatar.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

var currentDate = new Date();
var today = currentDate.getFullYear()+"-"+currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getMinutes()+"-"+currentDate.getSeconds();
$("#original-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").removeClass("bw-filter");
    $(".pet-avatar-view img").removeClass("fade-filter");
    $(".pet-avatar-view img").removeClass("chrome-filter");
    $(".pet-avatar-view img").removeClass("bold-filter");
    $(".pet-avatar-view img").removeClass("color-blast-filter");
    $(".pet-avatar-view img").removeClass("antique-filter");
    $(".pet-avatar-view img").removeClass("brighten-filter");
    $(".pet-avatar-view img").removeClass("enhance-filter");
    $("#pet-filter").html("original-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#bw-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").addClass("bw-filter");
    $(".pet-avatar-view img").removeClass("fade-filter");
    $(".pet-avatar-view img").removeClass("chrome-filter");
    $(".pet-avatar-view img").removeClass("bold-filter");
    $(".pet-avatar-view img").removeClass("color-blast-filter");
    $(".pet-avatar-view img").removeClass("antique-filter");
    $(".pet-avatar-view img").removeClass("brighten-filter");
    $(".pet-avatar-view img").removeClass("enhance-filter");
    $("#pet-filter").html("bw-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#chrome-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").removeClass("bw-filter");
    $(".pet-avatar-view img").removeClass("fade-filter");
    $(".pet-avatar-view img").addClass("chrome-filter");
    $(".pet-avatar-view img").removeClass("bold-filter");
    $(".pet-avatar-view img").removeClass("color-blast-filter");
    $(".pet-avatar-view img").removeClass("antique-filter");
    $(".pet-avatar-view img").removeClass("brighten-filter");
    $(".pet-avatar-view img").removeClass("enhance-filter");
    
    $("#pet-filter").html("chrome-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#bold-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").removeClass("bw-filter");
    $(".pet-avatar-view img").removeClass("fade-filter");
    $(".pet-avatar-view img").removeClass("chrome-filter");
    $(".pet-avatar-view img").addClass("bold-filter");
    $(".pet-avatar-view img").removeClass("color-blast-filter");
    $(".pet-avatar-view img").removeClass("antique-filter");
    $(".pet-avatar-view img").removeClass("brighten-filter");
    $(".pet-avatar-view img").removeClass("enhance-filter");
    $("#pet-filter").html("bold-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#fade-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").removeClass("bw-filter");
    $(".pet-avatar-view img").addClass("fade-filter");
    $(".pet-avatar-view img").removeClass("chrome-filter");
    $(".pet-avatar-view img").removeClass("bold-filter");
    $(".pet-avatar-view img").removeClass("color-blast-filter");
    $(".pet-avatar-view img").removeClass("antique-filter");
    $(".pet-avatar-view img").removeClass("brighten-filter");
    $(".pet-avatar-view img").removeClass("enhance-filter");
    $("#pet-filter").html("fade-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#color-blast-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").removeClass("bw-filter");
    $(".pet-avatar-view img").removeClass("fade-filter");
    $(".pet-avatar-view img").removeClass("chrome-filter");
    $(".pet-avatar-view img").removeClass("bold-filter");
    
    $(".pet-avatar-view img").addClass("color-blast-filter");
    $(".pet-avatar-view img").removeClass("antique-filter");
    $(".pet-avatar-view img").removeClass("brighten-filter");
    $(".pet-avatar-view img").removeClass("enhance-filter");
    
    $("#pet-filter").html("color-blast-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#antique-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").removeClass("bw-filter");
    $(".pet-avatar-view img").removeClass("fade-filter");
    $(".pet-avatar-view img").removeClass("chrome-filter");
    $(".pet-avatar-view img").removeClass("bold-filter");
    $(".pet-avatar-view img").removeClass("color-blast-filter");
    $(".pet-avatar-view img").addClass("antique-filter");
    $(".pet-avatar-view img").removeClass("brighten-filter");
    $(".pet-avatar-view img").removeClass("enhance-filter");
    
    $("#pet-filter").html("antique-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#brighten-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").removeClass("bw-filter");
    $(".pet-avatar-view img").removeClass("fade-filter");
    $(".pet-avatar-view img").removeClass("chrome-filter");
    $(".pet-avatar-view img").removeClass("bold-filter");
    $(".pet-avatar-view img").removeClass("color-blast-filter");
    $(".pet-avatar-view img").removeClass("antique-filter");
    $(".pet-avatar-view img").addClass("brighten-filter");
    $(".pet-avatar-view img").removeClass("enhance-filter");
    
    $("#pet-filter").html("brighten-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#enhance-pet-avatar").on('click', function(e) {
    e.preventDefault();
    $(".pet-avatar-view img").removeClass("bw-filter");
    $(".pet-avatar-view img").removeClass("fade-filter");
    $(".pet-avatar-view img").removeClass("chrome-filter");
    $(".pet-avatar-view img").removeClass("bold-filter");
    $(".pet-avatar-view img").removeClass("color-blast-filter");
    $(".pet-avatar-view img").removeClass("antique-filter");
    $(".pet-avatar-view img").removeClass("brighten-filter");
    $(".pet-avatar-view img").addClass("enhance-filter");
    
    $("#pet-filter").html("enhance-filter");

    var img_url = $('.pet-avatar-view img').attr('src');
    var pet_filter = $("#pet-filter").text();
    var username = $('#pet-username').text();
    var pet_id = $('#pet-id').text();
    var filename = today+'pet-avatar.jpg';

    $('#script-container').html("");
    $('#script-container').html("<script>$('.pet-avatar-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&pet="+pet_filter+"&id="+pet_id+"',steps: {store: {path: '"+username+"/"+filename+"'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#original-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").removeClass("bw-filter");
    $(".cover-view img").removeClass("fade-filter");
    $(".cover-view img").removeClass("chrome-filter");
    $(".cover-view img").removeClass("bold-filter");
    $(".cover-view img").removeClass("color-blast-filter");
    $(".cover-view img").removeClass("antique-filter");
    $(".cover-view img").removeClass("brighten-filter");
    $(".cover-view img").removeClass("enhance-filter");
    $("#cover-filter").html("original-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();
    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#bw-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").addClass("bw-filter");
    $(".cover-view img").removeClass("fade-filter");
    $(".cover-view img").removeClass("chrome-filter");
    $(".cover-view img").removeClass("bold-filter");
    $(".cover-view img").removeClass("color-blast-filter");
    $(".cover-view img").removeClass("antique-filter");
    $(".cover-view img").removeClass("brighten-filter");
    $(".cover-view img").removeClass("enhance-filter");
    $("#cover-filter").html("bw-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();

    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#chrome-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").addClass("chrome-filter");
    $(".cover-view img").removeClass("fade-filter");
    $(".cover-view img").removeClass("bw-filter");
    $(".cover-view img").removeClass("bold-filter");
    $(".cover-view img").removeClass("color-blast-filter");
    $(".cover-view img").removeClass("antique-filter");
    $(".cover-view img").removeClass("brighten-filter");
    $(".cover-view img").removeClass("enhance-filter");
    $("#cover-filter").html("chrome-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();
    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#bold-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").addClass("bold-filter");
    $(".cover-view img").removeClass("fade-filter");
    $(".cover-view img").removeClass("bw-filter");
    $(".cover-view img").removeClass("chrome-filter");
    $(".cover-view img").removeClass("color-blast-filter");
    $(".cover-view img").removeClass("antique-filter");
    $(".cover-view img").removeClass("brighten-filter");
    $(".cover-view img").removeClass("enhance-filter");
    $("#cover-filter").html("bold-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();
    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#fade-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").addClass("fade-filter");
    $(".cover-view img").removeClass("bw-filter");
    $(".cover-view img").removeClass("chrome-filter");
    $(".cover-view img").removeClass("bold-filter");
    $(".cover-view img").removeClass("color-blast-filter");
    $(".cover-view img").removeClass("antique-filter");
    $(".cover-view img").removeClass("brighten-filter");
    $(".cover-view img").removeClass("enhance-filter");
    $("#cover-filter").html("fade-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();
    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#color-blast-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").removeClass("bw-filter");
    $(".cover-view img").removeClass("fade-filter");
    $(".cover-view img").removeClass("chrome-filter");
    $(".cover-view img").removeClass("bold-filter");
    $(".cover-view img").addClass("color-blast-filter");
    $(".cover-view img").removeClass("antique-filter");
    $(".cover-view img").removeClass("brighten-filter");
    $(".cover-view img").removeClass("enhance-filter");
    $("#cover-filter").html("color-blast-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();
    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#antique-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").removeClass("bw-filter");
    $(".cover-view img").removeClass("fade-filter");
    $(".cover-view img").removeClass("chrome-filter");
    $(".cover-view img").removeClass("bold-filter");
    $(".cover-view img").removeClass("color-blast-filter");
    $(".cover-view img").addClass("antique-filter");
    $(".cover-view img").removeClass("brighten-filter");
    $(".cover-view img").removeClass("enhance-filter");
    $("#cover-filter").html("antique-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();
    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#brighten-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").removeClass("bw-filter");
    $(".cover-view img").removeClass("fade-filter");
    $(".cover-view img").removeClass("chrome-filter");
    $(".cover-view img").removeClass("bold-filter");
    $(".cover-view img").removeClass("color-blast-filter");
    $(".cover-view img").removeClass("antique-filter");
    $(".cover-view img").addClass("brighten-filter");
    $(".cover-view img").removeClass("enhance-filter");
    $("#cover-filter").html("brighten-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();
    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});

$("#enhance-cover").on('click', function(e) {
    e.preventDefault();
    $(".cover-view img").removeClass("bw-filter");
    $(".cover-view img").removeClass("fade-filter");
    $(".cover-view img").removeClass("chrome-filter");
    $(".cover-view img").removeClass("bold-filter");
    $(".cover-view img").removeClass("color-blast-filter");
    $(".cover-view img").removeClass("antique-filter");
    $(".cover-view img").removeClass("brighten-filter");
    $(".cover-view img").addClass("enhance-filter");
    $("#cover-filter").html("enhance-filter");

    var img_url = $('.cover-view img').attr('src');
    var cover_filter = $("#cover-filter").text();
    var username = $('#cover-username').text();

    $('#script-container').html("");
    $('#script-container').html("<script>$('.cover-pic-upload').transloadit({wait: true,triggerUploadOnFileSelection: true,params: {auth: { key: 'confidential' }, template_id: '9b2c9990db9c11e49386c106d2f35d88', redirect_url: 'http://petstapost.com/mobile/post-upload.php?user="+username+"&cover="+cover_filter+"',steps: {store: {path: '"+username+"/cover.png'}, import: {robot: '/http/import',url: 'http://petstapost.com/"+img_url+"'}}}});</script>");
});


$("#original-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").removeClass("bw-filter");
    $(".item-view img").removeClass("fade-filter");
    $(".item-view img").removeClass("chrome-filter");
    $(".item-view img").removeClass("bold-filter");
    $(".item-view img").removeClass("color-blast-filter");
    $(".item-view img").removeClass("antique-filter");
    $(".item-view img").removeClass("brighten-filter");
    $(".item-view img").removeClass("enhance-filter");
    $("#item-filter").html("original-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

$("#bw-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").addClass("bw-filter");
    $(".item-view img").removeClass("fade-filter");
    $(".item-view img").removeClass("chrome-filter");
    $(".item-view img").removeClass("bold-filter");
    $(".item-view img").removeClass("color-blast-filter");
    $(".item-view img").removeClass("antique-filter");
    $(".item-view img").removeClass("brighten-filter");
    $(".item-view img").removeClass("enhance-filter");
    $("#item-filter").html("bw-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

$("#chrome-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").addClass("chrome-filter");
    $(".item-view img").removeClass("fade-filter");
    $(".item-view img").removeClass("bw-filter");
    $(".item-view img").removeClass("bold-filter");
    $(".item-view img").removeClass("color-blast-filter");
    $(".item-view img").removeClass("antique-filter");
    $(".item-view img").removeClass("brighten-filter");
    $(".item-view img").removeClass("enhance-filter");
    $("#item-filter").html("chrome-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

$("#bold-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").addClass("bold-filter");
    $(".item-view img").removeClass("fade-filter");
    $(".item-view img").removeClass("bw-filter");
    $(".item-view img").removeClass("chrome-filter");
    $(".item-view img").removeClass("color-blast-filter");
    $(".item-view img").removeClass("antique-filter");
    $(".item-view img").removeClass("brighten-filter");
    $(".item-view img").removeClass("enhance-filter");
    $("#item-filter").html("bold-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

$("#fade-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").addClass("fade-filter");
    $(".item-view img").removeClass("bw-filter");
    $(".item-view img").removeClass("chrome-filter");
    $(".item-view img").removeClass("bold-filter");
    $(".item-view img").removeClass("color-blast-filter");
    $(".item-view img").removeClass("antique-filter");
    $(".item-view img").removeClass("brighten-filter");
    $(".item-view img").removeClass("enhance-filter");
    $("#item-filter").html("fade-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

$("#color-blast-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").removeClass("bw-filter");
    $(".item-view img").removeClass("fade-filter");
    $(".item-view img").removeClass("chrome-filter");
    $(".item-view img").removeClass("bold-filter");
    $(".item-view img").addClass("color-blast-filter");
    $(".item-view img").removeClass("antique-filter");
    $(".item-view img").removeClass("brighten-filter");
    $(".item-view img").removeClass("enhance-filter");
    $("#item-filter").html("color-blast-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

$("#antique-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").removeClass("bw-filter");
    $(".item-view img").removeClass("fade-filter");
    $(".item-view img").removeClass("chrome-filter");
    $(".item-view img").removeClass("bold-filter");
    $(".item-view img").removeClass("color-blast-filter");
    $(".item-view img").addClass("antique-filter");
    $(".item-view img").removeClass("brighten-filter");
    $(".item-view img").removeClass("enhance-filter");
    $("#item-filter").html("antique-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

$("#brighten-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").removeClass("bw-filter");
    $(".item-view img").removeClass("fade-filter");
    $(".item-view img").removeClass("chrome-filter");
    $(".item-view img").removeClass("bold-filter");
    $(".item-view img").removeClass("color-blast-filter");
    $(".item-view img").removeClass("antique-filter");
    $(".item-view img").addClass("brighten-filter");
    $(".item-view img").removeClass("enhance-filter");
    $("#item-filter").html("brighten-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

$("#enhance-item").on('click', function(e) {
    e.preventDefault();
    $(".item-view img").removeClass("bw-filter");
    $(".item-view img").removeClass("fade-filter");
    $(".item-view img").removeClass("chrome-filter");
    $(".item-view img").removeClass("bold-filter");
    $(".item-view img").removeClass("color-blast-filter");
    $(".item-view img").removeClass("antique-filter");
    $(".item-view img").removeClass("brighten-filter");
    $(".item-view img").addClass("enhance-filter");
    $("#item-filter").html("enhance-filter");

    var img_url = $('.item-view img').attr('src');
    var item_filter = $("#item-filter").text();
    $('#item-filter-input').val(item_filter);
    var username = $('#item-username').text();
    var filename = $('#item-filename').text();
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

$('#close-modal-avatar').on('click', function(e) {
    e.preventDefault();
    $('#avatar-modal').modal('hide');
    $('.avatar-form').removeClass('hidden');
    $(".avatar-upload").removeClass("hidden");
    $(".avatar-body").removeClass("loading_circle");
    $('.profile-pic-upload').addClass('hidden');
    $(".crop-preview-avatar").addClass("hidden");
    var url = $('.profile-pic').attr('src');
    $('.avatar-preview').empty().html('<img src="' + url + '">');
});

$('#close-modal-pet-avatar').on('click', function(e) {
    e.preventDefault();
    $('#pet-avatar-modal').modal('hide');
    $('.pet-avatar-form').removeClass('hidden');
    $(".pet-avatar-upload").removeClass("hidden");
    $(".pet-avatar-body").removeClass("loading_circle");
    $('.pet-avatar-pic-upload').addClass('hidden');
    $(".crop-preview-pet-avatar").addClass("hidden");
    var url = $('.pet-img').attr('src');
    $('.pet-avatar-preview').empty().html('<img src="' + url + '">');
});

$('#close-modal-cover').on('click', function(e) {
    e.preventDefault();
    $('#cover-modal').modal('hide');
    $('.cover-form').removeClass('hidden');
    $(".cover-upload").removeClass("hidden");
    $(".cover-body").removeClass("loading_circle");
    $('.cover-pic-upload').addClass('hidden');
    $(".crop-preview-cover").addClass("hidden");
    var url = $('.cover-photo-profile').attr('src');
    $('.cover-preview').empty().html('<img src="' + url + '">');
});

$('#close-modal-item').on('click', function(e) {
    e.preventDefault();
    $('#item-modal').modal('hide');
    $('.item-form').removeClass('hidden');
    $(".item-upload").removeClass("hidden");
    $(".item-body").removeClass("loading_circle");
    $('.item-pic-upload').addClass('hidden');
    $(".crop-preview-item").addClass("hidden");
});

// $('#item-modal').on('hidden.bs.modal', function(e) {
//     e.preventDefault();
//     $('.item-form')[0].reset();
// });

// hide / show forms in modals

// code here to hide all containers and headers
$('#modal-close').on('click', function(e) {
    e.preventDefault();
    $('#loginModalLabel').hide();
    $('#login-container').hide();
    $('#recoverModalLabel').hide();
    $('#recover-container').hide();
    $('#createModalLabel').hide();
    $('#register-container').hide();
});

$('#account-modal').on('hidden.bs.modal', function(e) {
    e.preventDefault();
    $('#loginModalLabel').hide();
    $('#login-container').hide();
    $('#recoverModalLabel').hide();
    $('#recover-container').hide();
    $('#createModalLabel').hide();
    $('#register-container').hide();
});

$('#account-modal').on('shown.bs.modal', function(e) {
    $('#username-login').focus();
});

$('#login-modal-launcher').on('click', function(e) {
    e.preventDefault();
    $('#login-container').show();
    $('#username-login').focus();
});

$('#lost-password-link').on('click', function(e) {
    e.preventDefault();
    $('#back-link').removeClass('hidden');
    $('.back-link-ipad').show();
    $('#login-container').hide();
    $('#register-container').hide();
    $('#recover-container').show();
    $('#recover-email').focus();
});

$('#create-account-button').on('click', function(e) {
    e.preventDefault();
    $('#back-link').removeClass('hidden');
    $('.back-link-ipad').show();
    $('.login-div').css('height', '430px');
    $('#login-container').hide();
    $('#register-container').show();
    $('#username_register').focus();
});

$('.register-modal-launcher').on('click', function(e) {
    e.preventDefault();
    $('#loginModalLabel').hide();
    $('#login-container').hide();
    $('#createModalLabel').show();
    $('#register-container').show();
    $('#username_register').focus();
});

$('#change-modal-launcher').on('click', function(e) {
    e.preventDefault();
    $('#changeModalLabel').show();
    $('#change-container').show();
    $('#change-current').focus();
});

$('#back-link').on('click', function(e) {
    $(this).addClass('hidden');
    $('#login-container').show();
    $('#register-container').hide();
    $('#recover-container').hide();
});

$('.back-link-ipad').on('click', function(e) {
    $(this).hide();
    $('.login-div').css('height', '300px');
    $('#login-container').show();
    $('#register-container').hide();
    $('#recover-container').hide();
});


// Profile links
$('.cover-nav > li.idle').on('click', function(e) {
    
    e.preventDefault();

    $('.cover-nav > li.active').removeClass('active');
    $('.cover-nav > li.active').addClass('idle');
    $(this).addClass('active');
    $(this).removeClass('idle');
});

$('.hide-item-anchor').on('click', function(e) {
    e.preventDefault();
    $(this).parents('.profile-item').addClass('hidden');
});

$(document).on('click', '.favorite', function(e) {
    var item_id = $(this).attr('id').replace('item_', '');
    var user_id = $('#user-id').text();
    var to_user = $('#to-user-'+item_id).text();
    var fav_pop_up = $('#fav-pop-up-'+item_id);
    var fav_icon = $('#fav-icon-'+item_id);
    var fav_count = parseInt($('#fav-count-'+item_id).text());

    fav_icon.addClass('fa-heart');
    
    fav_pop_up.show();

    e.preventDefault();

    $.ajax({
        type: "GET",
        url: "http://petstapost.com/util/add-favorite",
        data: "item_id="+item_id+"&user_id="+user_id+"&to_user="+to_user,
        success: function(msg){
            // fav_pop_up.html('<div class="popover right" style="display:block;"><div class="arrow"></div>'+
            //     '<div class="popover-content"><p>'+msg+'</p></div></div>');
            // setTimeout(function() {
            //     fav_pop_up.hide();
            // }, 2000);
            if (msg == 'Favorite added!') {
                fav_icon.removeClass('fa-paw');
                fav_icon.addClass('fa-heart');
                if (fav_count) {
                    fav_count = fav_count + 1;
                    $('#fav-count-'+item_id).text(' '+String(fav_count));
                } else {
                    $('#fav-count-'+item_id).text(' 1');
                }
            }
            if (msg == 'Favorite removed.') {
                fav_icon.removeClass('fa-heart');
                fav_icon.addClass('fa-paw');
                fav_count = fav_count - 1;
                $('#fav-count-'+item_id).text(String(fav_count));
            }
        },
        error: function() {
            fav_pop_up.html('There was an error.');
        }
    });

});

$('#add-friend-button').on('click', function(e) {
    var my_id = $('#user-id').text();
    var their_id = $('#to-user').text();
    var their_name = $.trim($('#their-name').text());
    var my_name = $('#my-name').text();
    var span = $('#friend-add');
    

    e.preventDefault();

    $.ajax({
        type: "GET",
        url: "http://petstapost.com/util/add-friend",
        data: "my_id="+my_id+"&their_id="+their_id+"&my_name="+my_name+"&their_name="+their_name,
        success: function(msg){
            span.html(msg);
            span.removeClass('hidden');
            $('#add-friend-button').hide();
        },
        error: function() {
            span.html('There was an error.');
        }
    });

});

$('#accept-friend-button').on('click', function(e) {
    var my_id = $('#user-id').text();
    var their_id = $('#to-user').text();
    var their_name = $.trim($('#their-name').text());
    var my_name = $('#my-name').text();
    var span = $('#friend-accept');
    

    e.preventDefault();

    $.ajax({
        type: "GET",
        url: "http://petstapost.com/util/accept-friend",
        data: "my_id="+my_id+"&their_id="+their_id+"&my_name="+my_name+"&their_name="+their_name,
        success: function(msg){
            span.removeClass('hidden');
            span.html(msg);
            $('#accept-friend-button').hide();
        },
        error: function() {
            span.html('There was an error.');
        }
    });

});

$('#remove-friend-request').on('click', function(e) {
    var my_id = $('#user-id').text();
    var their_id = $('#to-user').text();
    var span = $('#friend-remove-request');
    

    e.preventDefault();

    $.ajax({
        type: "GET",
        url: "http://petstapost.com/util/remove-friend-request",
        data: "my_id="+my_id+"&their_id="+their_id,
        success: function(msg){
            span.removeClass('hidden');
            span.html(msg);
            $('#remove-friend-request').hide();
        },
        error: function() {
            span.html('There was an error.');
        }
    });

});

$('#remove-friend').on('click', function(e) {
    var my_id = $('#user-id').text();
    var their_id = $('#to-user').text();
    var span = $('#friend-remove');
    

    e.preventDefault();

    $.ajax({
        type: "GET",
        url: "http://petstapost.com/util/remove-friend",
        data: "my_id="+my_id+"&their_id="+their_id,
        success: function(msg){
            span.removeClass('hidden');
            span.html(msg);
            $('#remove-friend').hide();
        },
        error: function() {
            span.html('There was an error.');
        }
    });

});

$('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
        //the 'is' for buttons that trigger popups
        //the 'has' for icons within a button that triggers a popup
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});

$("[data-toggle=popover]").popover({
    html: true, 
    content: function() {

        var item_id = $(this).attr('id').replace('comment-link-', '');
        var html = $('.show-comments-'+item_id).html();
        
        return '<div id="popover-content-'+item_id+'">'+
                '<div class="comment-load">'+html+'</div>' +
                '<div class="form-group">'+
                    '<textarea maxlength="160" autofocus class="form-control comment-box comment-text-'+item_id+'" placeholder="Add a comment…" onKeyUp="mention()"></textarea>'+
                '</div><ul class="dropdown-menu" id="mention-results"></ul>'+
                '<button id="comment-btn-'+item_id+'" type="submit" class="btn btn-comment btn-block">Submit</button></div>';
    }
});

$(document).on("click", ".btn-comment", function(e) {
    
    e.preventDefault();
    
    var item_id = $(this).attr('id').replace('comment-btn-', '');
    var user_id = $('#user-id').text();
    var to_user = $('#to-user-'+item_id).text();
    var comment = $('.comment-text-'+item_id).val();
    var comment_hash = comment.replace(/\#/g, '%23');
    $('.comment-text-'+item_id).focus();
    var pop_up = $('#popover-content-'+item_id);
    var comment_count = parseInt($('#comment-count-'+item_id).text());

    $.ajax({
        type: "GET",
        url: "http://petstapost.com/util/add-comment",
        data: "item_id="+item_id+"&user_id="+user_id+"&to_user="+to_user+"&comment="+comment_hash,
        success: function(msg){
            $('.comment-text-'+item_id).val('');
            $('.comment-load').append('<p class="comment-time">Now</p><a class="comment-link" href="javascript:void(0);">Me</a>: '+msg+'<br><br>');
            if (comment_count) {
                comment_count = comment_count + 1;
                $('#comment-count-'+item_id).text(String(comment_count));
            } else {
                $('#comment-count-'+item_id).text('1');
            }
            $.ajax({
                type: "GET",
                url: "http://petstapost.com/util/show-limited-comments-profile",
                data: "item_id="+item_id,
                success: function(msg){
                    $('.show-comments-'+item_id).html(msg);
                    $('.comment-data-container').html(msg);
                },
                error: function() {
                    $('.show-comments-'+item_id).html('<p>There was an error.</p>');
                }
            });
            setTimeout(function() {
                $("[data-toggle=popover]").popover('hide');
                pop_up.hide();
            }, 2000);
        },
        error: function() {
            $('.comment-load').html('<p>There was an error.</p>');
        }
    });
});

$(document).on("click", ".btn-comment-get-item", function(e) {
    
    e.preventDefault();
    
    var item_id = $(this).attr('id').replace('comment-btn-', '');
    var user_id = $('#user-id').text();
    var to_user = $('#to-user-'+item_id).text();
    var comment = $('.comment-text-'+item_id).val();
    var comment_hash = comment.replace(/\#/g, '%23');
    $('.comment-text-'+item_id).focus();

    $.ajax({
        type: "GET",
        url: "http://petstapost.com/util/add-comment",
        data: "item_id="+item_id+"&user_id="+user_id+"&to_user="+to_user+"&comment="+comment_hash,
        success: function(msg){
            $('.comment-text-'+item_id).val('');
            $('.comment-data-container').append('<p class="comment-time">Now</p><p class="popup-comment"><a class="comment-link" href="javascript:void(0);">Me</a>: '+msg+'</p><br><br>');
        },
        error: function() {
            $('.comment-data-container').append('<p>There was an error.</p>');
        }
    });
});

$(document).on("click", ".delete-comment-link", function(e) {
    
    e.preventDefault();
    
    var comment_id = $(this).attr('id').replace('delete-comment-', '');
    var item_id = $('.comment-load').parent().attr('id').replace('popover-content-', '');
    var comment_count = parseInt($('#comment-count-'+item_id).text());

    $.ajax({
        type: "GET",
        url: "http://petstapost.com/util/remove-comment",
        data: "comment_id="+comment_id,
        success: function(msg){
            $('.my-comment-'+comment_id).html(msg);
            if (comment_count) {
                comment_count = comment_count - 1;
                $('#comment-count-'+item_id).text(String(comment_count));
            } else {
                $('#comment-count-'+item_id).text('');
            }
            $.ajax({
                type: "GET",
                url: "http://petstapost.com/util/show-limited-comments-profile",
                data: "item_id="+item_id,
                success: function(msg){
                    $('.show-comments-'+item_id).html(msg);
                },
                error: function() {
                    $('.show-comments-'+item_id).html('<p>There was an error.</p>');
                }
            });
            setTimeout(function() {
                $('[data-toggle="popover"]').each(function () {
                    if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                        $(this).popover('hide');
                    }
                    $('.my-comment-'+comment_id).hide();
                });
            }, 2000);
        },
        error: function() {
            $('.my-comment').html('<p>There was an error.</p>');
        }
    });
});

$(document).on('click', '.show-others', function(e) {

    e.preventDefault();

    $('.all-favorites').removeClass('hidden');
    $('.two-favorites').addClass('hidden');
});

// $('.navbar-mobile-tog').on('click', function(e) {
//     $.ajax({
//         type: "POST",
//         url: "http://petstapost.com/util/remove-notifications",
//         success: function(msg){
//             // Do nothing
//         },
//         error: function() {
//             // Do nothing
//         }
//     });
// });

// $('.navbar-web-tog').on('click', function(e) {
//     e.preventDefault();
//     $.ajax({
//         type: "POST",
//         url: "http://petstapost.com/util/remove-notifications",
//         success: function(msg){
//             // Do nothing
//         },
//         error: function() {
//             // Do nothing
//         }
//     });
// });

// $('.show-notifications').on('click', function(e) {
//     e.preventDefault();
//     $('.drop-notifications').addClass('hidden');
//     $('.notifications').addClass('hidden');
//     $.ajax({
//         type: "POST",
//         url: "http://petstapost.com/util/remove-notifications",
//         success: function(msg){
//             // Do nothing
//         },
//         error: function() {
//             // Do nothing
//         }
//     });
// });

$('#show-posts').on('click', function(e) {
    e.preventDefault();
    $('.display-items-area').removeClass('hidden');
    $('.display-friends-area').addClass('hidden');
    $('.display-pets-area').addClass('hidden');
});

$('#show-friends').on('click', function(e) {
    e.preventDefault();
    $('.display-friends-area').removeClass('hidden');
    $('.display-items-area').addClass('hidden');
    $('.display-pets-area').addClass('hidden');
});

$('#show-pets').on('click', function(e) {
    e.preventDefault();
    $('.display-pets-area').removeClass('hidden');
    $('.display-friends-area').addClass('hidden');
    $('.display-items-area').addClass('hidden');
});

$('#secure-profile').on('click', function(e) {
    e.preventDefault();
    console.log('secured');
    var span = $('#secure-text');
    $.ajax({
        type: "POST",
        data: "user="+user_id,
        url: "http://petstapost.com/mobile/secure-profile.php",
        success: function(msg){
            span.html(msg);
        },
        error: function() {
            // Do nothing
        }
    });
    location.reload();
});

$('#open-profile').on('click', function(e) {
    e.preventDefault();
    console.log('open');
    var span = $('#secure-text');
    $.ajax({
        type: "POST",
        data: "user="+user_id,
        url: "http://petstapost.com/mobile/remove-security.php",
        success: function(msg){
            span.html(msg);
        },
        error: function() {
            // Do nothing
        }
    });
    location.reload();
});

$(".add-pet").on('click', function(e) {
    e.preventDefault();
    $("#add-pet-div").addClass("hidden");
});


