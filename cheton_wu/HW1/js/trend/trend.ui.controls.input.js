/**
 * Trend UI Controls - Input
 */

var Trend = Trend || {};
Trend.UI = Trend.UI || {};
Trend.UI.Controls = Trend.UI.Controls || {};
Trend.UI.Controls.Input = Trend.UI.Controls.Input || {};

(function() {

Trend.UI.Controls.Input = function(options) {
    var defaults = {
        input : null,
        text : "",
        change : function(config) { }
    };

    var config = $.extend({}, defaults, options);

    if ( ! config.input) {
        return;
    }

    config.input.bind({
        focus : function() {
            $(this).select();
        },
        focusin : function() {
            if (config.input.val() == config.text) {
                config.input.val("");
            }
        },
        focusout : function() {
            if (config.input.val().length == 0) {
                config.input.val(config.text);
            } else {
                config.change(config);
            }
        },
        keydown : function(e) {
            if (e.keyCode == 27) { // when escape key is pressed
                config.input.val(config.text);
                return false;
            } else {
                if (config.input.val() == config.text) {
                    config.input.val("");
                }
            }
        },
        change : function() {
            config.change(config);
        }
    });

    return this;
}

})();
