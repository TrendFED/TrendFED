// set namespace
var nsTrendWidget = Trend.namespace("Trend.widget");
//Trend.namespace("Trend.widget.hanwen_chang");

// widget base constructor + attributes
nsTrendWidget.hanwen_chang = function() {
    this.data = "";
    this.renderChart = function() {
        if (this.data) {
            return '<img src="' + this.data + '" />';
        } else {
            return '<span>No data specified.</span>';
        }
    };
};

Trend.inherit(Trend.widget.hanwen_chang, Trend.widget.Base);