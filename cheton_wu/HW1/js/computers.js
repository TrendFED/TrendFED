$(function() {
    var pageview = "default"; // default or search
    var ajax_request = { 
        search : {
            keywords : ""
        },
        filters : {
            type : ""
        },
        pagination : {
            page_number : 1,
            records_per_page : 25
        },
        sort : {
            field : "_id",
            order : 0
        },
        fieldset : [
        ]
    };
    var pagination = new Trend.UI.Controls.Pagination({
        pagination : {
            page_number : ajax_request.pagination.page_number,
            records_per_page : ajax_request.pagination.records_per_page
        },
        fn : {
            change : function(pagination) { // pagination change
                ajax_request.pagination.page_number = pagination.page_number;
                ajax_request.pagination.records_per_page = pagination.records_per_page;
                ajax_query(ajax_request);
            }
        },
        config : {
            per_page_default : CONFIG.COMMON.PAGINATION.PER_PAGE_DEFAULT,
            per_page_options : L10N.COMMON.PAGINATION.PER_PAGE_OPTIONS,
            one_page_records : L10N.COMMON.PAGINATION.ONE_PAGE_RECORDS,
            multi_page_records : L10N.COMMON.PAGINATION.MULTI_PAGE_RECORDS,
            goto_page : L10N.COMMON.PAGINATION.GOTO_PAGE,
            per_page : L10N.COMMON.PAGINATION.PER_PAGE
        }
    });
    var customized_columns = array_keys(CONFIG[PAGENAME][pageview.toUpperCase()].FIELDSET);
    var cross_checked_records = [];

    page_init();
    ajax_query(ajax_request);

    function switch_pageview(pageview) {
        if (pageview == "search") {
            { // breadcrumbs
                var names = L10N[PAGENAME].BREADCRUMBS.SEARCH || [];
                var urls = CONFIG[PAGENAME].BREADCRUMBS.SEARCH || [];
                var html = breadcrumbs({tmpl : L10N.COMMON.BREADCRUMBS, names : names, urls : urls});
                $("#breadcrumbs").html(html);
            }
            { // switch to search content
				$("#default_content").hide();
				$("#search_content").show();
			}
            { // switch to search fieldset
                ajax_request.fieldset = array_keys(CONFIG[PAGENAME].SEARCH.FIELDSET);
            }
        } else if (pageview == "default") {
            { // breadcrumbs
                var names = L10N[PAGENAME].BREADCRUMBS.DEFAULT || [];
                var urls = CONFIG[PAGENAME].BREADCRUMBS.DEFAULT || [];
                var html = breadcrumbs({tmpl : L10N.COMMON.BREADCRUMBS, names : names, urls : urls});
                $("#breadcrumbs").html(html);
            }
            { // switch to default content
                $("#search_content").hide();
                $("#default_content").show();
			}
            { // switch to default fieldset
                ajax_request.fieldset = array_keys(CONFIG[PAGENAME].DEFAULT.FIELDSET);
            }
        }
    }

    function page_init() {
	    if (isset(URLPARAMS['q']) && URLPARAMS['q'].length > 0) {
            pageview = "search";
            switch_pageview(pageview);
            $("input[name='input_search']").removeClass("txt_disabled").val(URLPARAMS['q']);
            ajax_request.search.keywords = $("input[name='input_search']").val();
	    } else {
            pageview = "default";
            switch_pageview(pageview);
	    }
	
		/**
		 * Filters 
		 */
        // Create select elements with drop down lists
        var fieldset = [
            "type"
        ];
        for (var i in fieldset) {
            var field = fieldset[i];
            var attrs = {
                "name" : "select-" + field,
                "class" : "w100p"
            };
            var options = L10N.COMMON.API.COMPUTERS.SCHEMA.FIELDSET[field].values;
            var html = Trend.UI.Helpers.HTML().dropdown(attrs, options, "all");
            $("#filters span[name='filters-" + field + "']").html(html);
        }

        // Go filters
        $("#filters #btn_go_filters").click(function() {
            var $filters = $("#filters");
            var account_type = $filters.find("select[name='select-account_type']").val();
            var status = $filters.find("select[name='select-status']").val();

            ajax_request.filters.account_type = (account_type == "all" ? [] : [ account_type ]);
            ajax_request.filters.status = (status == "all" ? [] : [ parseInt(status) ]);

            ajax_query(ajax_request);
        });

        //$("#filters").show();

        /**
         * Action Button
         */
        $(".dt_act_icons.new").addClass("disabled"); // disabled by default
        $(".dt_act_icons.new").click(function() {
            gotoURL(CONFIG.ACCOUNTS_ADD.URL);

            return false;
        });

        $(".dt_act_icons.delete").addClass("disabled"); // disabled by default
        $(".dt_act_icons.delete").click(function() {
            if ($(this).hasClass("disabled")) {
                return false;
            }
            var checked_records = [];
            $(".datatable tbody .col_first-child > input:checkbox:checked").each(function() {
                var record_id = $(this).next("input:hidden").val();
                checked_records.push(record_id);
            });
            if (checked_records.length > 0 && confirm(L10N[PAGENAME].DELETE_SELECTED_ITEMS)) {
                ajax({
                    type : CONFIG.COMMON.API.COMPUTERS.DELETE.TYPE,
                    url : CONFIG.COMMON.API.COMPUTERS.DELETE.URL,
                    query : {
                        "json" : $.toJSON({
                            request : {
                                ids : checked_records
                            }
                        })
                    },
                    success : function(data) {
                        // removed checked records from the cross_checked_records array
                        cross_checked_records = array_values(array_diff(cross_checked_records, checked_records));
                    },
                    error : function() {  }
                });
                ajax_query(ajax_request);
            }

            return false;
        });

        /**
         * Search
         */

        var search = new Trend.UI.Controls.Search({
            input : $("input[name='input_search']"),
            input_text : L10N[PAGENAME].INPUT_SEARCH_ITEMS,
            button : $("button[name='btn_search']"),
            image : $("button[name='btn_search'] span"),
            fn : {
                search : function(keywords) {
                    if (pageview != "search") {
                        pageview = "search";
                        switch_pageview(pageview);
                    }
                    ajax_request.search.keywords = keywords;
                    ajax_query(ajax_request);
                },
                cancel : function(keywords) {
                    if (pageview != "default") {
                        pageview = "default";
                        switch_pageview(pageview);
                    }
                    ajax_request.search.keywords = "";
                    ajax_query(ajax_request);
                }
            }
        });

	    /**
	     * Column Sorting
	     */

	    $(".datatable th[class!='col_first-child']").live("click", function() {
            var field_name = $(this).find("a").attr("name");
            if ( ! is_string(field_name)) {
                return;
            }
            // Removes header prefix "dt_th-"
            var sort_field = field_name.slice("dt_th-".length);
            if (strcasecmp(sort_field, ajax_request.sort.field) !== 0) {
                ajax_request.sort.field = sort_field;
            } else {
                ajax_request.sort.order = ajax_request.sort.order ? 0 : 1;
            }
            ajax_query(ajax_request);
        });
    }
	
	
    function ajax_query(ajax_request) {
        $("#" + pageview + "_content").html($("#loader_template").tmpl());
        ajax({
            type : CONFIG.COMMON.API.COMPUTERS.LIST.TYPE,
            url : CONFIG.COMMON.API.COMPUTERS.LIST.URL,
            data : $.toJSON({ request : ajax_request }),
            success : ajax_success,
            error : ajax_error,
        });
    }

    function ajax_success(json) {
        var response = json.response;
		
		/**
		 * Pagination
		 */

        pagination.reload(response.pagination);
		
        /**
         * DataTable
         */

        if (empty(response.records)) {
            $("#" + pageview + "_content").html($("#empty_template").tmpl({empty_result : L10N.COMMON.DATATABLE.EMPTY_RESULT}));
            return;
        }

        { // Customize Columns
            var ordered_fieldset = array_keys(CONFIG[PAGENAME][pageview.toUpperCase()].FIELDSET);
            if (empty(response.fieldset)) {
                response.fieldset = ordered_fieldset;
            } else {
                response.fieldset = array_values(array_intersect(ordered_fieldset, response.fieldset));
            }
            response.fieldset = array_values(array_intersect(response.fieldset, customized_columns));
        }
		
		{ // Template Help Functions
            fn_checked = function(record) {
                return in_array(record._id, cross_checked_records);
            },
            fn_editable = function(record) {
				return true;
				/*
                if (strcasecmp($.cookie("account_type"), "admin") !== 0) {
                    return false;
                }
                if (strcasecmp("admin", record.account_name) === 0) {
                    return false;
                }
                return (strcasecmp($.cookie("account_name"), record.account_name) !== 0);
				*/
            },
    	    fn_getEditURL = function() {
        	    return CONFIG.COMPUTERS_EDIT.URL;
	        },
            fn_getFieldValue = function(field) {
                return L10N.COMMON.API.COMPUTERS.SCHEMA.FIELDSET[field].name || field;
            },
            fn_getRecordFieldValue = function(record, field) {
                var value = getObjectValue(record, field);
                var l10n_values = L10N.COMMON.API.COMPUTERS.SCHEMA.FIELDSET[field].values || {};
                return l10n_values[value] || value;
            }
		}
		
		{ // Template Content
			var html = $("#default_template").tmpl(response, {
                checked : fn_checked,
                editable : fn_editable,
	    	    getEditURL: fn_getEditURL,
    	        getFieldValue : fn_getFieldValue,
	            getRecordFieldValue : fn_getRecordFieldValue
		    });
            $("#" + pageview + "_content").html(html);
		}

        { // CheckboxSet
            var data = {
                check_records : {}
            };
            for (var i = 0; i < response.records.length; ++i) {
                if ( ! fn_editable(response.records[i])) {
                    continue;
                }
                var record_number = i + response.pagination.record_range.from;
                var record_id = response.records[i]._id;
                if (in_array(record_id, cross_checked_records)) {
                    data["check_records"]["check_record_" + record_number] = { checked : true };
                } else {
                    data["check_records"]["check_record_" + record_number] = { checked : false };
                }
            }

            $("#default_content,#search_content").each(function() {
                var $this = $(this);
                $this.checkboxset({
                    tristate : true,
                    data : data,
                    change: function(name, index) {
                        /**
                         * Enable/Disable Delete Button
                         */
                        var checked = $this.find("input[name='check_records']").attr("checked");
                        if (checked) {
                            $(".dt_act_icons.delete").removeClass("disabled");
                        } else {
                            $(".dt_act_icons.delete").addClass("disabled");
                        }

                        /**
                         * Cross-Checked Records
                         */
                        var checked_records = [], unchecked_records = [];
                        for (var i = 0; i < response.records.length; ++i) {
                            var record_number = i + response.pagination.record_range.from;
                            var checked = $this.find("input[name='check_record_" + record_number + "']").attr("checked");
                            var record_id = $this.find("input[name='dt_td-record_" + record_number + "']").val();
                            if (checked) {
                                if ( ! in_array(record_id, cross_checked_records)) {
                                    cross_checked_records.push(record_id);
                                }
                            } else {
                                var key = array_search(record_id, cross_checked_records);
                                if (key !== false) {
                                    delete cross_checked_records[key];
                                    cross_checked_records = array_values(cross_checked_records);
                                }
                            }
                        }
                    }
                });
            });
			
			{ // Enable/Disable Delete Button
				$("#default_content,#search_content").each(function() {
					var $this = $(this);
					var checked = $this.find("input[name='check_records']").attr("checked");
					if ( ! isset(checked))
						return false;
						
					if (checked) {
						$(".dt_act_icons.delete").removeClass("disabled");
					} else {
                        $(".dt_act_icons.delete").addClass("disabled");
                    }
				});
			}
        }
    }

    function ajax_error(xhr, textStatus) {
        // TODO: Error Message
        $("#" + pageview + "_content").html($("#empty_template").tmpl({empty_result : L10N.COMMON.DATATABLE.EMPTY_RESULT}));
    }

});
