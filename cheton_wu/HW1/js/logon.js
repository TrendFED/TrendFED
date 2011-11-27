/**
 * Global variables
 */
var PAGENAME = getPageName();
var URLPARAMS = getURLParams();

(function(){

    /**
     * localization
     */
    $("*").localize({data:L10N,sections:[PAGENAME,"COMMON"]});

    /**
     * Automatic button width adjustment
     */
    $("button[type='button']").each(function() {
        var value = $(this).text() || "";
        if (value.length > 6) {
            $(this).css("width", "auto");
        }
    });

    // Remember Me - Read from cookies
    if ($.cookie("remember") == "true") {
        $("input[name='username']").val($.cookie("username"));
        $("input[name='remember_me']").attr("checked", true);
    } else {
        $("input[name='username']").val("");
        $("input[name='remember_me']").attr("checked", false);
    }
    
    /**
     * Logon Content
     */
    $("#logon_content").show();
    $("#logon_content_link").click(function() {
        $("#pwd_forgot_content").hide();
        $("#logon_content").show();
    });

    /**
     * Forgot Password Content
     */
    $("#pwd_forgot_content").hide();
    $("#pwd_forgot_content_link").click(function() {
        $("#logon_content").hide();
        $("#pwd_forgot_content").show();
    });

    /**
     * Ajax Loading
     */
    $("#loading").ajaxStart(function() {
        $("#btn_logon").attr("disabled", true);
        $(this).show();
    });
    $("#loading").ajaxStop(function() {
        $("#btn_logon").attr("disabled", false);
        $(this).hide();
    });

    /**
     * Logon Form Validation
     */
    $("#logon_form").validate({
        rules: {
            username : {
                required : true
            },
            password : {
                required : true
            }
        },
        messages : {
            username : {
                required : L10N[PAGENAME].EMPTY_USERNAME
            },
            password : {
                required : L10N[PAGENAME].EMPTY_PASSWORD
            }
        },
        focusInvalid : true,
        showErrors : function(errorMap, errorList) { 
            for (name in errorMap) {
                $("#logon_form input[name='" + name + "'] ~ span[class='errmsg_inline_below']").html(errorMap[name]).show();
            }
            return true;
        },
        invalidHandler : function(form, validator) {
            var errors = validator.numberOfInvalids();
        }
    });
    
    $("input").not( $(":button") ).keypress(function (evt) {
        if (evt.keyCode == 13) {
                    $("#btn_logon").trigger("click")
                }
    });

    /**
     * Logon Handler
     */
    $("#btn_logon").click(function() {
        // Clear all error messages
        $("#logon_form input ~ span[class='errmsg_inline_below']").html("").hide();
        $("#logon_errmsg").html("");
        $("#logon_status").hide();

        // Validation Test
        if ( ! $("#logon_form").valid()) {
            return false;
        }

        ajax({
            url : CONFIG.COMMON.API.SESSIONS.NEW.URL,
            type : CONFIG.COMMON.API.SESSIONS.NEW.TYPE,
            data : $.toJSON({
                request : {
                    account_name : $("input[name='username']").val(),
                    password : $("input[name='password']").val()
                }
            }),
            requiredLogon : false,
            success : function(data) {

                // Remember Me - Store into cookies
                if ($("#remember_me").attr("checked")) {
                    var username = $("input[name='username']").val();
                    // set cookies to expire in 14 days
                    $.cookie("username", username, { expires : 14 });
                    $.cookie("remember", true, { expires : 14 });
                } else {
                    // reset cookies
                    $.cookie("username", null);
                    $.cookie("remember", null);
                }

                gotoURL(CONFIG.COMPUTERS.URL)
            },
            error : function(xhr) {
                var status = xhr.status || null;

                if (status == 500) {
                    $("#logon_errmsg").html(L10N.COMMON.MSG_BOX_ERROR_INTERNAL);
                } else {
                    $("#logon_errmsg").html(L10N[PAGENAME].INVALID_USERNAME_PASSWORD);
                }

                $("#logon_status").show();
            }
        });

        return true;
    });

}());
