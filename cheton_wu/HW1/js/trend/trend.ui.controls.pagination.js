/**
 * Trend UI Controls - Pagination
 */

var Trend = Trend || {};
Trend.UI = Trend.UI || {};
Trend.UI.Controls = Trend.UI.Controls || {};
Trend.UI.Controls.Pagination = Trend.UI.Controls.Pagination || {};

(function() {

Trend.UI.Controls.Pagination = function(options) {
    var defaults = {
        pagination : {
            page_number : 1,
            records_per_page : 25,
            total_pages : 1,
            total_records : 0,
            record_range : {
                from : 0,
                to : 0
            }
        },
        fn : {
            change : function(pagination) {}
        },
        config : {
            per_page_default : 25,
            per_page_options : {
                25 : "25",
                50 : "50",
                100 : "100"
            },
            one_page_records : "Total: %total_records%",
            multi_page_records : "%from% - %to% of %total_records%",
            goto_page : "Page: %page_number% of %total_pages%",
            per_page : "%records_per_page% per page"
        }
    };

    options = $.extend({}, defaults, options);

    { // Page Records
        var data = {
            "%total_records%" : options.pagination.total_records
        };
        var subject = options.config.one_page_records;
        $(".txt_page_records").html(str_replace(array_keys(data), array_values(data), subject));
    }

    { // Goto Page
        var attrs = {
            "name" : "input_goto_page",
            "class" : "input_goto_page"
        };
        var data = {
            "%page_number%" : Trend.UI.Helpers.HTML().input(attrs, options.pagination.page_number),
            "%total_pages%" : options.pagination.total_pages
        };
        var subject = options.config.goto_page;
        $(".txt_goto_page").html(str_replace(array_keys(data), array_values(data), subject));
    }

    { // Per Page
        var attrs = {
            "name" : "select_per_page",
            "class" : "select_per_page"
        };
        var data = {
            "%records_per_page%" : Trend.UI.Helpers.HTML().dropdown(attrs, options.config.per_page_options, options.config.per_page_options_default)
        };
        var subject = options.config.per_page;
        $(".txt_per_page").html(str_replace(array_keys(data), array_values(data), subject));
    }
	
	/**
	 * First Page
	 */
	 
    $(".btn_pgnt_1st").addClass("btn_disable").attr("disabled", "true");
	$(".btn_pgnt_1st").click(function() {
		options.pagination.page_number = 1;
        options.fn.change(options.pagination);
    });
	
	/**
	 * Previous Page
	 */

    $(".btn_pgnt_prev").addClass("btn_disable").attr("disabled", "true");
	$(".btn_pgnt_prev").click(function() {
		if (options.pagination.page_number > 1) {
			--(options.pagination.page_number);
		}
        options.fn.change(options.pagination);
	});
	
	/**
	 * Next Page
	 */
	 
    $(".btn_pgnt_next").addClass("btn_disable").attr("disabled", "true");
	$(".btn_pgnt_next").click(function() {
		if (options.pagination.page_number < options.pagination.total_pages) {
			++(options.pagination.page_number);
		} 
        options.fn.change(options.pagination);
	});

	/**
	 * Last Page
	 */

    $(".btn_pgnt_last").addClass("btn_disable").attr("disabled", "true");
    $(".btn_pgnt_last").click(function() {
		options.pagination.page_number = options.pagination.total_pages;
        options.fn.change(options.pagination);
    });

	/**
	 * Goto Page
	 */

	// focus
    $(".input_goto_page").live("focus", function() {
        // Select input field contents
        $(this).select();
    });

	// keypress
	$(".input_goto_page").live("keypress", function(e) {
		var $this = $(this);
		
        if (e.keyCode == 13) {
            var page_number = $(this).val();

            if (/^\d\d*$/.test(page_number)) {
                var pagination = {
                    total_records: options.pagination.total_records,
                    records_per_page : options.pagination.records_per_page,
                    page_number : page_number
                };

                pagination = pagination_normalize(pagination);
                options.pagination.page_number = pagination.page_number;
                options.fn.change(options.pagination);
                return true;
			} else {
				$(this).attr("value", options.pagination.page_number).focus();
                return false;
			}
		}
	});
	
	/*
	 * Per Page
	 */
	
	$(".select_per_page").live("change", function() {
        var records_per_page = parseInt($(this).val());

        options.pagination.page_number = 1;
        options.pagination.records_per_page = records_per_page;
        options.fn.change(options.pagination);
	});

    function pagination_normalize(pagination) {
        var p = pagination;
        var tr = parseInt(pagination.total_records),
            rp = parseInt(pagination.records_per_page),
            pn = parseInt(pagination.page_number),
            tp = 1;

        if (tr > 0) {
            tp = (tr / rp);
            if ((tr % rp) != 0) {
                tp = parseInt(tp) + 1;
            }
            pn = (pn > tp) ? tp : pn; // Upper bound check
            pn = (pn < 1) ? 1 : pn; // Lower bound check
        } else {
            // The value of pn (page number) and tp (total pages) must be 1 
            // even if the value of tr (total records) is 0
            pn = 1;
            tp = 1;
            tr = 0;
        }

        p.total_records = tr;
        p.records_per_page = rp;
        p.page_number = pn;
        p.total_pages = tp;

        return p;
    }

    this.get = function() {
        return options;
    }

    this.set = function(pagination) {
        if (empty(pagination))
            return false;

        options.pagination = $.extend({}, defaults.pagination, pagination);
    }

    this.reload = function(pagination) {
        var attrs, data, subject;

        this.set(pagination);

        { // Page Records
            data = {
                "%from%" : options.pagination.record_range.from,
                "%to%" : options.pagination.record_range.to,
                "%total_records%" : options.pagination.total_records
            };
            subject = (options.pagination.total_pages <= 1) ? options.config.one_page_records : options.config.multi_page_records;
            $(".txt_page_records").html(str_replace(array_keys(data), array_values(data), subject));
        }

        { // Goto Page
            attrs = {
                "name" : "input_goto_page",
                "class" : "input_goto_page"
            };
            data = {
                "%page_number%" : Trend.UI.Helpers.HTML().input(attrs, options.pagination.page_number),
                "%total_pages%" : options.pagination.total_pages
            };
            subject = options.config.goto_page;
            $(".txt_goto_page").html(str_replace(array_keys(data), array_values(data), subject));
        }

        // First Page, Previous Page
        if (options.pagination.page_number > 1) {
            $(".btn_pgnt_1st").removeClass("btn_disable").removeAttr("disabled");
            $(".btn_pgnt_prev").removeClass("btn_disable").removeAttr("disabled");
        } else {
            $(".btn_pgnt_1st").addClass("btn_disable").attr("disabled", "true");
            $(".btn_pgnt_prev").addClass("btn_disable").attr("disabled", "true");
        }

        // Next Page, Last Page
        if (options.pagination.page_number < options.pagination.total_pages) {
            $(".btn_pgnt_next").removeClass("btn_disable").removeAttr("disabled");
            $(".btn_pgnt_last").removeClass("btn_disable").removeAttr("disabled");
        } else {
            $(".btn_pgnt_next").addClass("btn_disable").attr("disabled", "true");
            $(".btn_pgnt_last").addClass("btn_disable").attr("disabled", "true");
        }
    }

    return this;
}

})();

