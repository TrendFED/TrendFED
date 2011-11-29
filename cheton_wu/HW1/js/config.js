if ($.cookie("skin")) {
    CONFIG.COMMON.SKIN = $.cookie("skin") || CONFIG.COMMON.DEFAULT_SKIN;
}

var CONFIG = {
	COMMON : {
        SKIN : "default",
        DEFAULT_SKIN : "default",
        IN_PRODUCTION : 0, // 1: production mode, 0: development mode
        BROWSER_DIRECTION : "ltr", // ltr: left-to-right, rtl: right-to-left
        BROWSER_WINDOW : {
            MIN_WIDTH : 1024,
            MIN_HEIGHT : 768
        },
        AJAX_TIMEOUT : 30, // unit: seconds
        DDM_TIMEOUT : 500, // set the showed/hidden delay time of Dropdown Menu; unit -> microseconds
        IDLE_TIMEOUT : 1800, // unit: seconds
        PAGINATION : {
            PER_PAGE_DEFAULT : 25
        },
        CONTENT_TYPE : {
            APPLICATION : {
                JSON : "application/json",
                X_WWW_FORM_URLENCODED : "application/x-www-form-urlencoded"
            }
        },
        NAV_ITEMS : {
			"admin" : {
				"favorite" : {
					"add" : "#",
					"scan_now" : "#",
					"update_now" : "#"
				},
				"dashboard" : "#",
				"management" : "#",
				"endpoints": "#",
				"services": "#",
				"logs": "#",
				"reports": "#",
				"updates": "#",
				"administration": "#"
			}
        },
        API : {
            /**
             * Computers
             */
            COMPUTERS : {
                LIST : {
                    TYPE : "GET",
                    URL : "/api/computers"
                },
                LOAD : {
                    TYPE : "GET",
                    URL : "/api/computers/%id%"
                },
                NEW : {
                    TYPE : "POST",
                    URL : "/api/computers"
                },
                UPDATE : {
                    TYPE : "PUT",
                    URL : "/api/computers/%id%"
                },
                DELETE : {
                    TYPE : "DELETE",
                    URL : "/api/computers",
                }
            },
            /**
             * Sessions
             */
            SESSIONS : {
                NEW : {
                    TYPE : "POST",
                    URL : "/api/sessions"
                },
                DELETE : {
                    TYPE : "DELETE",
                    URL : "/api/sessions/%id%"
                }
            }
        }
	},
    INDEX : {
        URL : "index.html",
        BREADCRUMBS : {
            DEFAULT : [""],
            SEARCH : ["index.html",""]
        },
        DEFAULT : {
            FIELDSET : { // The header field names must be in all lower case
                "_id" : {},
				"name" : {},
                "ipaddr" : {},
                "gid" : {},
                "type" : {}
            }
        },
        SEARCH : {
            FIELDSET : { // The header field names must be in all lower case
                "_id" : {},
				"name" : {},
                "ipaddr" : {},
                "gid" : {},
                "type" : {}
            }
        }
    },
	LOGON : {
		URL : "logon.html"
	}
};
