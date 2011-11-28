$(document).ready(function() {
    /**
     * Check Production Mode
     */
    if (CONFIG.COMMON.IN_PRODUCTION)
        return;

    /**
     * Data Preparation
     */
    var templates = {};

	// Make IP address list
	$.mockJSON.data.IPLIST = [];
	for (var i = 1; i <= 10; ++i) {
		for (var j = 1; j <= 255; ++j) {
			$.mockJSON.data.IPLIST.push("192.168." + i + "." + j);
		}
	}
	
	$.mockJSON(/..\/data\/computers.json/, {
		"response": {
			"sort" : {
				"name" : "id",
				"order" : 1 
			},
			"pagination" : {
				"page_number" : 1,
				"records_per_page" : 25,
				"total_pages" : 1,
				"total_records" : 10,
				"record_range" : {
					"from" : 1,
					"to" : 10 
				} 
			},
			"records|25-250": [
				{
					"ipaddr": "@IPLIST",
					"gid|1-10": 1,
					"type|1-2": 1,
					"_id|+1": 1,
					"name": "TW-@MALE_FIRST_NAME" 
				}
			]
		}
	});
	
    ajax({
        async : false,
        type : "GET",
        url : "../data/computers.json",
        success : function(data) {
            templates["computers"] = data;
        },
    });
	
    /**
     * Computers
     */
    $.mockjax({
        type : "GET",
        url : "/api/computers",
        response : function(settings) {
            var json = $.evalJSON(settings.data.json);
            var request = json.request || {};
            var response = {};

            response.records = [];
            for (var i in templates["computers"].response.records) {
                var record = templates["computers"].response.records[i];
                response.records.push(record);
            }
			
            var search_fields = [
                "name",
                "ipaddr"
            ];
            response = fn_search(request, response, search_fields);

            var filters_fields = {
                "type" : fn_filters_array
            };
            response = fn_filters(request, response, filters_fields);

            response = fn_sort(request, response);
            response = fn_pagination(request, response);

            response.fieldset = request.fieldset;

            this.responseText = $.toJSON({response:response});
        }
    });

    $.mockjax({
        type : "POST",
        url : "/api/computers?*&_method=DELETE",
        response : function(settings) {
            var regexp = /^\/api\/computers\?(.*)/;
            var r = settings.url.match(new RegExp(regexp));
            if (r) {
				var json = $.evalJSON(getURLParams(r[1])["json"]);
				var list = json["request"]["ids"];
				fn_delete(list, templates["computers"])
            }
            this.responseText = "";
        }
    });


    /**
     * Customized Columns
     */
    $.mockjax({
        type : "GET",
        url : "/api/columnlists/post/*",
        response : function(settings) {
            var response = templates["columnlists"].response;
            this.responseText = $.toJSON({response:response});
        }
    });

    $.mockjax({
        type : "POST",
        url : "/api/columnlists/post/*?_method=PUT",
        response : function(settings) {
            var json = $.evalJSON(settings.data) || {};
            var request = json.request || {};
            var response = { fieldset : request.fieldset };
            templates["columnlists"].response = response;
            this.responseText = $.toJSON(templates["columnlists"]);
        }
    });

    /**
     * Sessions
     */
    $.mockjax(function(settings) {
        if ((settings.type == "POST") && (strcasecmp(settings.url, "/api/sessions") == 0)) {
            var json = $.evalJSON(settings.data) || {};
            var request = json.request || {};
            var response = {};

            $.cookie("account_name", null);
            $.cookie("account_type", null);
            $.cookie("_id", null);

            if (request.account_name == 'admin') {
                response["status"] = 200;
                response["responseTime"] = 1000;
                response["responseText"] = "";
                $.cookie("account_name", "Administrator");
                $.cookie("account_type", "admin");
                $.cookie("_id", 1);
            } else if (request.account_name == 'user') {
                response["status"] = 200;
                response["responseTime"] = 1000;
                response["responseText"] = "";
                $.cookie("account_name", "User");
                $.cookie("account_type", "user");
                $.cookie("_id", 2);
            } else if (request.account_name == 'error') {
                response["status"] = 500;
                response["responseTime"] = 1000;
                response["responseText"] = "Internal Error";
            } else {
                response["status"] = 401;
                response["responseTime"] = 1000;
                response["responseText"] = "You have entered an invalid username or password.";
            }
            return response;
        } else if ((settings.type == "POST") && (strcasecmp(settings.url, "/api/sessions?_method=DELETE") == 0)) {
            var response = {};

            return response;
        }

        return;
    });

    /**
     * Helper Functions
     */
    fn_search = function(request, response, check_fields) {
        var keywords = empty(request.search.keywords) ? [] : request.search.keywords.split(" ");

        if (empty(keywords))
            return response;

        for (var i in response.records) {
            var record = response.records[i];
            var matched = false;
            for (var j in keywords) {
                var keyword = keywords[j];
                for (var k in check_fields) {
                    var field = check_fields[k];
                    if (stripos(getObjectValue(record, field), keyword) !== false) {
                        matched = true;
                        break;
                    }
                }
                if (matched)
                    break;
            }
            if ( ! matched) {
                delete response.records[i];
            }
        }
        return response;
    }

    function fn_filters_array(record, filter) {
        if (empty(filter))
            return true;

        return ! empty(array_intersect(record, filter));
    }

    function fn_filters_string(record, filter) {
        if (empty(filter))
            return true;

        return in_array(record, filter);
    }

    function fn_filters_dt_range(record, filter) {
        var needle = 0, dt_from = 0, dt_to = 0;

        if ( ! empty(filter.dt_from)) {
            dt_from = new Date().parseISO8601(filter.dt_from).getTime();
        }

        if ( ! empty(filter.dt_to)) {
            dt_to = new Date().parseISO8601(filter.dt_to).getTime();
        }

        if ( ! empty(record)) {
            needle = new Date().parseISO8601(record).getTime();
        }

        if ((dt_from > 0 || dt_to > 0) && needle == 0)
            return false; // N/A

        if (dt_from > 0 && needle < dt_from)
            return false;

        if (dt_to > 0 && needle > dt_to)
            return false;

        return true;
    }

    fn_filters = function(request, response, check_fields) {
        var records = [];
        var filters = request.filters;
        for (var i in response.records) {
            var record = response.records[i];
            var exist = true;
            for (var field in check_fields) {
                var fn = check_fields[field];

                if ( ! fn(getObjectValue(record, field), getObjectValue(filters, field))) {
                    exist = false;
                    break;
                }
            }
            if ( ! exist) {
                continue;
            }
            records.push(record);
        }

        response.records = records;

        return response;
    }

    fn_sort = function(request, response) {
        response.records = response.records.sort(function(a, b) {
			var oa = getObjectValue(a, request.sort.field);
			var ob = getObjectValue(b, request.sort.field);
			
            if (request.sort.order == 0) {
				if (is_int(oa) && is_int(ob)) {
					if (oa == ob) {
						return 0;
					} else {
						return oa < ob ? -1 : 1;
					}
				} else {
					return strcasecmp(oa, ob);
				}
            } else {
				if (is_int(oa) && is_int(ob)) {
					if (oa == ob) {
						return 0;
					} else {
						return oa < ob ? 1 : -1;
					}
				} else {
					return strcasecmp(ob, oa);
				}
            }
        });
        response.sort = request.sort;

        return response;
    }

    fn_pagination = function(request, response) {
        var page_number = parseInt(request.pagination.page_number) || 1;
        var records_per_page = parseInt(request.pagination.records_per_page) || 25;
        var total_pages = 1;
        var total_records = response.records.length;
        var begin = 0, end = 0;

        if (records_per_page > 0) {
            total_pages = parseInt(total_records / records_per_page);
            if (total_records % records_per_page != 0) {
                ++total_pages;
            }
        }

        if (page_number >= 1) {
            begin = (page_number - 1) * records_per_page;
            end = begin + records_per_page; 
        }

        response.pagination = {
            page_number : page_number,
            records_per_page : records_per_page,
            total_pages : total_pages,
            total_records : total_records,
            record_range : {
                from : begin + 1,
                to : end
            }
        };

        response.records = response.records.slice(begin, end);

        return response;
    }

    fn_delete = function(delete_records, data) {
        var records = [];
        for (var i = 0; i < data.response.records.length; ++i) {
            var record = data.response.records[i];
            if ( ! in_array(record._id, delete_records)) {
                records.push(record);
            }
        }

        data.response.pagination.total_records = records.length;
        data.response.records = records;
    }

});
