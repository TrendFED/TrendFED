/**
 * Global variables
 */
var PAGENAME = getPageName();
var URLPARAMS = getURLParams();

var _account_type = $.cookie("account_type") || "admin";
var _account_name = $.cookie("account_name") || "Administrator";
var _id = $.cookie("_id") || 1;
$("body").show();

/**
 * Header and Footer
 */
$(document).ready(function() {
    // Header
	var top_header = ''
    + '<div class="logon_portal">'
    + '<span id="logon_info"></span> | <a href="#" id="logoff">' 
    + L10N.COMMON.LOGOFF
    + '</a>'
	+ ' | <span class="help-icon"></span>'
	+ '</div>'
	+ '<div class="logon_extra">'
	+ '<p></p>'
	+ '</div>'
	+ '<h1 class="tm_banner">'
    + '<span class="product_logo"></span>'
    + '<span class="product_banner"></span>'
	+ '<span class="product_powerby float_box_right pad_10"></span>'
    + '</a>'
    + '</h1>';
	
    $(".top").html(top_header);

    { // Logon/Logoff
        var logon_info = L10N.COMMON.LOGON_INFO.replace(/%user%/, _account_name);
        $("#logon_info").html(logon_info);
        $('#logoff').click(function(){
            ajax({
                url : CONFIG.COMMON.API.SESSIONS.DELETE.URL.replace(/%id%/, _id),
                type : CONFIG.COMMON.API.SESSIONS.DELETE.TYPE,
                success : function(data) {
                    gotoURL(CONFIG.LOGON.URL);
                },
                error : function(xhr) {
                    gotoURL(CONFIG.LOGON.URL);
                }
            });

            return false;
        });
    }

    // Footer
	var footer = '<div class="footer_content">' + L10N.COMMON.COPYRIGHT_NOTICE + '</div>';
    $(".footer").html(footer);

});

$(document).ready(function() {
    var close_timer = 0;
    var $nav_item = null;
    var $arrow_img = null;
    var $ddm_item = 0;
    var img_arrow_dw = "../skins/" + CONFIG.COMMON.SKIN + "/images/top_nav_arrow.gif";
    var img_arrow_rw = "../skins/" + CONFIG.COMMON.SKIN + "/images/top_nav_arrow_up.gif";

    if (CONFIG.COMMON.BROWSER_DIRECTION == "rtl") {
        //$("body").addClass("rtl");
        img_arrow_rw = "../skins/" + CONFIG.COMMON.SKIN + "/images/top_nav_arrow_up_rtl.gif";
    }

	function renderNavBar(nav_items) {
		function renderItems(prefix, items) {
			var html = '';
			for (var name in items) {
				var text = L10N.COMMON.NAV_ITEMS[name] || "";
                if (prefix.length == 0) {
				    html += '<li rev="' + name + '">';
                } else {
				    html += '<li rev="' + prefix + '_' + name + '">';
                }
				if (is_string(items[name])) {
                    var link = items[name];
					html += '<a href="' + link + '">&nbsp;' + text + '&nbsp;</a>';
                } else {
                    var link = "#";
					html += '<a href="' + link + '">&nbsp;' + text + '&nbsp;<span class="sub_nav"><img src="'+ img_arrow_rw +'" align="absmiddle"></span></a>';
					html += '<ul class="ddm" id="ddm_' + name + '">';
					html += renderItems(prefix + '_' + name, items[name]);
					html += '</ul>';
				}
				html += '</li>' + "\n";
			}
			return html;
		}
		var html = '';
		html += '<ul id="nav_main" class="nav_main">';
		html += renderItems('', nav_items);
		html += '</ul>';

		return html;
	}

    // Render Navigation Bar
    //$('.nav').html(renderNavBar(CONFIG.COMMON.NAV_ITEMS[_account_type]));
    $('#nav_main > li').bind('mouseover', __openDDMenu);
    $('#nav_main > li').bind('mouseout',  __setDDMTimer);
    //$('ul#nav_main').removeClass('activate');
    //$('ul#nav_main').children('li[rev="' + $('.nav').attr('rel') + '"]').addClass('activate');

	function __openDDMenu() {
		__cancelDDMTimer();
		__closeDDMenu();
		$ddm_item = $(this).find('ul').css('display', 'block');
		$nav_item = $(this);
		$arrow_img = $nav_item.children('a').children('span').children('img');
		$nav_item.addClass('hovered');
		$arrow_img.attr('src', img_arrow_dw);
	}
	
	function __closeDDMenu() {
		if ($ddm_item) {
			$ddm_item.css('display', 'none');
			$nav_item.removeClass('hovered');
			$arrow_img.attr('src', img_arrow_rw);
		}
	}
	
	function __setDDMTimer() {
		close_timer = window.setTimeout(__closeDDMenu, CONFIG.COMMON.DDM_TIMEOUT);
	}
	
	function __cancelDDMTimer() {
		if (close_timer) {
			window.clearTimeout(close_timer);
			close_timer = null;
		}
	}
});

/**
 * Common
 */
$(document).ready(function() {
    // Localization
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
	$("input[type='button'],input[type='submit'],input[type='reset'],input[type='hidden']").each(function() {
		var value = $(this).attr("value") || "";
		if (value.length > 6) {
			$(this).css("width", "auto");
		}
	});

    // Breadcrumbs - the breadcrumbs will be displayed only if its type is an array
    var breadcrumbs_template = L10N.COMMON.BREADCRUMBS;
    if (isset(L10N[PAGENAME]) && is_array(L10N[PAGENAME].BREADCRUMBS)
        && isset(CONFIG[PAGENAME]) && is_array(CONFIG[PAGENAME].BREADCRUMBS)) {
        var html = breadcrumbs({tmpl : L10N.COMMON.BREADCRUMBS, names : L10N[PAGENAME].BREADCRUMBS, urls : CONFIG[PAGENAME].BREADCRUMBS});
        $("#breadcrumbs").html(html);
    }
	
	$(".popup-menu").html("<ul><li>What's New</li><li>Content and Index</li><li>Knowledge Base</li><li>Security Info</li><li>Sales</li><li>Support</li><li>About</li></ul>");
	$(".popup-menu,.arrow").hide();
	
	$("span.help-icon").mouseenter(function() {
		$(".popup-menu,.arrow").show();
	});
	
	$(".popup-menu").mouseleave(function() {
		$(".popup-menu,.arrow").hide();
	});

});

/**************************************************
 * Idle Timer
 **************************************************/
/*$(document).ready(function() {
						   
	// idleTimer() takes an optional argument that defines the idle timeout
	// timeout is in milliseconds; defaults to 30000
	$.idleTimer(CONFIG['common'].IDLE_TIMEOUT*1000);
	 
	$(document).bind("idle.idleTimer", function(){
        window.alert(l10n.common.MSG_BOX_SESSION_TIMEOUT);
		gotoURL("../auth/logoff");
	});

});*/


