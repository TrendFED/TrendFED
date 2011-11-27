/**
 * Trend UI Controls - Search
 */

var Trend = Trend || {};
Trend.UI = Trend.UI || {};
Trend.UI.Controls = Trend.UI.Controls || {};
Trend.UI.Controls.Search = Trend.UI.Controls.Search || {};

(function() {

Trend.UI.Controls.Search = function(options) {
    var defaults = {
        input : null,
        input_text : "",
        button : null,
        image : null,
        fn : {
            search : function(keywords) {},
            cancel : function() {}
        }
    };

    var config = $.extend({}, defaults, options);

    if ( ! config.input || ! config.button || ! config.image) {
        return;
    }

    config.input.bind({
        focus : function() {
            $(this).select();
        },
        focusin : function() {
            if ($(this).hasClass("txt_disabled")) {
                $(this).removeClass("txt_disabled");
                $(this).val("");
            }
        },
        focusout : function() {
            if ($(this).val().length == 0 && config.image.hasClass("btn_search_go")) {
                $(this).addClass("txt_disabled");
                $(this).val(config.input_text);
            }
        },
        keydown : function(e) {
            if (e.keyCode == 27) { // when escape key is pressed
                config.image.removeClass("btn_search_stop").addClass("btn_search_go");
                config.input.addClass("txt_disabled");
                config.input.val(config.input_text);
                config.fn.cancel();
                config.button.focus();
                return false;
            } else if (e.keyCode == 13) { // when enter key is pressed
                var keywords = config.input.hasClass("txt_disabled") ? "" : config.input.val();
                config.image.removeClass("btn_search_go").addClass("btn_search_stop");
                config.input.removeClass("txt_disabled");
                config.fn.search(keywords);
                return false;
            } else {
                var val = $(this).val();
                if (val.length > 0) {
                    config.image.removeClass("btn_search_stop").addClass("btn_search_go");
                } else if (val.length == 0) {
                    config.image.removeClass("btn_search_go").addClass("btn_search_stop");
                }
            }
        }
    });

    config.button.click(function(e){
        if (config.input.hasClass("txt_disabled") && config.image.hasClass("btn_search_go")) {
            e.preventDefault();
            return false;
        }

        if (config.image.hasClass("btn_search_go")) {
            var keywords = config.input.hasClass("txt_disabled") ? "" : config.input.val();
            config.image.removeClass("btn_search_go").addClass("btn_search_stop");
            config.input.removeClass("txt_disabled");
            config.fn.search(keywords);
        } else if (config.image.hasClass("btn_search_stop")) {
            config.image.removeClass("btn_search_stop").addClass("btn_search_go");
            config.input.addClass("txt_disabled");
            config.input.val(config.input_text);
            config.fn.cancel();
        }
    });

    this.search = function(keywords) {
        config.image.removeClass("btn_search_go").addClass("btn_search_stop");
        config.input.removeClass("txt_disabled");
        if (isset(keywords)) {
            config.input.val(keywords);
        }
        config.fn.search(keywords);
    }

    this.cancel = function() {
        config.image.removeClass("btn_search_stop").addClass("btn_search_go");
        config.input.addClass("txt_disabled");
        config.input.val(config.input_text);
        config.fn.cancel();
    }

    return this;
}

})();
