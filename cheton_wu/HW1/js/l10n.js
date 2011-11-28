/**
 * NOTE: for the character double quote ("), please remember to add an prefix escape character (\), ex. \",
 */

/**
 * Usage:
 *   L10N["common"].PRODUCT_NAME
 */
var L10N = {
    COMMON : {
        PRODUCT_NAME : "Trend Micro&trade; Service Conducting Organizer",
        PRODUCT_LONG_NAME : "Trend Micro&trade; Service Conducting Organizer",
        PRODUCT_FULL_NAME : "Service Conducting Organizer",
        PRODUCT_SHORT_NAME : "SCO",
        PRODUCT_BANNER : "Service Conducting Organizer",
        COPYRIGHT_NOTICE : "Copyright&copy; 2011. Trend Micro Incorporated. All rights reserved.",
        LOGON_INFO : "Logged on as: %user% ",
        LOGOFF : "Log off",
        HELP_ICON_TITLE : "Help",
        BREADCRUMBS : "You are here: %breadcrumbs%",
        PAGINATION : {
            ONE_PAGE_RECORDS : "Total: %total_records%",
            MULTI_PAGE_RECORDS : "%from% - %to% of %total_records%",
            GOTO_PAGE : "Page: %page_number% of %total_pages%",
            PER_PAGE : "%records_per_page% per page",
            PER_PAGE_OPTIONS : {
                25 : "25",
                50 : "50",
                100 : "100"
            }
        },
        DATATABLE : {
            EMPTY_RESULT : "Empty result",
            RELOAD_AGAIN : "Please refresh the page and try again."
        },
        /**
         * Navigation Bar
         */
        NAV_ITEMS : {
				"add" : "Add current page for Favorites",
				"scan_now" : "Scan Now for All Domain",
				"update_now" : "Update Server Now",
				"favorite" : "Favorite",
				"dashboard" : "Dashboard",
				"management" : "Management",
				"endpoints": "Endpoints",
				"services": "Services",
				"logs": "Logs",
				"reports": "Reports",
				"updates": "Updates",
				"administration": "Administration"
        },

        API : {
            /**
             * Computers
             */
            COMPUTERS : {
                SCHEMA : {
                    FIELDSET : { // The field names must be in all lower case
                        "_id" : {
                            name : "ID"
                        },
                        "ipaddr" : {
                            name : "IP Address"
                        },
                        "type" : {
                            name : "Type",
                            values : {
								"all" : "All Types",
                                "1" : "Server",
                                "2" : "Desktop"
                            }
                        },
                        "name" : {
                            name : "Computer Name"
                        },
                        "gid" : {
                            name : "Group ID"
                        }
                    }
                }
            },
        },
        TOOLTIP : {
        }
    },
    INDEX : {
        BREADCRUMBS : {
            DEFAULT : ["Computers"],
            SEARCH : ["Computers","Search Results"]
        },
        INPUT_SEARCH_ITEMS : "Search by computer name or ip address",
        DELETE_SELECTED_ITEMS : "Are you sure you want to delete the accounts that you have selected?",
        IMG_TITLE_ENABLE_ACCOUNT : "Click to enable account",
        IMG_TITLE_DISABLE_ACCOUNT : "Click to disable account"
    },
	LOGON : {
		EMPTY_USERNAME : "Empty username",
		EMPTY_PASSWORD : "Empty password",
		INVALID_USERNAME_PASSWORD : "Invalid username or password"
	}
}
